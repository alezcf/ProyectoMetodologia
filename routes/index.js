const express = require('express');
const router = express.Router();

const getAsistenciasRouter = require('./getAsistenciasRouter');
const createAsistenciaRouter = require('./createAsistenciaRouter');

// Rutas relacionadas con la asistencia
router.use('/obtenerAsistencias', getAsistenciasRouter);

router.use('/registrarAsistencia', createAsistenciaRouter);

module.exports = router;