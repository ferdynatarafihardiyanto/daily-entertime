require('dotenv').config();
const { pool } = require('./src/config/db');

async function alterThumbnail() {
  try {
    await pool.query('ALTER TABLE content ALTER COLUMN thumbnail TYPE TEXT;');
    console.log('Successfully altered thumbnail column to TEXT');
  } catch (err) {
    console.error('Error altering column:', err);
  } finally {
    pool.end();
  }
}

alterThumbnail();
