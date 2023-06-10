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
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();

        const arrayAsistenciaDB = await Asistencia.find({ fecha: { $gte: startOfDay, $lte: endOfDay } });
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
            return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
        });

        res.render("asistencias", {
            arrayAsistencia: formattedArrayAsistencia
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener la asistencia diaria');
    }
};

exports.getWeeklyAttendance = async (req, res) => {
    try {
        const startOfWeek = moment().startOf('week').isoWeekday(1).startOf('day').toDate();
        const endOfWeek = moment().endOf('week').isoWeekday(7).endOf('day').toDate();

        const arrayAsistenciaDB = await Asistencia.find({ fecha: { $gte: startOfWeek, $lte: endOfWeek } });
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
            return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
        });

        res.render("asistencias", {
            arrayAsistencia: formattedArrayAsistencia
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener la asistencia semanal');
    }
};

exports.getMonthlyAttendance = async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').startOf('day').toDate();
        const endOfMonth = moment().endOf('month').endOf('day').toDate();

        const arrayAsistenciaDB = await Asistencia.find({ fecha: { $gte: startOfMonth, $lte: endOfMonth } });
        const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
            return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
        });

        res.render("asistencias", {
            arrayAsistencia: formattedArrayAsistencia
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener la asistencia mensual');
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

module.exports.getRandomAttendance = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const currentDateAttendance = await getAttendanceForCurrentDate();
        const randomPeople = getRandomPeople(currentDateAttendance, 5);
        console.log(randomPeople);
        resolve(randomPeople);
      } catch (error) {
        reject(error);
      }
    });
  };
  ;
  
  
  async function getAttendanceForCurrentDate() {
    const currentDate = moment().startOf('day');
    const nextDate = moment(currentDate).endOf('day');
    const arrayAsistenciaDB = await Asistencia.find({ fecha: { $gte: currentDate, $lt: nextDate } });
    const formattedArrayAsistencia = arrayAsistenciaDB.map(asistencia => {
      return { ...asistencia.toObject(), fecha: asistencia.formatDate() };
    });
    return formattedArrayAsistencia;
  }
  
  function getRandomPeople(array, count) {
    // Verificar que el array tenga más elementos que la cantidad requerida
    if (array.length <= count) {
      return array;
    }
  
    // Utilizar el algoritmo de Fisher-Yates para mezclar aleatoriamente el subconjunto del array
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
  
    // Devolver los primeros 'count' elementos del subconjunto mezclado aleatoriamente
    return shuffledArray.slice(0, count);
  }
  
  function isSesion(req) {
    return req.session.user !== undefined;
  }
  

