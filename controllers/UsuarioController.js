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

exports.iniciarSesion = async (req, res) => {
    try {
        const { rut, contrasena } = req.body;
        console.log("Datos ingresados: rut = " + rut + ", contrasena = " + contrasena);

        // Realizar la lógica de comprobación de los datos del usuario en la base de datos
        const usuarioEncontrado = await Usuario.findOne({ rut });

        if (!usuarioEncontrado || usuarioEncontrado.contrasena !== contrasena) {
            return res.render('login', { mensajeError: 'Credenciales inválidas. Por favor, intenta nuevamente.' });
        }

        // Si los datos son válidos, puedes redirigir o enviar una respuesta de éxito
        res.redirect('/trabajador/verTrabajadores'); // Reemplaza '/ruta-de-destino' con la ruta real de destino

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al iniciar sesión');
    }
};


