const { pool } = require('../config/db');

const History = {
  async addHistory(userId, contentId) {
    // Remove existing history for this content to prevent duplicates (acts as upsert)
    await pool.query('DELETE FROM history WHERE user_id = $1 AND content_id = $2', [userId, contentId]);

    const query = `
      INSERT INTO history (user_id, content_id, viewed_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async removeHistory(userId, contentId) {
    const query = `
      DELETE FROM history
      WHERE user_id = $1 AND content_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async findByUser(userId) {
    const query = `
      SELECT h.id as history_id, h.viewed_at, c.*
      FROM history h
      JOIN content c ON h.content_id = c.id
      WHERE h.user_id = $1
      ORDER BY h.viewed_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    
    // Filter duplicates in case they exist from before
    const uniqueHistories = [];
    const seenContentIds = new Set();
    for (const row of result.rows) {
      if (!seenContentIds.has(row.id)) {
        seenContentIds.add(row.id);
        uniqueHistories.push(row);
      }
    }
    
    return uniqueHistories;
  },

  async findByUserAndContent(userId, contentId) {
    const query = `
      SELECT * FROM history
      WHERE user_id = $1 AND content_id = $2
      ORDER BY viewed_at DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async clearUserHistory(userId) {
    const query = `
      DELETE FROM history
      WHERE user_id = $1;
    `;
    await pool.query(query, [userId]);
  },
};

module.exports = History;
