require('dotenv').config();
const { pool } = require('./src/config/db');

const query = `
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  content_id INTEGER REFERENCES content(id) ON DELETE CASCADE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  poster VARCHAR(255),
  schedule_type VARCHAR(50) DEFAULT 'one_time',
  day_of_week INTEGER,
  start_time TIME,
  end_time TIME,
  start_datetime TIMESTAMP,
  end_datetime TIMESTAMP,
  recurrence_rule VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(query).then(() => {
  console.log('Table created successfully');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
