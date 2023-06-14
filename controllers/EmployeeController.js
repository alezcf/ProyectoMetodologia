const Employee = require('../models/employee');

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
        return res.status(404).send('Trabajador no encontrado'); // Si no se encuentra el trabajador, devuelve un error 404
      }
  
      console.log("Usuario encontrado");
      if (isSesion(req)) {
        res.render("main", {
          names: employee.names,
          lastName: employee.lastName,
          secondLastName: employee.secondLastName,
          jobTitle: employee.jobTitle,
          position: employee.position
        });
      }else{
        res.render("login", { mensajeError: 'No has iniciado sesión. Por favor, inicia sesión.' });
      }
    } 
    catch (error) {
      console.log(error);
      res.status(500).send('Error al obtener el trabajador');
    }
  };
  
  function isSesion(req) {
    return req.session.user !== undefined;
  }
