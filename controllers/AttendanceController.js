const Asistencia = require('../models/Asistencia');

exports.getAllAttendance = async (req, res) => {
    try {
        const arrayAsistenciaDB = await Asistencia.find();
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
            return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
        });

        if (isSesion(req)) {
            res.render("asistencias", {
                arrayAsistencia: formattedArrayAsistencia
            });
        } else {
            res.render("login", { mensajeError: 'No has iniciado sesión. Por favor, inicia sesión.' });
        };
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener las asistencias');
    }
};

const moment = require('moment');

exports.getDailyAttendance = async (req, res) => {
    try {
        const currentDate = moment().startOf('day');
        const arrayAsistenciaDB = await Asistencia.find({ fecha: currentDate });
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
            return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
        });

        if (isSesion(req)) {
            res.render("asistencias", {
                arrayAsistencia: formattedArrayAsistencia
            });
        } else {
            res.render("login", { mensajeError: 'No has iniciado sesión. Por favor, inicia sesión.' });
        };
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener las asistencias');
    }
};


//#region crearAsistencia
exports.createAttendance = async (req, res) => {
    const urlOriginal = req.get('Referer');
    const subcadena = 'http://localhost:3000/trabajador/';
    const idUser = getRut(urlOriginal, subcadena);

    try {
        // Verificar si ya existe una asistencia para el usuario en la fecha actual
        const existingAttendance = await Asistencia.findOne({
            idUser: idUser,
            fecha: {
                $gte: new Date().setHours(0, 0, 0, 0), // Fecha actual a las 00:00:00
                $lte: new Date().setHours(23, 59, 59, 999) // Fecha actual a las 23:59:59
            }
        });

        if (existingAttendance) {
            res.status(400).send('Ya has registrado la asistencia hoy');
            return;
        }
    
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

function getRut(urlOriginal, rutUser) {
    const indice = urlOriginal.indexOf(rutUser);
    if (indice !== -1) {
        return urlOriginal.substring(indice + rutUser.length);
    }
    return urlOriginal; // Devuelve el string sin cambios si no se encuentra la subcadena
}
//#endregio
function isSesion(req) {
    return req.session.user !== undefined;
  }