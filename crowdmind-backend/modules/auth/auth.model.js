const db = require('../../config/db');

class AuthModel {
    // Find user by email
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = \$1';
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    // Create a new user
    static async createUser(name, email, passwordHash, role = 'user') {
        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at
        `;
        const result = await db.query(query, [name, email, passwordHash, role]);
        return result.rows[0];
    }
}

module.exports = AuthModel;