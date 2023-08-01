const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UserController');

router.get('/verUsuarios', usersController.getAllUsers);
router.post('/logIn', usersController.logIn);
router.post('/crearUsuario', usersController.createUser);
router.post('/actualizarUsuario', usersController.updateUser);
router.post('/eliminarUsuario', usersController.deleteUser);

module.exports = router;
