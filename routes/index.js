const express = require('express');
const router = express.Router();

const AsistenciaRouter = require('./AsistenciaRouter');
const TrabajadorRouter = require('./TrabajadorRouter');
router.use('/asistencia', AsistenciaRouter);
router.use('/trabajador', TrabajadorRouter);

module.exports = router;