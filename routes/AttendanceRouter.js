const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

router.post('/create', attendanceController.createAttendance);
router.get('/read', attendanceController.getAllAttendance);
router.get('/readDaily', attendanceController.getDailyAttendance);

module.exports = router;
