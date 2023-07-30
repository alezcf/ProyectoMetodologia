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

exports.expirationRol = async (req, res) => {

    const { rut } = req.body;
    const { position } = req.body;
    const employee = await Employee.findOne({ rut });
  
    if (!employee) {
      return res.status(404).json({ error: true, message: 'Trabajador no encontrado' });
    }
  
    // Obtener el mes actual
    const mesActual = new Date().getMonth();
  
    if (mesActual === 3) { // Abril es el mes 3 en JavaScript
      employee.position = null; // Establecer el atributo en nulo cuando sea marzo
    } else {
      employee.position = position; // No hacer nada
    }
  
    try {
      const updatedEmployee = await employee.save();
      res.json(updatedEmployee); // Devolver el empleado actualizado si es necesario
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: true, message: 'Error al actualizar el empleado' });
    }
}
