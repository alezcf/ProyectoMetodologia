const express = require('express');
const router = express.Router();

const AsistenciaRouter = require('./AsistenciaRouter');

//#region Rutas relacionadas al controlador de Asistencia
router.use('/obtenerAsistencias', AsistenciaRouter);

router.use('/registrarAsistencia', AsistenciaRouter);
//#endregion

module.exports = router;