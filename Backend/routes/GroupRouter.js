const express = require('express');
const router = express.Router();

const groupController = require('../controllers/GroupController');

router.get('/create', groupController.setGroup);

module.exports = router;