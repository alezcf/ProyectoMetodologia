const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    idUser: { type: [String], required: true },
    names: { type: [String], required: true },
    positions: { type: [String], required: true },
    group: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { collection: 'grupo' }
);
// GroupSchema.statics.getRandomAttendance = async function() {
//   const getRandomAttendance = require('../controllers/AttendanceController').getRandomAttendance;
//   return getRandomAttendance();
// };

GroupSchema.statics.getAttendanceAndProcess = async function() {
  // Importar el controlador AttendanceController dentro del método
  const AttendanceController = require('../controllers/AttendanceController');

  // Obtener la asistencia diaria del controlador
  const dailyAttendance = await AttendanceController.getAttendanceForCurrentDate();

  // Imprimir la asistencia
  console.log('Asistencia' + dailyAttendance);

  // Devolver la asistencia
  return dailyAttendance;
};

GroupSchema.methods.formatDate = function() {
  const day = this.fecha.getDate();
  const month = this.fecha.getMonth() + 1;
  const year = this.fecha.getFullYear();
  return `${day}/${month}/${year}`;
};

const Group = mongoose.model('grupo', GroupSchema);

module.exports = Group;
