// server.js
const express = require('express');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const pregnancyRoutes = require('./routes/pregnancyRoutes');

dotenv.config();

// Create Sequelize instance and connect to MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Disable SQL logging (optional)
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to MySQL has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const app = express();
app.use(bodyParser.json());

app.use('/api', pregnancyRoutes); // Prefix all routes with '/api'

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Pregnancy Service is running on port ${PORT}`);
});
