// routes/pregnancyRoutes.js
const express = require('express');
const pregnancyController = require('../controllers/pregnancyController');
const router = express.Router();

// Create a new pregnancy record
router.post('/pregnancies', pregnancyController.createPregnancy);

// Get pregnancy details by patient ID
router.get('/pregnancies/:patientId', pregnancyController.getPregnancyDetails);

// Update pregnancy details by patient ID
router.put('/pregnancies/:id', pregnancyController.updatePregnancy);

// Delete pregnancy record by patient ID
router.delete('/pregnancies/:id', pregnancyController.deletePregnancy);

router.get('/all', pregnancyController.getAllPregnancies);

module.exports = router;
