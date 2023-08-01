const Employee = require('../models/Employee');

exports.addUser = async (req, res) => {
  const user = new Employee(req.body);
  try{
    const employeeSaved = await user.save();
    console.log(employeeSaved);
    return res.status(200,'Se ha creado el usuario');
    
  }catch (err){
    console.error(err);
    return res.status(400)
  }

};   
exports.updatePosition = async (req, res) => {
  const { rut } = req.body;
  const employee = await Employee.findOne({ rut });
  
  if (!employee) {
    return res.status(404).json({ error: true, message: 'Trabajador no encontrado' });
  }
  
  employee.position = req.body.position || employee.position;
  
  try {
    const updatedEmployee = await employee.save();
    return res.status(200).json;
    res.json(updatedEmployee);
  } catch (e) { 
    console.error(e);
    res.status(500).json({ error: true, message: 'Error al actualizar la posición' });
  }
};

exports.getEmployeeArray = async (req, res) => {
  try {
      const EmployeeDB = await Employee.find();
      const savedArrayEmployee = EmployeeDB.map(employee => {
          return { ...employee.toObject(), birthDate: employee.formatDate() };
      });
      res.status(200).json({
        arrayEmployee: savedArrayEmployee
      });
  } catch (error) {
      console.log(error);
      res.status(404).json({ error: 'Error al obtener los trabajadores' });
  }
};

exports.getUser = async (req, res) => {
    const { rut } = req.params;
    const employee = await Employee.findOne({ rut });
    console.log(employee);
};

exports.expirationRol = async (req, res) => {
    const { rut } = req.body;
    const { jobTitle } = req.body;
    const employee = await Employee.findOne({ rut });
  
    if (!employee) {
      return res.status(404).json({ error: true, message: 'Trabajador no encontrado' });
    }
  
    // Obtener el mes actual
    const mesActual = new Date().getMonth();
  
    if (mesActual === 3 ) { // Abril es el mes 3 en JavaScript
      const result = await Employee.updateMany({ jobTitle: { $ne: "Jefe de Brigada" } }, { $set: { jobTitle: null } });// Establecer el atributo en nulo cuando sea marzo
    } else {
      employee.jobTitle = jobTitle; // No hacer nada
    }
  
    try {
      const updatedEmployee = await employee.save();
      res.json(updatedEmployee); // Devolver el empleado actualizado si es necesario
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: true, message: 'Error al actualizar el empleado' });
    }
}

exports.deleteUser = async (req, res) => {

  const { rut } = req.body;
  const employee = await Employee.findOne({ rut });

  if(!employee){
      return res.status(404).json({mensaje: "No existe el Usuario"
      });
  }

  try{
      await employee.deleteOne();
      return res.status(200).json({mensaje: "se ha eliminado"})
      }catch(error){
      console.log(error);
      return res.status(500).json({mensaje:"error"});
  }
  
}