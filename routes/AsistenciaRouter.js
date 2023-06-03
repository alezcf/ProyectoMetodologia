const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/AsistenciaController');

router.post('/create', asistenciaController.createAsistencia);
router.get('/read', asistenciaController.getAllAsistencias);

module.exports = router;
