require('dotenv').config();
const { pool } = require('./src/config/db');

async function fixSchema() {
  try {
    await pool.query('ALTER TABLE content ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(255);');
    await pool.query('ALTER TABLE content ADD COLUMN IF NOT EXISTS category_id INTEGER;');
    console.log('Successfully added thumbnail and category_id columns to content table');
  } catch (err) {
    console.error('Error fixing schema:', err);
  } finally {
    pool.end();
  }
}

fixSchema();
