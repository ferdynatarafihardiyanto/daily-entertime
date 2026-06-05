const { pool } = require('../config/db');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

async function getAllUsers(req, res) {
  try {
    const query = `
      SELECT u.id, u.username as name, u.email, u.created_at as joined, 
             'GRATIS' as type,
             array_to_string(array_agg(r.name), ', ') as role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `;
    const result = await pool.query(query);
    
    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(result.rows, 'Berhasil mengambil data pengguna')
    );
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Terjadi kesalahan pada server')
    );
  }
}

const bcrypt = require('bcrypt');

async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password || !role) {
      return res.status(400).json(createErrorResponse('Data tidak lengkap'));
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );

    const userId = result.rows[0].id;

    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT $1, id FROM roles WHERE name = $2`,
      [userId, role]
    );

    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(result.rows[0], 'Berhasil menambahkan pengguna')
    );
  } catch (error) {
    console.error('Create user error:', error);
    if (error.code === '23505') {
      return res.status(400).json(createErrorResponse('Email atau username sudah terdaftar'));
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Terjadi kesalahan pada server')
    );
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;

    // Verify permission: Must be admin or the user themselves
    const isAdmin = req.user.roles && req.user.roles.includes('admin');
    if (!isAdmin && req.user.id != id) {
      return res.status(403).json(createErrorResponse('Akses ditolak'));
    }

    if (!username || !email) {
      return res.status(400).json(createErrorResponse('Username dan Email tidak boleh kosong'));
    }

    // Update username, email, and conditionally avatar
    let updateQuery = `UPDATE users SET username = $1, email = $2`;
    let updateValues = [username, email];
    let paramCount = 3;

    if (req.body.avatar !== undefined) {
      updateQuery += `, avatar = $${paramCount}`;
      updateValues.push(req.body.avatar);
      paramCount++;
    }

    updateQuery += ` WHERE id = $${paramCount}`;
    updateValues.push(id);

    await pool.query(updateQuery, updateValues);

    // Update role if provided and user is admin
    if (role && isAdmin) {
      // First delete existing roles
      await pool.query(`DELETE FROM user_roles WHERE user_id = $1`, [id]);
      
      // Assign new role
      await pool.query(
        `INSERT INTO user_roles (user_id, role_id)
         SELECT $1, id FROM roles WHERE name = $2`,
        [id, role]
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Berhasil memperbarui data pengguna')
    );
  } catch (error) {
    console.error('Update user error:', error);
    if (error.code === '23505') {
      return res.status(400).json(createErrorResponse('Email atau username sudah digunakan'));
    }
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Terjadi kesalahan pada server')
    );
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    if (req.user.id == id) {
      return res.status(400).json(createErrorResponse('Tidak dapat menghapus akun sendiri saat sedang login'));
    }

    const checkResult = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      return res.status(404).json(createErrorResponse('Pengguna tidak ditemukan'));
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id]);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Berhasil menghapus pengguna')
    );
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Terjadi kesalahan pada server')
    );
  }
}

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
