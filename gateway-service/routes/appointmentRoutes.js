const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const appointmentServiceUrl = process.env.APPOINTMENT_SERVICE_URL;

// Route to create an appointment (POST)
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${appointmentServiceUrl}/appointments`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating appointment' ,error:error});
  }
});

// Route to get appointment details (GET)
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${appointmentServiceUrl}/appointments/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointment details' });
  }
});

// Route to update appointment details (PUT)
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${appointmentServiceUrl}/appointments/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating appointment details' });
  }
});

// Route to delete an appointment (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${appointmentServiceUrl}/appointments/${req.params.id}`);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting appointment' });
  }
});

module.exports = router;
