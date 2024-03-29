const express = require('express');
const router = express.Router();

const groupController = require('../controllers/GroupController');

router.post('/create', groupController.setGroup);
router.get('/verGrupos', groupController.getAllGroups);
router.post('/Delete', groupController.deleteGroupByNumber);
router.post('/update', groupController.updateGroup);


module.exports = router;