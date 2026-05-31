require('dotenv').config();
const { pool } = require('./src/config/db');

async function deleteSeededUsers() {
  try {
    await pool.query("DELETE FROM users WHERE email IN ('m.nata321@gmail.com', 'naky326@gmail.com', 'dikara777@gmail.com')");
    console.log('Deleted seeded users.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

deleteSeededUsers();
