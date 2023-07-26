const Attendence = require('../models/Attendance');

exports.getAllAttendance = async function (req, res) {
    try {
        const arrayAsistencia = await getFormattedArrayAttendance();
        
        return res.status(200).json({ status: 200, arrayAttendance: arrayAsistencia });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

const Attendance = require('../models/Attendance'); // Asegúrate de que el nombre del modelo sea correcto

exports.acceptAttendance = async function (req, res) {
    try {
        console.log("rut recibido: " + req.body.rut);
        console.log("fecha recibida:" + req.body.fecha);

        const arrayAsistencia = await Attendance.find();
        const formattedArrayAttendance = arrayAsistencia.map(attendance => {
        return { ...attendance.toObject(), date: attendance.formatDate() };
        });
        modifyAttendanceArray(formattedArrayAttendance);

        const filteredArrayAttendance = formattedArrayAttendance.filter(attendance => attendance.isAccepted === false);

        // Obtener rut y fecha del cuerpo de la solicitud
        const { rut, fecha } = req.body;

        // Verificar si existe una asistencia con el rut y fecha proporcionados
        const matchingAttendance = filteredArrayAttendance.find((attendance) => attendance.idUser === rut && attendance.date === fecha);

        if (matchingAttendance) {
        // Si encontramos una coincidencia, actualizar isAccepted a true
        await Attendance.findOneAndUpdate({ _id: matchingAttendance._id }, { isAccepted: true });

        // Devolver un estado de 200 con un mensaje indicando que la asistencia fue encontrada y actualizada
        console.log("La asistencia fue encontrada y actualizada");
        return res.status(200).json({ status: 200, message: 'Asistencia encontrada y actualizada' });
        } else {
        // Si no encontramos una coincidencia, devolver un estado de 404
        return res.status(404).json({ status: 404, message: 'Asistencia no encontrada' });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.deleteAttendance = async function (req, res) {
    try {
        console.log("rut recibido: " + req.body.rut);
        console.log("fecha recibida:" + req.body.fecha);
    
        const arrayAsistencia = await Attendance.find();
        const formattedArrayAttendance = arrayAsistencia.map(attendance => {
            return { ...attendance.toObject(), date: attendance.formatDate() };
        });
        modifyAttendanceArray(formattedArrayAttendance);
        // Obtener rut y fecha del cuerpo de la solicitud
        const { rut, fecha } = req.body;
    
        // Verificar si existe una asistencia con el rut y fecha proporcionados
        const matchingAttendance = formattedArrayAttendance.find((attendance) => attendance.idUser === rut && attendance.date === fecha);
    
        if (matchingAttendance) {
            // Si encontramos una coincidencia, eliminar la asistencia
            await Attendance.findOneAndDelete({ _id: matchingAttendance._id });
    
            // Devolver un estado de 200 con un mensaje indicando que la asistencia fue encontrada y eliminada
            console.log("La asistencia fue encontrada y eliminada");
            return res.status(200).json({ status: 200, message: 'Asistencia encontrada y eliminada' });
        } else {
            // Si no encontramos una coincidencia, devolver un estado de 404
            return res.status(404).json({ status: 404, message: 'Asistencia no encontrada' });
        }
        } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
        }
    };


exports.getAttendanceNotAccepted = async function(req, res) {

    try {

        const arrayAsistenciaDB = await Attendence.find();
        const formattedArrayAttendance = arrayAsistenciaDB.map(attendence => {
            return { ...attendence.toObject(), date: attendence.formatDate() };
        });
        modifyAttendanceArray(formattedArrayAttendance);
        
        const filteredArrayAttendance = formattedArrayAttendance.filter(attendance => attendance.isAccepted === false);

        return res.status(200).json({ status: 200, arrayAttendance: filteredArrayAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

const moment = require('moment');

exports.getDailyAttendance = async function(req, res) {
    try {
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();

        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfDay, $lte: endOfDay } });

        return res.status(200).json({ status: 200, arrayAttendance: formattedArrayAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener la asistencia diaria' });
    }
};

exports.getWeeklyAttendance = async function(req, res) {
    try {
        const startOfWeek = moment().startOf('isoWeek').toDate();
        const endOfWeek = moment().endOf('isoWeek').toDate();

        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfWeek, $lte: endOfWeek } });

        return res.status(200).json({ status: 200, arrayAttendance: formattedArrayAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener la asistencia semanal' });
    }
};

exports.getMonthlyAttendance = async function(req, res) {
    try {
        const startOfMonth = moment().startOf('month').startOf('day').toDate();
        const endOfMonth = moment().endOf('month').endOf('day').toDate();

        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfMonth, $lte: endOfMonth } });

        return res.status(200).json({ status: 200, arrayAttendance: formattedArrayAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener la asistencia mensual' });
    }
};

//#region crearAsistencia
exports.createAttendance = async (req, res) => {
    const idUser = req.body.idUser;

    try {
        // Verificar si ya existe una asistencia para el usuario en la fecha actual
        const existingAttendance = await Attendence.findOne({
            idUser: idUser,
            date: {
                $gte: new Date().setHours(0, 0, 0, 0), // Fecha actual a las 00:00:00
                $lte: new Date().setHours(23, 59, 59, 999) // Fecha actual a las 23:59:59
            }
        });
        if (existingAttendance !== null) {
            return res.status(409).send('Ya has registrado la asistencia hoy');
        }
    
        // Crear una nueva instancia del modelo Asistencia con la ID proporcionada
        const attendance = new Attendence({
            idUser: idUser,
            date: Date.now(),
            isAccepted: false
        });
        // Guardar la nueva asistencia en la base de datos
        await attendance.save();
    
        return res.status(201).send('Asistencia creada exitosamente');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error al crear la asistencia');
    }
};

const PDFDocument = require('pdfkit');

exports.downloadAllAttendance = async function(req, res){
    try {

        const lista = await getFormattedArrayAttendance();

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Establecer el nombre del archivo y los encabezados para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="Asistencia.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Stream el contenido del PDF directamente al cliente
        doc.pipe(res);

        // Agregar el contenido de la lista al PDF
        lista.forEach((elemento) => {
            doc.text(`ID Usuario: ${elemento.idUser}`);
            doc.text(`Fecha: ${elemento.date}`);
            doc.text('---------------------------'); // Opcional: Agregar separador entre cada asistencia
        });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al generar el PDF');
    }
};

exports.downloadDailyAttendance = async function(req, res){
    try {
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();

        const lista = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfDay, $lte: endOfDay } });

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Establecer el nombre del archivo y los encabezados para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="AsistenciaDiaria.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Stream el contenido del PDF directamente al cliente
        doc.pipe(res);

        // Agregar el contenido de la lista al PDF
        lista.forEach((elemento) => {
            doc.text(`ID Usuario: ${elemento.idUser}`);
            doc.text(`Fecha: ${elemento.date}`);
            doc.text('---------------------------'); // Opcional: Agregar separador entre cada asistencia
        });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al generar el PDF');
    }
};

exports.downloadWeeklyAttendance = async function(req, res){
    try {
        const startOfWeek = moment().startOf('isoWeek').toDate();
        const endOfWeek = moment().endOf('isoWeek').toDate();

        const lista = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfWeek, $lte: endOfWeek } });

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Establecer el nombre del archivo y los encabezados para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="AsistenciaSemanal.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Stream el contenido del PDF directamente al cliente
        doc.pipe(res);

        // Agregar el contenido de la lista al PDF
        lista.forEach((elemento) => {
            doc.text(`ID Usuario: ${elemento.idUser}`);
            doc.text(`Fecha: ${elemento.date}`);
            doc.text('---------------------------'); // Opcional: Agregar separador entre cada asistencia
        });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al generar el PDF');
    }
};

exports.downloadMonthlyAttendance = async function(req, res){
    try {
        const startOfMonth = moment().startOf('month').startOf('day').toDate();
        const endOfMonth = moment().endOf('month').endOf('day').toDate();

        const lista = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfMonth, $lte: endOfMonth } });

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();

        // Establecer el nombre del archivo y los encabezados para la descarga
        res.setHeader('Content-Disposition', 'attachment; filename="AsistenciaMensual.pdf"');
        res.setHeader('Content-Type', 'application/pdf');

        // Stream el contenido del PDF directamente al cliente
        doc.pipe(res);

        // Agregar el contenido de la lista al PDF
        lista.forEach((elemento) => {
            doc.text(`ID Usuario: ${elemento.idUser}`);
            doc.text(`Fecha: ${elemento.date}`);
            doc.text('---------------------------'); // Opcional: Agregar separador entre cada asistencia
        });

        // Finalizar el documento PDF
        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al generar el PDF');
    }
};


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

async function getAttendanceForCurrentDate() {
    const currentDate = moment().startOf('day');
    const nextDate = moment(currentDate).endOf('day');
    const arrayAttendanceDB = await Attendence.find({ date: { $gte: currentDate, $lt: nextDate } });

    const formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
        return { ...attendance.toObject(), date: attendance.formatDate() };
    });

    return formattedArrayAttendance;
};

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
};

function modifyAttendanceArray(arrayAttendance) {
    arrayAttendance.forEach(attendance => {
        const idUser = attendance.idUser;
        const hyphenIndex = idUser.lastIndexOf('-');
        let modifiedIdUser = idUser.slice(0, hyphenIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + idUser.slice(hyphenIndex);

        modifiedIdUser = modifiedIdUser.slice(0, -1) + '-' + modifiedIdUser.slice(-1);
        attendance.idUser = modifiedIdUser;
    });
}

async function getFormattedArrayAttendance() {
    const arrayAsistenciaDB = await Attendence.find();
    const formattedArrayAttendance = arrayAsistenciaDB.map(attendence => {
        return { ...attendence.toObject(), date: attendence.formatDate() };
    });
    modifyAttendanceArray(formattedArrayAttendance);

    const filteredArrayAttendance = formattedArrayAttendance.filter(attendance => attendance.isAccepted === true);
    return filteredArrayAttendance;
}

async function getFormattedArrayAttendanceForDate(query) {
    let formattedArrayAttendance;
    
    if (query) {
        const { date } = query;
        const startOfDay = moment(date.$gte).startOf('day').toDate();
        const endOfDay = moment(date.$lte).endOf('day').toDate();
        const arrayAttendanceDB = await Attendence.find({ date: { $gte: startOfDay, $lte: endOfDay } });
        formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
            return { ...attendance.toObject(), date: attendance.formatDate() };
        });
    } else {
        const arrayAttendanceDB = await Attendence.find();
        formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
        return { ...attendance.toObject(), date: attendance.formatDate() };
        });
    }
    const filteredArrayAttendance = formattedArrayAttendance.filter(attendance => attendance.isAccepted === true);
    modifyAttendanceArray(formattedArrayAttendance); // Asegúrate de que esta función esté definida y haga lo que necesitas
    return filteredArrayAttendance;
}