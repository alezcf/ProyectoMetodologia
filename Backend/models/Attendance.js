const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema(
  {
    idUser: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isAccepted: { type: Boolean, required: true },
  },
  { collection: 'asistencia' }
);

attendanceSchema.methods.formatDate = function() {
  const day = String(this.date.getDate()).padStart(2, '0');
  const month = String(this.date.getMonth() + 1).padStart(2, '0');
  const year = this.date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Attendance = mongoose.model('Asistencia', attendanceSchema);

module.exports = Attendance;
