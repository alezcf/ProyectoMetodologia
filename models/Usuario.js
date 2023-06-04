const mongoose = require("mongoose");
const { Schema } = mongoose;

const usuarioSchema = new Schema(
    {
        rut: { type: String },
        contrasena: { type: String },
    },
    { collection: 'usuario' }
);

const Usuario = mongoose.model("usuario", usuarioSchema);

module.exports = Usuario;