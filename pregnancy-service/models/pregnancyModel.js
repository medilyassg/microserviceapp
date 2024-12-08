// models/pregnancyModel.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js'); // Import sequelize instance from server.js

const Pregnancy = sequelize.define('Pregnancy', {
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    
  },
  monthOfPregnancy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hospitalName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  doctorName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt
  tableName: 'pregnancies', // Ensure table name is 'pregnancies'
});

// Sync the model with the database
Pregnancy.sync();

module.exports = Pregnancy;
