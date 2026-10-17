const VenuesModel = require('./venues.model');

// Get all venues
exports.getVenues = async (req, res) => {
    try {
        const venues = await VenuesModel.getAllVenues();
        res.json({ venues });
    } catch (err) {
        console.error('Error fetching venues:', err);
        res.status(500).json({ error: 'Server error while fetching venues' });
    }
};

// Get single venue by ID
exports.getVenueById = async (req, res) => {
    try {
        const { id } = req.params;
        const venue = await VenuesModel.getVenueById(id);

        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }

        res.json({ venue });
    } catch (err) {
        console.error('Error fetching venue:', err);
        res.status(500).json({ error: 'Server error while fetching venue' });
    }
};

// Create a new venue (Admin only)
exports.createVenue = async (req, res) => {
    try {
        const { name, location, total_seats } = req.body;

        if (!name || !location || !total_seats) {
            return res.status(400).json({ error: 'Please provide all required fields (name, location, total_seats)' });
        }

        const newVenue = await VenuesModel.createVenue(name, location, total_seats);

        res.status(201).json({
            message: 'Venue created successfully',
            venue: newVenue
        });
    } catch (err) {
        console.error('Error creating venue:', err);
        res.status(500).json({ error: 'Server error while creating venue' });
    }
};