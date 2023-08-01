const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/NotificationController');

router.get('/verGrupo', notificationController.getNotificationGroup);
router.get('/verUsuario', notificationController.getNotificationEmployee);


module.exports = router;