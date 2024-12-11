const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const pregnancyServiceUrl = process.env.PREGNANCY_SERVICE_URL;

// Route to create a new pregnancy record
router.post('/', async (req, res) => {
  try {
    const response = await axios.post(`${pregnancyServiceUrl}/pregnancies`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error creating pregnancy record' });
  }
});



// Route to update pregnancy details by patient ID
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${pregnancyServiceUrl}/pregnancies/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pregnancy details',error:error });
  }
});

// Route to delete pregnancy record by patient ID
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${pregnancyServiceUrl}/pregnancies/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pregnancy record' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const response = await axios.get(`${pregnancyServiceUrl}/all`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetchiing pregnancy record',error });
  }
});

module.exports = router;
