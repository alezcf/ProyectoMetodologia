const express = require('express');
const router = express.Router();

const groupController = require('../controllers/GroupController');

router.get('/create', groupController.setGroup);
router.get('/verGrupos', groupController.getAllGroups);
router.get('/Delete', groupController.deleteGroupByNumber);


module.exports = router;