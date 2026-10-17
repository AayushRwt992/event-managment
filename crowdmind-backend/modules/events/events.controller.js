const EventsModel = require('./events.model');

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await EventsModel.getAllEvents();
        res.json({ events });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Server error while fetching events' });
    }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await EventsModel.getEventById(id);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json({ event });
    } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).json({ error: 'Server error while fetching event' });
    }
};

// Create a new event (Admin only)
exports.createEvent = async (req, res) => {
    try {
        const { title, description, category, date, venue_id, image_url } = req.body;

        if (!title || !date) {
            return res.status(400).json({ error: 'Please provide required fields (title, date)' });
        }

        const newEvent = await EventsModel.createEvent(
            title,
            description || null,
            category || null,
            date,
            venue_id || null,
            image_url || null
        );

        res.status(201).json({
            message: 'Event created successfully',
            event: newEvent
        });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Server error while creating event' });
    }
};