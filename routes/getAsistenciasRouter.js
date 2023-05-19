const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/AsistenciaController');
// Ruta GET '/asistencias'
router.get('/', asistenciaController.getAllAsistencias);

module.exports = router;
