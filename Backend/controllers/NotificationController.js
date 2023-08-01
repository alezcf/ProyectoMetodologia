const Group = require('../models/Group');
const Employee = require('../models/Employee');

exports.getNotificationGroup = async function (req, res) {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

exports.getNotificationEmployee = async function (req, res) {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};



