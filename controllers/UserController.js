const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};

exports.logIn = async (req, res) => {
    try {
        const { rut, password } = req.body;
        console.log("Datos ingresados: rut = " + rut + ", contrasena = " + password);

        // Validar el formato del rut utilizando expresiones regulares
        const rutRegex = /^[0-9]{7,8}[0-9Kk]$/; // Expresión regular para validar un rut en formato "123456789"
        if (!rutRegex.test(rut)) {
        return res.render('login', { mensajeError: 'Formato de rut inválido. Por favor, ingresa un rut válido.' });
        }

        // Realizar la lógica de comprobación de los datos del usuario en la base de datos
        const UserFound = await User.findOne({ rut });

        if (!UserFound || UserFound.password !== password) {
            return res.render('login', { mensajeError: 'Credenciales inválidas. Por favor, intenta nuevamente.' });
        }

        // Si los datos son válidos, puedes redirigir o enviar una respuesta de éxito
        req.session.user = UserFound;
        res.redirect(`/trabajador/${rut}`); // Reemplaza '/ruta-de-destino' con la ruta real de destino

    } catch (error) {
        console.log(error);
        res.status(500).send('Error al iniciar sesión');
    }
};


