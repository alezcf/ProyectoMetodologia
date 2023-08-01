const Group = require('../models/Group');
const Employee = require('../models/Employee');

exports.getGroups = async function (req, res) {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};