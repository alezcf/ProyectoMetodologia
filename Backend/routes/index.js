const express = require('express');
const router = express.Router();

const AttendanceRouter = require('./AttendanceRouter');
const EmployeeRouter = require('./EmployeeRouter');
const UserRouter = require('./UserRouter');
const GroupRouter = require('./GroupRouter');
const RolRouter = require('./RolRouter');
const NotificationRouter = require('./NotificationRouter');


router.use('/asistencia', AttendanceRouter);
router.use('/trabajador', EmployeeRouter);
router.use('/usuario', UserRouter);
router.use('/grupo', GroupRouter);
router.use('/rol', RolRouter);
router.use('/notification', NotificationRouter);


module.exports = router;