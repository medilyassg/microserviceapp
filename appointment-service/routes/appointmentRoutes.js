// routes/appointmentRoutes.js
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

// Create a new appointment
router.post('/appointments', appointmentController.createAppointment);

// Get all appointments for a specific patient
router.get('/appointments/:patientId', appointmentController.getAppointments);

// Update an appointment
router.put('/appointments/:id', appointmentController.updateAppointment);

// Delete an appointment
router.delete('/appointments/:id', appointmentController.deleteAppointment);

module.exports = router;
