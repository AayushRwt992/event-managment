const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Imports the pool from step 1

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET Booked Seats for an Event
app.get('/api/events/:id/seats', async (req, res) => {
  const { id } = req.params;
  try {
    const eventQuery = await pool.query('SELECT venue_id FROM events WHERE id = \$1', [id]);
    if (eventQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    const venueId = eventQuery.rows[0].venue_id;

    const seatsQuery = await pool.query(
      "SELECT id, seat_number, status FROM seats WHERE venue_id = \$1 AND status != 'available'",
      [venueId]
    );

    res.json({ 
      venueId,
      bookedSeats: seatsQuery.rows.map(row => row.seat_number),
      seatDetails: seatsQuery.rows 
    });
  } catch (err) {
    console.error('Error fetching seats:', err.message);
    res.status(500).json({ error: 'Failed to retrieve seats from database' });
  }
});

// 2. POST Book Seats with ACID Transaction Protection
app.post('/api/events/:id/book', async (req, res) => {
  const { id } = req.params;
  const { seats, totalAmount, userId } = req.body;

  if (!seats || seats.length === 0) {
    return res.status(400).json({ error: 'No seats selected.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Start ACID Transaction

    const eventRes = await client.query('SELECT venue_id FROM events WHERE id = \$1', [id]);
    if (eventRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Event not found' });
    }
    const venueId = eventRes.rows[0].venue_id;

    // Concurrency check: Ensure requested seats are not already booked
    const conflictCheck = await client.query(
      `SELECT seat_number FROM seats 
       WHERE venue_id = $1 AND seat_number = ANY($2::text[]) AND status = 'booked'`,
      [venueId, seats]
    );

    if (conflictCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ 
        error: `Conflict: Seats already booked: ${conflictCheck.rows.map(r => r.seat_number).join(', ')}` 
      });
    }

    // Update seat status to 'booked'
    const seatIdsArray = [];
    for (let seatNum of seats) {
      const seatUpdate = await client.query(
        `UPDATE seats SET status = 'booked' 
         WHERE venue_id = $1 AND seat_number = $2 
         RETURNING id`,
        [venueId, seatNum]
      );
      if (seatUpdate.rows.length > 0) {
        seatIdsArray.push(seatUpdate.rows[0].id);
      }
    }

    // Insert record into bookings table matching your schema columns
    const refCode = `CMD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const qrHash = `qr-hash-${refCode}-${Date.now()}`;

    const bookingInsert = await client.query(
      `INSERT INTO bookings (booking_ref_code, user_id, event_id, seat_ids, total_amount, qr_code_hash, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, 'success')
       RETURNING id, booking_ref_code`,
      [refCode, userId || 1, id, seatIdsArray, totalAmount, qrHash]
    );

    await client.query('COMMIT'); // Commit Transaction

    res.status(201).json({
      success: true,
      message: 'Booking committed successfully to database.',
      bookingId: bookingInsert.rows[0].id,
      refCode: bookingInsert.rows[0].booking_ref_code,
      qrHash
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction rollback due to error:', err.message);
    res.status(500).json({ error: 'Database transaction failed.' });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
