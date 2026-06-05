require('dotenv').config();
const { pool } = require('./src/config/db');

async function run() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;');
    console.log('Column avatar added successfully.');
  } catch (err) {
    console.error('Error adding column:', err);
  } finally {
    pool.end();
  }
}

run();
