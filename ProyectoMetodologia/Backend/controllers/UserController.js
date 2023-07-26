const User = require('../models/User');

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
        console.log(req.body);
        const { rut, dv, password } = req.body;
        const rutDV = rut + dv
        
            console.log("recibo rut" + rutDV + " y luego tengo la pass = " + password);

            // Realizar la lógica de comprobación de los datos del usuario en la base de datos
            const UserFound = await User.findOne({ rut: rutDV });
        
            if (!UserFound || UserFound.password !== password) {
                return res.status(401).json({ message: 'Datos incorrectos' })
            } else {
                // Si las credenciales son válidas, envía una respuesta con estado 200 y un mensaje
                req.session.user = UserFound;
                return res.status(200).json({ message: 'Inicio de sesión exitoso' });
                
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Error al iniciar sesión' });
        }
        
};


