const db = require('../../config/db');

class EventsModel {
    // Get all upcoming events
    static async getAllEvents() {
        const query = 'SELECT * FROM events ORDER BY date ASC';
        const result = await db.query(query);
        return result.rows;
    }

    // Get event by ID
    static async getEventById(id) {
        const query = 'SELECT * FROM events WHERE id = \$1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Create new event
    static async createEvent(title, description, category, date, venue_id, image_url) {
        const query = `
            INSERT INTO events (title, description, category, date, venue_id, image_url)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
        const values = [title, description, category, date, venue_id, image_url];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = EventsModel;