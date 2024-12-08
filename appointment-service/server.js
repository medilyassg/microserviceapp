// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const appointmentRoutes = require('./routes/appointmentRoutes');
const authMiddleware = require('./middlewares/auth');

// Initialize dotenv to use environment variables
dotenv.config();

// Create an instance of the express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// CORS middleware for cross-origin requests
app.use(cors());

// API routes
app.use('/api', appointmentRoutes);

// Connect to the database
sequelize
  .sync()  
  .then(() => console.log('Database connected successfully!'))
  .catch((err) => console.log('Database connection error: ' + err));

// Set up the server to listen on a port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Appointment Service running on port ${PORT}`);
});
