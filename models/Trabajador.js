const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trabajadorSchema = new Schema(
    {
        rut: { type: String },
        nombres: { type: String },
        apellidoPaterno: { type: String },
        apellidoMaterno: { type: String },
        nacimiento: { type: Date },
        cargo: { type: String },
        rol: { type: String },
        numero: { type: Number, required: true },
        correoElectronico: { type: String },
    },
    { collection: 'trabajador' }
);

trabajadorSchema.methods.formatDate = function() {
    const day = this.nacimiento.getDate();
    const month = this.nacimiento.getMonth() + 1;
    const year = this.nacimiento.getFullYear();
    return `${day}/${month}/${year}`;
};

const Trabajador = mongoose.model('Trabajador', trabajadorSchema);
module.exports = Trabajador;
