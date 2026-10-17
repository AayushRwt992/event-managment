const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Or individual config properties (host, user, password, database, port) if not using DATABASE_URL
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    connect: () => pool.connect(), // <--- This enables transaction locking!
    pool
};