require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcrypt');

async function seedUsers() {
  try {
    const usersToInsert = [
      { username: 'M. Nata', email: 'm.nata321@gmail.com', password: 'password123', created_at: '2025-07-16' },
      { username: 'Naila Pinky', email: 'naky326@gmail.com', password: 'password123', created_at: '2025-01-05' },
      { username: 'Diky Baskara', email: 'dikara777@gmail.com', password: 'password123', created_at: '2025-02-02' }
    ];

    for (const u of usersToInsert) {
      const passwordHash = await bcrypt.hash(u.password, 12);
      try {
        const result = await pool.query(
          `INSERT INTO users (username, email, password_hash, created_at)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO NOTHING
           RETURNING id`,
          [u.username, u.email, passwordHash, u.created_at]
        );

        if (result.rows.length > 0) {
          const userId = result.rows[0].id;
          await pool.query(
            `INSERT INTO user_roles (user_id, role_id)
             SELECT $1, id FROM roles WHERE name = 'user'`,
            [userId]
          );
        }
      } catch (err) {
        console.error(`Error inserting ${u.username}:`, err.message);
      }
    }
    
    console.log('Seed users created successfully.');
  } catch (error) {
    console.error('Error in seed script:', error);
  } finally {
    pool.end();
  }
}

seedUsers();
