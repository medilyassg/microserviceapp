// controllers/pregnancyController.js
const Pregnancy = require('../models/pregnancyModel');
const axios=require('axios')
// Create a new pregnancy record
exports.createPregnancy = async (req, res) => {
  try {
    const { name, email, password, monthOfPregnancy, city, hospitalName, doctorName } = req.body;

    const userResponse = await axios.post("http://localhost:3000/users/register", {
      name,
      email,
      password,
      role: "patient", 
    });

    const { user } = userResponse.data;

    const newPregnancy = await Pregnancy.create({
      patientId: user.id, // Use the new user's ID
      monthOfPregnancy,
      city,
      hospitalName,
      doctorName,
    });

    // Respond with the newly created pregnancy record
    res.status(201).json(newPregnancy);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getPregnancyDetails = async (req, res) => {
  try {
    const pregnancy = await Pregnancy.findOne({
      where: { patientId: req.params.patientId },
    });

    if (!pregnancy) {
      return res.status(404).json({ message: 'Pregnancy record not found' });
    }

    res.json(pregnancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update pregnancy details
exports.updatePregnancy = async (req, res) => {
  try {
    const { id } = req.params;
    const { monthOfPregnancy, city, hospitalName, doctorName } = req.body;

    const [affectedCount] = await Pregnancy.update(
      { monthOfPregnancy, city, hospitalName, doctorName },
      { where: { id } }
    );
    
    if (affectedCount === 0) {
      return res.status(404).json({ message: "Pregnancy record not found or no changes made." });
    }
    
    const updatedPregnancy = await Pregnancy.findOne({ where: { id } });
    res.json(updatedPregnancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete pregnancy record
exports.deletePregnancy = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPregnancy = await Pregnancy.destroy({ where: { id } });

    if (!deletedPregnancy) {
      return res.status(404).json({ message: 'Pregnancy record not found' });
    }

    res.json({ message: 'Pregnancy record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPregnancies = async (req, res) => {
  try {
    const pregnancies = await Pregnancy.findAll(); // Retrieve all pregnancy records

    

    res.json(pregnancies); // Return the list of pregnancies
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};