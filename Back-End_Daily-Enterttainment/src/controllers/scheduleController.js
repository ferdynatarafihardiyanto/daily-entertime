const Schedule = require('../models/scheduleModel');
const { HTTP_STATUS, createSuccessResponse, createErrorResponse } = require('../utils/constants');

const createSchedule = async (req, res) => {
  try {
    const { contentId, title, description, scheduleType, startDatetime, endDatetime, status, dayOfWeek } = req.body;
    const userId = req.user.id;

    const newSchedule = await Schedule.create({
      contentId,
      createdBy: userId,
      title,
      description,
      scheduleType,
      startDatetime,
      endDatetime,
      status,
      dayOfWeek,
    });

    res.status(HTTP_STATUS.CREATED).json(
      createSuccessResponse(newSchedule, 'Jadwal berhasil ditambahkan')
    );
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Gagal menambahkan jadwal: ' + error.message, 'INTERNAL_SERVER_ERROR')
    );
  }
};

const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findActive();
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(schedules, 'Berhasil mengambil daftar jadwal')
    );
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Gagal mengambil daftar jadwal', 'INTERNAL_SERVER_ERROR')
    );
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    await Schedule.delete(id);
    res.status(HTTP_STATUS.OK).json(
      createSuccessResponse(null, 'Jadwal berhasil dihapus')
    );
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(HTTP_STATUS.SERVER_ERROR).json(
      createErrorResponse('Gagal menghapus jadwal', 'INTERNAL_SERVER_ERROR')
    );
  }
};

module.exports = {
  createSchedule,
  getSchedules,
  deleteSchedule,
};
