const Asistencia = require('../models/Asistencia');
//#region obtenerAsistencia
exports.getAllAsistencias = async (req, res) => {
    try {
        const arrayAsistenciaDB = await Asistencia.find();
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
        return { ... asistencia.toObject(), fecha: asistencia.formatDate() };
        });
    
        res.render("asistencias", {
        arrayAsistencia: formattedArrayAsistencia
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener las asistencias');
    }
};
//#endregion

//#region crearAsistencia
exports.createAsistencia = async (req, res) => {
  const idUser = req.query.idUser; // Obtener el valor de la ID de los parámetros de ruta
    try {
    // Crear una nueva instancia del modelo Asistencia con la ID proporcionada
    const asistencia = new Asistencia({
        idUser: idUser,
        fecha: Date.now() // También puedes establecer la fecha actual aquí o usar otro valor deseado
    });

    // Guardar la nueva asistencia en la base de datos
    await asistencia.save();

    res.status(201).send('Asistencia creada exitosamente');
    } catch (error) {
    console.log(error);
    res.status(500).send('Error al crear la asistencia');
    }
};
//#endregion