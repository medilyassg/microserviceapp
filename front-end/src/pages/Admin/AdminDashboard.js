import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FaUserMd, FaUser, FaUserShield, FaHospitalAlt, FaCalendarAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("doctors");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Dashboard</h2>
        <ul>
          <li
            onClick={() => setActiveTab("doctors")}
            className={`cursor-pointer py-2 px-4 rounded-lg flex items-center space-x-3 ${
              activeTab === "doctors" ? "bg-indigo-600" : ""
            }`}
          >
            <Link to="/admin/" className="flex items-center space-x-3">
              <FaUserMd />
              <span>Manage Doctors</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveTab("patients")}
            className={`cursor-pointer py-2 px-4 rounded-lg flex items-center space-x-3 ${
              activeTab === "patients" ? "bg-indigo-600" : ""
            }`}
          >
            <Link to="/admin/patients" className="flex items-center space-x-3">
              <FaUser />
              <span>Manage Patients</span>
            </Link>
          </li>
          <li
            onClick={() => setActiveTab("admins")}
            className={`cursor-pointer py-2 px-4 rounded-lg flex items-center space-x-3 ${
              activeTab === "admins" ? "bg-indigo-600" : ""
            }`}
          >
            <Link to="/admin/admins" className="flex items-center space-x-3">
              <FaUserShield />
              <span>Manage Admins</span>
            </Link>
          </li>
          
          <li
            onClick={() => setActiveTab("appointments")}
            className={`cursor-pointer py-2 px-4 rounded-lg flex items-center space-x-3 ${
              activeTab === "appointments" ? "bg-indigo-600" : ""
            }`}
          >
            <Link to="/admin/appointments" className="flex items-center space-x-3">
              <FaCalendarAlt />
              <span>View Appointments</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
