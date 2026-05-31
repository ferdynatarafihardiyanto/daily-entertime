require('dotenv').config();
const { pool } = require('./src/config/db');

async function checkSchema() {
  try {
    const result = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'content'");
    console.log(result.rows);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

checkSchema();
