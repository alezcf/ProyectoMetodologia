const Trabajador = require('../models/Trabajador');

exports.getAllTrabajadores = async (req, res) => {
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
