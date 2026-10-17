const SeatsModel = require('./seats.model');

// Get all seats for a venue
exports.getSeatsByVenue = async (req, res) => {
    try {
        const { venue_id } = req.params;
        const seats = await SeatsModel.getSeatsByVenue(venue_id);

        res.json({ venue_id: Number(venue_id), total_seats: seats.length, seats });
    } catch (err) {
        console.error('Error fetching seats:', err);
        res.status(500).json({ error: 'Server error while fetching seats' });
    }
};

// Generate seats for a venue (Admin only)
exports.generateSeats = async (req, res) => {
    try {
        const { venue_id, total_seats } = req.body;

        if (!venue_id || !total_seats) {
            return res.status(400).json({ error: 'Please provide venue_id and total_seats' });
        }

        // Check if seats already exist for this venue
        const existingSeats = await SeatsModel.getSeatsByVenue(venue_id);
        if (existingSeats.length > 0) {
            return res.status(400).json({ error: 'Seats already generated for this venue' });
        }

        const newSeats = await SeatsModel.generateSeatsForVenue(venue_id, total_seats);

        res.status(201).json({
            message: `Successfully generated ${newSeats.length} seats for venue ${venue_id}`,
            seats: newSeats
        });
    } catch (err) {
        console.error('Error generating seats:', err);
        res.status(500).json({ error: 'Server error while generating seats' });
    }
};
