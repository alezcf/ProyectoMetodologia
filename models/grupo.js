const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const GrupoSchema = new Schema(
  {
    idUser: { type: [String], required: true },
    grupo: { type: String, required: true },
    fecha: { type: Date, default: Date.now }
  },
  { collection: 'grupo' }
);
GrupoSchema.statics.getRandomAttendance = async function() {
    const getRandomAttendance = require('../controllers/AttendanceController').getRandomAttendance;
    return getRandomAttendance();
  };
  
GrupoSchema.methods.formatDate = function() {
  const day = this.fecha.getDate();
  const month = this.fecha.getMonth() + 1;
  const year = this.fecha.getFullYear();
  return `${day}/${month}/${year}`;
};

const Grupo = mongoose.model('grupo', GrupoSchema);

module.exports = Grupo;
