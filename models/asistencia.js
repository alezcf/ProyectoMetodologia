const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;


const asistenciaSchema = new Schema({
  nombre: String,
  motivo: String
})
   // Crear el modelo

const Asistencia = mongoose.model('Asistencia', asistenciaSchema);
module.exports = Asistencia;
