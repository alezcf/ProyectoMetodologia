const express = require('express');
const router = express.Router();

const AsistenciaRouter = require('./AsistenciaRouter');

//#region Rutas relacionadas al controlador de Asistencia
router.use('/asistencia', AsistenciaRouter);

router.use('/asistencia', AsistenciaRouter);
//#endregion

module.exports = router;