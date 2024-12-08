require('dotenv').config();
const express = require('express');
const axios = require('axios');
const authMiddleware = require('./middlewares/auth');
const app = express();
const cors = require('cors');

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors());

// API Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/pregnancy', require('./routes/pregnancyRoutes'));
app.use('/appointments', require('./routes/appointmentRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
