const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const asistenciaSchema = new Schema(
  {
    nombre: String,
    motivo: String,
  },
  { collection: 'asistencia' }
);

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);

module.exports = Asistencia;
