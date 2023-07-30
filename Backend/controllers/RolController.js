const Employee = require('../models/Employee');

exports.updatePosition = async (req, res) => {

    const { rut } = req.body;

    const employee = await Employee.findOne({ rut });

    if (!employee) {
        return res.status(404).json({ error: true, message: 'Trabajador no encontrado' }); // Si no se encuentra el trabajador, devuelve un error 404
      }
    
    employee.position = req.body.position;

    try {
        const updatedEmployee = await employee.save();
    } catch (e) { 
        console.error(e);
    }
};

exports.getUser = async (req, res) => {
    const { rut } = req.params;
    const employee = await Employee.findOne({ rut });
    console.log(employee);
};
