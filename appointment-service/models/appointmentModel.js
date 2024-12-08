const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  appointmentDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending',
  },
  doctorName: {
    type: DataTypes.STRING, // Store the doctor's name directly
    allowNull: false,
  },
  patientName: {
    type: DataTypes.STRING, // Store the patient's name directly
    allowNull: false,
  },
  doctorNotes: {
    type: DataTypes.TEXT, // Notes from the doctor
    allowNull: true,
  },
  documents: {
    type: DataTypes.JSON, // To store file paths or URLs of documents uploaded
    allowNull: true,
  },
});

module.exports = Appointment;
