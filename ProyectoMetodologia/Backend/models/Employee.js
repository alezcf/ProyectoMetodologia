const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
    {
        rut: { type: String },
        names: { type: String },
        lastName: { type: String },
        secondLastName: { type: String },
        birthDate: { type: Date },
        jobTitle: { type: String },
        position: { type: String },
        phoneNumber: { type: Number, required: true },
        email: { type: String },
    },
    { collection: 'trabajador' }
);

employeeSchema.methods.formatDate = function() {
    const day = this.nacimiento.getDate();
    const month = this.nacimiento.getMonth() + 1;
    const year = this.nacimiento.getFullYear();
    return `${day}/${month}/${year}`;
};

const Employee = mongoose.model('Trabajador', employeeSchema);
module.exports = Employee;
