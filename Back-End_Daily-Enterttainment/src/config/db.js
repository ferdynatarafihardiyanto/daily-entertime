const { Pool } = require('pg');

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, // Required for Neon DB and many cloud providers
        },
      }
    : {
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'daily_entertainment',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 5432,
      }
);

// Menangani error pada idle client agar server tidak crash
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client (Koneksi database terputus sementara)', err.message);
});

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully');
    client.release(); // Penting: lepaskan client agar tidak menggantung
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
}

module.exports = { pool, connectDB };
