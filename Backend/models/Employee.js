const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema(
    {
        rut: { type: String, required: true },
        names: { type: String },
        lastName: { type: String },
        secondLastName: { type: String },
        birthDate: { type: Date },
        jobTitle: { type: String},
        position: { type: String },
        phoneNumber: { type: Number},
        email: { type: String },
    },
    { collection: 'trabajador' }
);

employeeSchema.methods.formatDate = function() {
    const day = this.birthDate.getDate();
    const month = this.birthDate.getMonth() + 1;
    const year = this.birthDate.getFullYear();
    return `${day}/${month}/${year}`;
};


const Employee = mongoose.model('Trabajador', employeeSchema);
module.exports = Employee;
