const express = require('express');
const router = express.Router();
const RolController = require('../controllers/RolController');


router.route('/cambiarposicion').patch(RolController.updatePosition);

router.route('/trabajadores').get(RolController.getEmployeeArray);

router.route('/:rut').get(RolController.getUser);



module.exports = router;
