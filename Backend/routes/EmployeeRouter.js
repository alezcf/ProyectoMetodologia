const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');

router.get('/verTrabajadores', employeeController.getAllEmployees);
router.get('/Read', employeeController.getAllEmployeesUI); 
router.get('/:rut', employeeController.getEmployeesByRut);

module.exports = router;
