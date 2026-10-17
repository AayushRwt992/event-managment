const db = require('../../config/db');

class VenuesModel {
    // Get all venues
    static async getAllVenues() {
        const query = 'SELECT * FROM venues ORDER BY created_at DESC';
        const result = await db.query(query);
        return result.rows;
    }

    // Get venue by ID
    static async getVenueById(id) {
        const query = 'SELECT * FROM venues WHERE id = \$1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Create a new venue
    static async createVenue(name, location, total_seats) {
        const query = `
            INSERT INTO venues (name, location, total_seats)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [name, location, total_seats];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = VenuesModel;