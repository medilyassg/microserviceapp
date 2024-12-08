const express = require('express');
const axios = require('axios');
const router = express.Router();

const userServiceUrl = process.env.USER_SERVICE_URL;

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    const response = await axios.post(`${userServiceUrl}/users/register`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Route to login a user
router.post('/login', async (req, res) => {
  try {
    const response = await axios.post(`${userServiceUrl}/users/login`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Route to fetch all users
router.get('/all', async (req, res) => {
  try {
    const response = await axios.get(`${userServiceUrl}/users/all`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route to update user information
router.put('/:id', async (req, res) => {
  try {
    const response = await axios.put(`${userServiceUrl}/users/${req.params.id}`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Route to delete a user
router.delete('/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${userServiceUrl}/users/${req.params.id}`);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;
