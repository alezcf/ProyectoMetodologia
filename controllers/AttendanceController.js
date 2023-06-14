const Attendence = require('../models/Attendance');

exports.getAllAttendance = async (req, res) => {
    try {
        const arrayAsistenciaDB = await Attendence.find();
        const formattedArrayAttendance = arrayAsistenciaDB.map(attendence => {
            return { ...attendence.toObject(), date: attendence.formatDate() };
        });

        if (isSesion(req)) {
            res.render("attendance", {
                arrayAttendance: formattedArrayAttendance
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

        const arrayAttendanceDB = await Attendence.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        const formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
            return { ...attendance.toObject(), date: attendance.formatDate() };
        });

        res.render("attendance", {
            arrayAttendance: formattedArrayAttendance
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

        const arrayAttendanceDB = await Attendence.find({ date: { $gte: startOfWeek, $lte: endOfWeek } });
        const formattedArrayAttendance = arrayAttendanceDB.map(asistencia => {
            return { ...asistencia.toObject(), date: asistencia.formatDate() };
        });

        res.render("attendance", {
            arrayAttendance: formattedArrayAttendance
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

        const arrayAttendanceDB = await Attendence.find({ date: { $gte: startOfMonth, $lte: endOfMonth } });
        const formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
            return { ...attendance.toObject(), date: attendance.formatDate() };
        });

        res.render("attendance", {
            arrayAttendance: formattedArrayAttendance
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
        const existingAttendance = await Attendence.findOne({
            idUser: idUser,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0), // Fecha actual a las 00:00:00
                $lte: new Date().setHours(23, 59, 59, 999) // Fecha actual a las 23:59:59
            }
        });

        if (existingAttendance) {
            res.status(400).send('Ya has registrado la asistencia hoy');
            return;
        }
    
        // Crear una nueva instancia del modelo Asistencia con la ID proporcionada
        const attendance = new Attendence({
            idUser: idUser,
            date: Date.now() // También puedes establecer la fecha actual aquí o usar otro valor deseado
        });

        // Guardar la nueva asistencia en la base de datos
        await attendance.save();

        res.status(201).send('Asistencia creada exitosamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear la asistencia');
    }
};

function getRut(urlOriginal, rutUser) {
    const index = urlOriginal.indexOf(rutUser);
    if (index !== -1) {
        return urlOriginal.substring(index + rutUser.length);
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
    const arrayAttendanceDB = await Attendence.find({ date: { $gte: currentDate, $lt: nextDate } });
    const formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
      return { ...attendance.toObject(), date: attendance.formatDate() };
    });
    return formattedArrayAttendance;
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
  

