import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageDoctors from "./pages/Admin/ManageDoctors";
import ManageAdmins from "./pages/Admin/ManageAdmins";
import ManagePatients from "./pages/Admin/ManagePatients";
import Appointments from "./pages/Admin/Appointments";
import Profile from "./pages/Doctor/Profile";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointmentCalendar from "./pages/Doctor/Appointments";
import PatientProfile from "./pages/Patient/Profile";
import PatientAppointmentCalendar from "./pages/Patient/AppointmentList";
import History from "./pages/Patient/History";
import PatientDashboard from "./pages/Patient/Dashboard";
import NotesAndDocumentsForm from "./pages/Doctor/NotesAndDocumentsForm";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Departments from "./components/Departments";
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/login" element={<Login />} />
        <Route path="/files" element={<NotesAndDocumentsForm appointmentId={30} />} />

        {/* Admin routes, only accessible by users with 'admin' role */}
        <Route path="/admin" element={
          <PrivateRoute requiredRole="admin">
            <AdminDashboard />
          </PrivateRoute>
        }>
          <Route path="" index element={<ManageDoctors />} />
          <Route path="admins" element={<ManageAdmins />} />
          <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Doctor routes, only accessible by users with 'doctor' role */}
        <Route path="/doctor" element={
          <PrivateRoute requiredRole="doctor">
            <DoctorDashboard />
          </PrivateRoute>
        }>
          <Route path="" index element={<Profile />} />
          <Route path="appointments" element={<DoctorAppointmentCalendar />} />
        </Route>

        {/* Patient routes, only accessible by users with 'patient' role */}
        <Route path="/patient" element={
          <PrivateRoute requiredRole="patient">
            <PatientDashboard />
          </PrivateRoute>
        }>
          <Route path="" index element={<PatientProfile />} />
          <Route path="appointments" element={<PatientAppointmentCalendar />} />
          <Route path="history" element={<History />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
