const { pool } = require('../config/db');

const Bookmark = {
  async addBookmark(userId, contentId) {
    const query = `
      INSERT INTO bookmarks (user_id, content_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, content_id) DO NOTHING
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async removeBookmark(userId, contentId) {
    const query = `
      DELETE FROM bookmarks
      WHERE user_id = $1 AND content_id = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0];
  },

  async findByUser(userId) {
    const query = `
      SELECT b.id as bookmark_id, b.created_at, c.*
      FROM bookmarks b
      JOIN content c ON b.content_id = c.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  },

  async isBookmarked(userId, contentId) {
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM bookmarks
        WHERE user_id = $1 AND content_id = $2
      );
    `;
    const result = await pool.query(query, [userId, contentId]);
    return result.rows[0].exists;
  },
};

module.exports = Bookmark;
