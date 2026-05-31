const { pool } = require('../config/db');

const Content = {
  async create(data) {
    const {
      title,
      description,
      category_id,
      user_id,
      thumbnail,
      url,
      content_type = 'film'
    } = data;

    const query = `
      INSERT INTO content 
      (title, description, category_id, thumbnail, url, content_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const result = await pool.query(query, [
      title,
      description,
      category_id,
      thumbnail,
      url,
      content_type
    ]);
    return result.rows[0];
  },

  async findById(id) {
    const query = `SELECT * FROM content WHERE id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async findAll() {
    const query = `SELECT * FROM content ORDER BY created_at DESC;`;
    const result = await pool.query(query);
    return result.rows;
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.title) {
      fields.push(`title = $${paramCount++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(data.description);
    }
    if (data.thumbnail) {
      fields.push(`thumbnail = $${paramCount++}`);
      values.push(data.thumbnail);
    }
    if (data.url) {
      fields.push(`url = $${paramCount++}`);
      values.push(data.url);
    }
    if (data.category_id) {
      fields.push(`category_id = $${paramCount++}`);
      values.push(data.category_id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE content
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *;
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async delete(id) {
    const query = `DELETE FROM content WHERE id = $1;`;
    await pool.query(query, [id]);
  },

  async incrementViews(id) {
    const query = `UPDATE content SET views = COALESCE(views, 0) + 1 WHERE id = $1 RETURNING views;`;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};

module.exports = Content;
