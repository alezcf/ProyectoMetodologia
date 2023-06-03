const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema(
    {
        rut: { type: String },
        contrasena: { type: String },
    },
    { collection: 'usuario' }
);

// Definir el método validPassword
// PersonaSchema.methods.validPassword = function(password) {
//     // Comparar la contraseña con la almacenada

//     return password === this.password;
// };
const Usuario = mongoose.model("usuario", usuarioSchema);

module.exports = Usuario;