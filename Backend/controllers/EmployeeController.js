const Employee = require('../models/Employee');

exports.getAllEmployees = async (req, res) => {
    try {
        const arrayEmployeeDB = await Employee.find();
        const formattedArrayEmployee = arrayEmployeeDB.map(employee => {
            return { ...employee.toObject(), birthDate: employee.formatDate() };
        });

        res.render("employees", {
            arrayEmployee: formattedArrayEmployee
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los trabajadores');
    }
};

exports.getEmployeesByRut = async (req, res) => {
  try {
    const { rut } = req.params; // Obtén el Rut desde los parámetros de la solicitud

    const employee = await Employee.findOne({ rut }); // Busca el trabajador por su Rut

    if (!employee) {
      return res.status(404).json({ error: true, message: 'Trabajador no encontrado' }); // Si no se encuentra el trabajador, devuelve un error 404
    }

    return res.status(200).json({
      names: employee.names,
      lastName: employee.lastName,
      secondLastName: employee.secondLastName,
      jobTitle: employee.jobTitle,
      position: employee.position
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: 'Error al obtener el trabajador' });
  }
};

exports.getAllEmployeesUI = async (req, res) => {
  try {
      const arrayEmployeeDB = await Employee.find();
      const formattedArrayEmployee = arrayEmployeeDB.map(employee => {
          return { ...employee.toObject(), birthDate: employee.formatDate() };
      });

      res.status(200).json({
        arrayEmployee: formattedArrayEmployee
      });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los trabajadores' });
  }
};


