const express = require('express');
const router = express.Router();
const trabajadorController = require('../controllers/TrabajadorController');

router.get('/verTrabajadores', trabajadorController.getAllTrabajadores);
router.get('/:rut', trabajadorController.getTrabajadorByRut);

module.exports = router;