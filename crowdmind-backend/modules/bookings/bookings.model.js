const db = require('../../config/db');
const crypto = require('crypto');

class BookingsModel {
    // OS-inspired First-Fit Contiguous Seat Allocation & Booking Transaction
    static async createBooking(user_id, event_id, venue_id, requested_seat_count) {
        const client = await db.connect();
        
        try {
            // 1. Enter Critical Section: Begin Transaction
            await client.query('BEGIN');

            // 2. Fetch available seats for the venue with a Mutex Lock (SELECT FOR UPDATE)
            // This prevents race conditions (Critical Section Mutual Exclusion)
            const seatsQuery = `
                SELECT id, seat_number, status 
                FROM seats 
                WHERE venue_id = $1 AND status = 'available' 
                ORDER BY id ASC 
                FOR UPDATE
            `;
            const seatResult = await client.query(seatsQuery, [venue_id]);
            const availableSeats = seatResult.rows;

            if (availableSeats.length < requested_seat_count) {
                throw new Error('Not enough contiguous/available seats left in memory.');
            }

            // 3. First-Fit Allocation Algorithm (OS Memory Management approach)
            // Allocates the first N contiguous or sequential free blocks found in the pool
            const allocatedSeats = availableSeats.slice(0, requested_seat_count);
            const seatIds = allocatedSeats.map(seat => seat.id);

            // 4. Update seat statuses to 'booked' to prevent reuse
            await client.query(
                `UPDATE seats SET status = 'booked' WHERE id = ANY($1::int[])`,
                [seatIds]
            );

            // 5. Generate unique cryptographic tokens for verification (OS Spooling/Metadata style)
            const bookingRefCode = 'CM-' + crypto.randomBytes(4).toString('hex').toUpperCase();
            const qrHash = crypto.createHash('sha256').update(bookingRefCode + user_id + Date.now()).digest('hex');
            const totalAmount = requested_seat_count * 150.00; // Flat price per seat for demo

            // 6. Insert booking record
            const bookingQuery = `
                INSERT INTO bookings (booking_ref_code, user_id, event_id, seat_ids, total_amount, qr_code_hash, payment_status)
                VALUES ($1, $2, $3, $4, $5, $6, 'success')
                RETURNING *
            `;
            const bookingValues = [bookingRefCode, user_id, event_id, seatIds, totalAmount, qrHash];
            const bookingResult = await client.query(bookingQuery, bookingValues);

            // 7. Exit Critical Section: Commit Transaction
            await client.query('COMMIT');
            return bookingResult.rows[0];

        } catch (err) {
            // Rollback changes if any error occurs (Deadlock or low memory/seats)
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    // Verify QR code ticket (Admin scan action)
    static async verifyTicket(booking_ref_code) {
        const query = `
            UPDATE bookings 
            SET is_verified = TRUE 
            WHERE booking_ref_code = $1 AND is_verified = FALSE
            RETURNING *
        `;
        const result = await db.query(query, [booking_ref_code]);
        return result.rows[0];
    }
}

module.exports = BookingsModel;
