const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/UsuarioController');

router.get('/verUsuarios', usuarioController.getAllUsuarios);
router.post('/iniciarSesion', usuarioController.iniciarSesion);
module.exports = router;
