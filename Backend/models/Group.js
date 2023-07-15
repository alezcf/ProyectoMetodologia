const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema(
  {
    idUser: { type: [String], required: true },
    group: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { collection: 'grupo' }
);

GroupSchema.statics.getRandomAttendance = async function() {
    const getRandomAttendance = require('../controllers/AttendanceController').getRandomAttendance;
    return getRandomAttendance();
};

GroupSchema.methods.formatDate = function() {
  const day = this.fecha.getDate();
  const month = this.fecha.getMonth() + 1;
  const year = this.fecha.getFullYear();
  return `${day}/${month}/${year}`;
};

const Group = mongoose.model('grupo', GroupSchema);

module.exports = Group;
