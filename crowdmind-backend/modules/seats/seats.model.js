const db = require('../../config/db');

class SeatsModel {
    // Get all seats for a specific venue
    static async getSeatsByVenue(venue_id) {
        const query = 'SELECT * FROM seats WHERE venue_id = \$1 ORDER BY id ASC';
        const result = await db.query(query, [venue_id]);
        return result.rows;
    }

    // Auto-generate seats for a venue
    static async generateSeatsForVenue(venue_id, total_seats) {
        const seats = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; // 10 rows
        const seatsPerRow = Math.ceil(total_seats / rows.length);

        let createdCount = 0;

        for (let r = 0; r < rows.length; r++) {
            for (let s = 1; s <= seatsPerRow; s++) {
                if (createdCount >= total_seats) break;

                const seatNumber = `${rows[r]}-${s}`;
                seats.push(`(${venue_id}, '${seatNumber}', 'available')`);
                createdCount++;
            }
            if (createdCount >= total_seats) break;
        }

        const query = `
            INSERT INTO seats (venue_id, seat_number, status)
            VALUES ${seats.join(', ')}
            RETURNING *;
        `;

        const result = await db.query(query);
        return result.rows;
    }
}

module.exports = SeatsModel;