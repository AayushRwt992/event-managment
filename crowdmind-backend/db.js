const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         
  host: 'localhost',
  database: 'crowdmind_db', 
  password: 'yourpassword', 
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database successfully!');
});

module.exports = pool;
