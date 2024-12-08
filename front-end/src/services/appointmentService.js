// services/appointmentService.js
import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/appointments", // Replace with your API URL
    headers: {
      "Content-Type": "application/json",
    },
  });
  
// Create a new appointment
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post(`/`, appointmentData);
    return response.data;
  } catch (error) {
    throw new Error('Error creating appointment: ' + error.message);
  }
};

// Get appointments for a specific user (patient or doctor)
export const getAppointments = async (userId, role) => {
  try {
    const response = await api.get(`/all`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching appointments: ' + error.message);
  }
};

// Update an appointment (e.g., change status, date, or time)
export const updateAppointment = async (id, updatedData) => {
  try {
    const response = await api.put(`/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error('Error updating appointment: ' + error.message);
  }
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`/${id}`);
    return response.status === 204; // 204 indicates successful deletion
  } catch (error) {
    throw new Error('Error deleting appointment: ' + error.message);
  }
};
