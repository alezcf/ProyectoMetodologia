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
  const day = this.date.getDate();
  const month = this.date.getMonth() + 1;
  const year = this.date.getFullYear();
  return `${day}/${month}/${year}`;
};

const Attendance = mongoose.model('Asistencia', attendanceSchema);

module.exports = Attendance;
