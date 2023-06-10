const express = require('express');
const router = express.Router();

const AttendanceRouter = require('./AttendanceRouter');
const EmployeeRouter = require('./EmployeeRouter');
const UserRouter = require('./UserRouter');
const GroupRouter = require('./GroupRouter');

router.use('/asistencia', AttendanceRouter);
router.use('/trabajador', EmployeeRouter);
router.use('/usuario', UserRouter);
router.use('/grupo', GroupRouter);

module.exports = router;