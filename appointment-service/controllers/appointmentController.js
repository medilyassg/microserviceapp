const multer = require('multer');
const path = require('path');
const Appointment = require('../models/appointmentModel');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware for handling file uploads
exports.uploadDocuments = upload.array('documents', 10); // Allow up to 10 files

// Update doctorNotes and documents for an appointment
exports.updateNotesAndDocuments = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const { doctorNotes, documentDescriptions } = req.body;

    // Validate and update doctorNotes
    if (doctorNotes !== undefined) {
      appointment.doctorNotes = doctorNotes;
    }

    // Handle uploaded files and associate them with descriptions
    if (req.files && req.files.length > 0) {
      if (!documentDescriptions || !Array.isArray(documentDescriptions)) {
        return res.status(400).json({ message: 'Document descriptions are required and must be an array.' });
      }

      // Ensure descriptions match the number of uploaded files
      if (documentDescriptions.length !== req.files.length) {
        return res.status(400).json({ message: 'Mismatch between files and descriptions.' });
      }

      const uploadedDocuments = req.files.map((file, index) => ({
        description: documentDescriptions[index],
        url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`, // Generate file URL
      }));

      // Add to existing documents or replace them
      appointment.documents = [...(appointment.documents || []), ...uploadedDocuments];
    }

    await appointment.save();

    res.status(200).json({ message: 'Notes and documents updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating notes and documents', error: err });
  }
};


// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, patientName, doctorName, appointmentDate ,status} = req.body;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      patientName,  
      doctorName,
      appointmentDate,
      status,
    });
    
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Error creating appointment' });
  }
};

// Get all appointments
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

// Update appointment details (doctor can update all fields)
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update all fields of the appointment
    const { patientName, doctorName, appointmentDate, status, doctorNotes, documents } = req.body;

    appointment.patientName = patientName || appointment.patientName;
    appointment.doctorName = doctorName || appointment.doctorName;
    appointment.appointmentDate = appointmentDate || appointment.appointmentDate;
    appointment.status = status || appointment.status;
    appointment.doctorNotes = doctorNotes || appointment.doctorNotes;
    appointment.documents = documents || appointment.documents;

    await appointment.save();

    res.status(200).json({ message: 'Appointment updated successfully', appointment });
  } catch (err) {
    res.status(500).json({ message: 'Error updating appointment', error: err });
  }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await Appointment.destroy({
      where: { id: req.params.id },
    });
    
    res.status(204).json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting appointment' });
  }
};
