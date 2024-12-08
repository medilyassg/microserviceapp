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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} >
        <Route path="" index element={<ManageDoctors />} />
        <Route path="admins" element={<ManageAdmins />} />
        <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>
        <Route path="/doctor" element={<DoctorDashboard />} >
        <Route path="" index element={<Profile />} />
        <Route path="patients" element={<ManagePatients />} />
          <Route path="appointments" element={<DoctorAppointmentCalendar />} />
        </Route>
        {/* <Route path="/doctor-dashboard" element={<DoctorDashboard />} /> Doctor Dashboard Route */}
        {/* <Route path="/patient-dashboard" element={<PatientDashboard />} /> Patient Dashboard Route */}

      </Routes>
    </Router>
  );
}

export default App;
