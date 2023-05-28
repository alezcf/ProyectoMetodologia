const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asistenciaSchema = new Schema(
  {
    idUser: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
  },
  { collection: 'asistencia' }
);

asistenciaSchema.methods.formatDate = function() {
  const day = this.fecha.getDate();
  const month = this.fecha.getMonth() + 1;
  const year = this.fecha.getFullYear();
  return `${day}/${month}/${year}`;
};

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);

module.exports = Asistencia;
