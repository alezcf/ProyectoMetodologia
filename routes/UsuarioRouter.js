const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

router.get('/verUsuarios', usuarioController.getAllUsuarios);

module.exports = router;
