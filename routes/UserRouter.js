const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UserController');

router.get('/verUsuarios', usersController.getAllUsers);
router.post('/logIn', usersController.logIn);

module.exports = router;
