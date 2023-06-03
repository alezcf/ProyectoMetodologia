const Usuario = require('../models/Usuario');

exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.render('usuarios', { usuarios });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};
