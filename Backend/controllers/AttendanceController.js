const Attendence = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.getAllAttendance = async function (req, res) {
    try {
        const arrayAsistencia = await getFormattedArrayAttendance();
    
        return res.status(200).json({ status: 200, arrayAttendance: arrayAsistencia });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.getAllAttendanceForRUT = async function (req, res) {

    try {
        const arrayAsistencia = await getFormattedArrayAttendance();
        // Get the RUT of the current user from the request object
        const userRUT = modifyAttendanceIdUser(req.query.rut.toString()); // Assuming the RUT is stored in "req.user.rut"

        const userAttendance = arrayAsistencia.filter(attendance => attendance.idUser === userRUT);

        return res.status(200).json({ status: 200, arrayAttendance: userAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.getDailyAttendanceForRUT = async function (req, res) {

    try {

        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();
        // Get the RUT of the current user from the request object
        const userRUT = modifyAttendanceIdUser(req.query.rut.toString()); // Assuming the RUT is stored in "req.user.rut"


        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfDay, $lte: endOfDay } });
        const userAttendance = formattedArrayAttendance.filter(attendance => attendance.idUser === userRUT);

        return res.status(200).json({ status: 200, arrayAttendance: userAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.getWeeklyAttendanceForRUT = async function (req, res) {

    try {

        const startOfWeek = moment().startOf('isoWeek').toDate();
        const endOfWeek = moment().endOf('isoWeek').toDate();
    
        // Get the RUT of the current user from the request object
        const userRUT = modifyAttendanceIdUser(req.query.rut.toString()); // Assuming the RUT is stored in "req.user.rut"


        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfWeek, $lte: endOfWeek } });
        const userAttendance = formattedArrayAttendance.filter(attendance => attendance.idUser === userRUT);
        
        return res.status(200).json({ status: 200, arrayAttendance: userAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.getMonthlyAttendanceForRUT = async function (req, res) {

    try {

        const startOfMonth = moment().startOf('month').startOf('day').toDate();
        const endOfMonth = moment().endOf('month').endOf('day').toDate();
        const userRUT = modifyAttendanceIdUser(req.query.rut.toString());
        const formattedArrayAttendance = await getFormattedArrayAttendanceForDate({ date: { $gte: startOfMonth, $lte: endOfMonth } });
        const userAttendance = formattedArrayAttendance.filter(attendance => attendance.idUser === userRUT);
        
        return res.status(200).json({ status: 200, arrayAttendance: userAttendance });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};


exports.acceptAttendance = async function (req, res) {
    try {
        console.log("rut recibido: " + req.body.rut);
        console.log("fecha recibida:" + req.body.fecha);

        const arrayAsistencia = await Attendence.find();
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
            await Attendence.findOneAndUpdate({ _id: matchingAttendance._id }, { isAccepted: true });

            // Devolver un estado de 200 con un mensaje indicando que la asistencia fue encontrada y actualizada
            console.log("La asistencia fue encontrada y actualizada");
            return res.status(200).json({ status: 200, message: 'Asistencia encontrada y actualizada' });
        } else {
            // Si no encontramos una coincidencia, devolver un estado de 404
            return res.status(404).json({ status: 404, message: 'Asistencia no encontrada' });
        }
    } catch (error) {
        console.error(error); // Imprime el error en la consola para diagnosticar problemas
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.deleteAttendance = async function (req, res) {
    try {

        // Obtener _id del cuerpo de la solicitud
        const { _id } = req.body;

        // Verificar si existe una asistencia con el _id proporcionado
        const matchingAttendance = await Attendence.findById(_id);
    
        if (matchingAttendance) {
            // Si encontramos una coincidencia, eliminar la asistencia
            await matchingAttendance.deleteOne();
            return res.status(200).json({ status: 200, message: 'Asistencia encontrada y eliminada' });
        } else {
            // Si no encontramos una coincidencia, devolver un estado de 404
            return res.status(404).json({ status: 404, message: 'Asistencia no encontrada' });
        }
    } catch (error) {
        console.error(error); // Imprime el error en la consola para diagnosticar problemas
        return res.status(500).json({ status: 500, message: 'Error al obtener las asistencias' });
    }
};

exports.updateAttendance = async function (req, res) {
        try {
            // Obtener _id y nuevaFecha del cuerpo de la solicitud
            const { _id, nuevaFecha } = req.body;
            console.log("_id recibido: " + _id);
            console.log("nueva fecha recibida:" + nuevaFecha);

            // Verificar si existe una asistencia con el _id proporcionado
            const matchingAttendance = await Attendence.findById(_id);
    
            if (matchingAttendance) {
                console.log("La asistencia fue encontrada");
                // Validar que nuevaFecha sea una fecha válida
                const parsedDate = moment(nuevaFecha, 'DD/MM/YYYY', true); // Utilizamos true para validar que la fecha sea válida
                if (!parsedDate.isValid()) {
                    return res.status(400).json({ status: 400, message: 'La nuevaFecha no es una fecha válida en formato DD/MM/YYYY' });
                }
    
                // Formatear la nueva fecha en el formato deseado (dia/mes/año)
                const formattedDate = parsedDate.format('DD/MM/YYYY');
                console.log("formattedDate: " + formattedDate);
    
                // Actualizar la asistencia con la nueva fecha formateada
                await matchingAttendance.updateOne({ date: parsedDate.toDate() });
    
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
        res.setHeader('Content-Disposition', 'attachment; filename="Asistencia histórica.pdf"');
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
            doc.text('---------------------------');
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


exports.getRandomAttendance = async () => {
    try {
        const currentDateAttendance = await getAttendanceForCurrentDate();
        const randomPeople = getRandomPeople(currentDateAttendance, 5);
        const randomPositions = await getRandomPositionsEmployees([
            'Conductor', 'Rescatista', 'Paramedico', 'Combatiente', 'Tecnico en Prevencion'
        ]);
        console.log(randomPeople);
        console.log(randomPositions);
        return {
            randomPeople,
            randomPositions,
        };
    } catch (error) {
        throw error;
    }
};

exports.getAttendanceForCurrentDate = async function() {
    try {
    const currentDate = moment().startOf('day');
    const nextDate = moment(currentDate).endOf('day');
    const arrayAttendanceDB = await Attendence.find({ date: { $gte: currentDate, $lt: nextDate } });

    const formattedArrayAttendance = arrayAttendanceDB.map(attendance => {
        return { ...attendance.toObject(), date: attendance.formatDate() };
    });

        return formattedArrayAttendance;
    } catch (error) {
    console.error('Error al obtener la asistencia para la fecha actual:', error);
    throw error;
    }
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

async function getRandomPositionsEmployees(positions) {
    try {
        const randomEmployees = [];
        for (const position of positions) {
            const randomEmployee = await Employee.aggregate([
                { $match: { position: position } },
                { $sample: { size: 1 } }
            ]);
            randomEmployees.push(randomEmployee[0]);
        }
        return randomEmployees;
    } catch (error) {
        throw error;
    }
}

function modifyAttendanceArray(arrayAttendance) {
    arrayAttendance.forEach(attendance => {
        const idUser = attendance.idUser;
        const hyphenIndex = idUser.lastIndexOf('-');
        let modifiedIdUser = idUser.slice(0, hyphenIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + idUser.slice(hyphenIndex);

        modifiedIdUser = modifiedIdUser.slice(0, -1) + '-' + modifiedIdUser.slice(-1);
        attendance.idUser = modifiedIdUser;
    });
}

function modifyAttendanceIdUser(idUser) {
    const hyphenIndex = idUser.lastIndexOf('-');
    let modifiedIdUser = idUser.slice(0, hyphenIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + idUser.slice(hyphenIndex);
    
    modifiedIdUser = modifiedIdUser.slice(0, -1) + '-' + modifiedIdUser.slice(-1);
    return modifiedIdUser;
    
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