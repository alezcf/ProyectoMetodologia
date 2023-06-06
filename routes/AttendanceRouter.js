const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

router.post('/create', attendanceController.createAttendance);
router.get('/read', attendanceController.getAllAttendance);
router.get('/readDaily', attendanceController.getDailyAttendance);
<<<<<<< HEAD
router.get('/readWeekly', attendanceController.getWeeklyAttendance);
router.get('/readMonthly', attendanceController.getMonthlyAttendance);
=======
>>>>>>> 966bba8fedbfd341c82b3e754bfb94f3ecb9828d

module.exports = router;

