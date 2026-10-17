const BookingsModel = require('./bookings.model');

// Create a booking using OS First-Fit & Transaction Locking
exports.createBooking = async (req, res) => {
    try {
        const user_id = req.user.id; // Extracted from verified JWT middleware
        const { event_id, venue_id, seat_count } = req.body;

        if (!event_id || !venue_id || !seat_count || seat_count <= 0) {
            return res.status(400).json({ error: 'Please provide event_id, venue_id, and valid seat_count' });
        }

        const booking = await BookingsModel.createBooking(user_id, event_id, venue_id, seat_count);

        res.status(201).json({
            message: 'Booking successful using First-Fit allocation & transaction lock!',
            booking
        });
    } catch (err) {
        console.error('Booking error (Critical Section Conflict):', err.message);
        res.status(400).json({ error: err.message || 'Server error during booking process' });
    }
};

// Verify ticket QR code (Admin only)
exports.verifyTicket = async (req, res) => {
    try {
        const { booking_ref_code } = req.body;

        if (!booking_ref_code) {

            return res.status(400).json({ error: 'Provide booking_ref_code to verify' });
        }

        const updatedBooking = await BookingsModel.verifyTicket(booking_ref_code);

        if (!updatedBooking) {
            return res.status(400).json({ error: 'Invalid booking code or ticket already verified.' });
        }

        res.json({
            message: 'Ticket verified successfully!',
            ticket: updatedBooking
        });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).json({ error: 'Server error during ticket verification' });
    }
};
