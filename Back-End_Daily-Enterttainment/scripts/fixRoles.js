require('dotenv').config();
const { pool } = require('./src/config/db');

async function fixRoles() {
  try {
    await pool.query(`
      DELETE FROM user_roles 
      WHERE role_id = (SELECT id FROM roles WHERE name = 'user') 
      AND user_id = (SELECT id FROM users WHERE email = 'admin@example.com')
    `);
    console.log('Fixed admin role.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    pool.end();
  }
}

fixRoles();
