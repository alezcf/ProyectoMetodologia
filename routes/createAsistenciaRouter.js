const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/AsistenciaController');

router.post('/', asistenciaController.createAsistencia);

module.exports = router;