const User = require('../models/User');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.render('users', { users });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
};


exports.createUser = async (req, res) => {
    try {
        const { rut, password } = req.body;

        // Crear un nuevo documento User con los datos proporcionados
        const newUser = new User({
            rut,
            password
        });

        // Guardar el documento en la base de datos
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        // Obtener el ID del usuario a actualizar desde los parámetros de la URL
        const userId = req.params.id;

        // Obtener los datos actualizados del usuario desde el cuerpo de la solicitud
        const { rut, password } = req.body;

        // Buscar el usuario por su ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualizar los campos del usuario con los datos proporcionados
        user.rut = rut;
        user.password = password;

        // Guardar los cambios en la base de datos
        await user.save();

        res.status(200).json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        // Obtener el ID del usuario a eliminar desde los parámetros de la URL
        const userId = req.params.id;

        // Buscar el usuario por su ID y eliminarlo
        const deletedUser = await User.findByIdAndRemove(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente', user: deletedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
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
