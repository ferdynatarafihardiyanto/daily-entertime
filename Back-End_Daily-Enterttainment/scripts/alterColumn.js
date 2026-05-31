require('dotenv').config();
const { pool } = require('./src/config/db');

async function alterColumn() {
  try {
    await pool.query('ALTER TABLE content ALTER COLUMN url TYPE TEXT;');
    console.log('Successfully altered url column to TEXT');
  } catch (err) {
    console.error('Error altering column:', err);
  } finally {
    pool.end();
  }
}

alterColumn();
