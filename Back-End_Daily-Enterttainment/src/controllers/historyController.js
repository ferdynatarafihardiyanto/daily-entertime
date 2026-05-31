const HistoryModel = require('../models/historyModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const trackHistory = async (req, res) => {
  try {
    const { content_id } = req.body;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    if (!content_id) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(
        createErrorResponse('Content ID is required')
      );
    }

    const history = await HistoryModel.addHistory(user_id, content_id);
    return res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(history, 'History tracked successfully')
    );
  } catch (error) {
    console.error('Track history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error tracking history')
    );
  }
};

const getUserHistory = async (req, res) => {
  try {
    const user_id = req.user ? (req.user.id || req.user.userId) : null;
    const histories = await HistoryModel.findByUser(user_id);

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(histories, 'History retrieved successfully')
    );
  } catch (error) {
    console.error('Get history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error retrieving history')
    );
  }
};

const removeHistory = async (req, res) => {
  try {
    const { contentId } = req.params;
    const user_id = req.user ? (req.user.id || req.user.userId) : null;

    const removed = await HistoryModel.removeHistory(user_id, contentId);

    if (!removed) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(
        createErrorResponse('History not found')
      );
    }

    return res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'History removed successfully')
    );
  } catch (error) {
    console.error('Remove history error:', error);
    return res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Error removing history')
    );
  }
};

module.exports = {
  trackHistory,
  getUserHistory,
  removeHistory
};
