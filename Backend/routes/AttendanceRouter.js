const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

router.post('/create', attendanceController.createAttendance);
router.get('/read', attendanceController.getAllAttendance);
router.get('/read/random', attendanceController.getRandomAttendance);
router.get('/readDaily', attendanceController.getDailyAttendance);
router.get('/readWeekly', attendanceController.getWeeklyAttendance);
router.get('/readMonthly', attendanceController.getMonthlyAttendance);
router.get('/downloadAllAttendance', attendanceController.downloadAllAttendance);
router.get('/downloadMonthlyAttendance', attendanceController.downloadMonthlyAttendance );
router.get('/downloadDailyAttendance', attendanceController.downloadDailyAttendance);
router.get('/downloadWeeklyAttendance', attendanceController.downloadWeeklyAttendance);

module.exports = router;

