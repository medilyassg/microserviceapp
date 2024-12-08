// controllers/appointmentController.js
const Appointment = require('../models/appointmentModel');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, patientName, doctorName, appointmentDate } = req.body;

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      patientName,  // Pass static patient name
      doctorName,   // Pass static doctor name
      appointmentDate,
      status: 'Pending',
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
