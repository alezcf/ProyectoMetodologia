const Trabajador = require('../models/Trabajador');

exports.getAllEmployees = async (req, res) => {
    try {
        const arrayTrabajadorDB = await Trabajador.find();
        const formattedArrayTrabajador = arrayTrabajadorDB.map(trabajador => {
            return { ...trabajador.toObject(), fecha: trabajador.formatDate() };
        });

        res.render("trabajadores", {
            arrayTrabajador: formattedArrayTrabajador
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los trabajadores');
    }
};

exports.getEmployeesByRut = async (req, res) => {
    console.log("llegamos a trabajadorcontroller");
    try {
      const { rut } = req.params; // Obtén el Rut desde los parámetros de la solicitud
  
      const trabajador = await Trabajador.findOne({ rut }); // Busca el trabajador por su Rut
  
      if (!trabajador) {
        return res.status(404).send('Trabajador no encontrado'); // Si no se encuentra el trabajador, devuelve un error 404
      }
  
      console.log("Usuario encontrado");
      if (isSesion(req)) {
        res.render("principal", {
          nombres: trabajador.nombres,
          apellidoPaterno: trabajador.apellidoPaterno,
          apellidoMaterno: trabajador.apellidoMaterno,
          cargo: trabajador.cargo,
          rol: trabajador.rol
        });
      }else{
        res.render("login", { mensajeError: 'No has iniciado sesión. Por favor, inicia sesión.' });
      }
  
    } catch (error) {
      console.log(error);
      res.status(500).send('Error al obtener el trabajador');
    }
  };
  
  function isSesion(req) {
    return req.session.user !== undefined;
  }
