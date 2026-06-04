const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/role');
const { createContent, getAllContents, getContentById, updateContent, deleteContent } = require('../controllers/contentController');
const { addBookmark, removeBookmark, getUserBookmarks } = require('../controllers/bookmarkController');
const { trackHistory, getUserHistory, removeHistory } = require('../controllers/historyController');
const { createSchedule, getSchedules, deleteSchedule } = require('../controllers/scheduleController');
const { getAllUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const {
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  createSuccessResponse,
} = require('../utils/constants');

router.use('/profile', require('./profileRoutes'));

// REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// REFRESH TOKEN
router.post('/refresh', refresh);

// LOGOUT
router.post('/logout', logout);

// ADMIN route
router.get(
  '/admin',
  authenticateToken,
  authorizeRoles('admin'),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_ADMIN)
    );
  }
);

// GET ALL USERS (Admin only)
router.get(
  '/users',
  authenticateToken,
  authorizeRoles('admin'),
  getAllUsers
);

// CREATE USER (Admin only)
router.post(
  '/users',
  authenticateToken,
  authorizeRoles('admin'),
  createUser
);

// UPDATE USER (Admin or the user themselves)
router.put(
  '/users/:id',
  authenticateToken,
  updateUser
);

// DELETE USER (Admin only)
router.delete(
  '/users/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteUser
);

// USER route
router.get(
  '/user',
  authenticateToken,
  authorizeRoles('user', 'admin'),
  (req, res) => {
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, SUCCESS_MESSAGES.WELCOME_USER)
    );
  }
);

// CONTENT routes
router.post('/contents', authenticateToken, createContent);
router.get('/contents', getAllContents);
router.get('/contents/:id', getContentById);
router.put('/contents/:id', authenticateToken, updateContent);
router.delete('/contents/:id', authenticateToken, deleteContent);

// BOOKMARK routes
router.post('/bookmarks', authenticateToken, addBookmark);
router.delete('/bookmarks/:contentId', authenticateToken, removeBookmark);
router.get('/bookmarks', authenticateToken, getUserBookmarks);

// HISTORY routes
router.post('/histories', authenticateToken, trackHistory);
router.get('/histories', authenticateToken, getUserHistory);
router.delete('/histories/:contentId', authenticateToken, removeHistory);

// SCHEDULE routes
router.post('/schedules', authenticateToken, createSchedule);
router.get('/schedules', getSchedules);
router.delete('/schedules/:id', authenticateToken, deleteSchedule);

module.exports = router;
