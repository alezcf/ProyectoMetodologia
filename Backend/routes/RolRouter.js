const express = require('express');
const router = express.Router();
const RolController = require('../controllers/RolController');

router
.put('/cambiarposicion', RolController.updatePosition);

router
.route('/:rut')
.get(RolController.getUser);

module.exports = router;
