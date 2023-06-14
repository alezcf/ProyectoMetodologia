const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        rut: { type: String },
        password: { type: String },
    },
    { collection: 'usuario' }
);

const User = mongoose.model("usuario", userSchema);

module.exports = User;