const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/AttendanceController');

router.post('/create', attendanceController.createAttendance);
router.get('/read', attendanceController.getAllAttendance);
router.post('/updateAttendance', attendanceController.updateAttendance);
router.post('/deleteAttendance', attendanceController.deleteAttendance);
router.get('/read/random', attendanceController.getRandomAttendance);
router.get('/readDaily', attendanceController.getDailyAttendance);
router.get('/readWeekly', attendanceController.getWeeklyAttendance);
router.get('/readMonthly', attendanceController.getMonthlyAttendance);
router.get('/readNotAccepted', attendanceController.getAttendanceNotAccepted);
router.get('/downloadAllAttendance', attendanceController.downloadAllAttendance);
router.get('/downloadMonthlyAttendance', attendanceController.downloadMonthlyAttendance );
router.get('/downloadDailyAttendance', attendanceController.downloadDailyAttendance);
router.get('/downloadWeeklyAttendance', attendanceController.downloadWeeklyAttendance);
router.post('/acceptAttendance', attendanceController.acceptAttendance);
router.get('/readAttendanceForRUT', attendanceController.getAllAttendanceForRUT);
router.get('/readDailyAttendanceForRUT', attendanceController.getDailyAttendanceForRUT);
router.get('/readWeeklyAttendanceForRUT', attendanceController.getWeeklyAttendanceForRUT);
router.get('/readMonthlyAttendanceForRUT', attendanceController.getMonthlyAttendanceForRUT);


module.exports = router;

