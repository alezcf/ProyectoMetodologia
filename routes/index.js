const express = require('express');
const router = express.Router();

const AsistenciaRouter = require('./AsistenciaRouter');
const TrabajadorRouter = require('./TrabajadorRouter');
const UsuarioRouter = require('./UsuarioRouter');

router.use('/asistencia', AsistenciaRouter);
router.use('/trabajador', TrabajadorRouter);
router.use('/usuario', UsuarioRouter);




module.exports = router;