const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL;

// Route to send a notification
router.post('/', authMiddleware, async (req, res) => {
  try {
    const response = await axios.post(`${notificationServiceUrl}/notifications`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error sending notification' });
  }
});

module.exports = router;
