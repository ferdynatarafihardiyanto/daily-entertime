require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'adminpassword';
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Insert user
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );
    
    const userId = result.rows[0].id;
    
    // Assign admin role
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'admin'`,
      [userId]
    );

    // Also assign user role just in case
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = 'user'
       ON CONFLICT DO NOTHING`,
      [userId]
    );
    
    console.log(`Admin account created successfully. Username: ${username}, Email: ${email}, Password: ${password}`);
  } catch (error) {
    if (error.code === '23505') {
       console.log('Admin account already exists. Trying to ensure they have the admin role.');
       try {
           const existingUser = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
           if (existingUser.rows.length > 0) {
               const userId = existingUser.rows[0].id;
               await pool.query(
                 `INSERT INTO user_roles (user_id, role_id)
                  SELECT $1, id FROM roles WHERE name = 'admin'
                  ON CONFLICT DO NOTHING`,
                 [userId]
               );
               console.log('Assigned admin role to existing account.');
           }
       } catch (err) {
           console.error('Failed to update existing admin account', err);
       }
    } else {
       console.error('Error creating admin account:', error);
    }
  } finally {
    pool.end();
  }
}

createAdmin();
