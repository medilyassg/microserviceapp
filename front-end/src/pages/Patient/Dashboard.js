import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaHistory, FaUser, FaSignOutAlt } from "react-icons/fa";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // State to store the user's name

  useEffect(() => {
    // Get user from localStorage when component mounts
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name); // Assuming user object has a name property
    }
  }, []);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("user");
    // Navigate to the home page (or login page if preferred)
    navigate("/");
  };
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Horizontal Navigation Bar */}
      <header className="flex items-center justify-between p-4 shadow-md fixed top-0 left-0 w-full bg-white z-10 border-b border-gray-200">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/img/logo.png" // Replace with your logo path
            alt="Patient Logo"
            className="w-20 h-15"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex space-x-8">
          <Link
            to="/patient/"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 text-gray-700 ${
              activeTab === "profile" ? "font-bold text-blue-600" : ""
            } hover:text-blue-600 transition-colors`}
          >
            <FaUser />
            <span>Profile</span>
          </Link>
          <Link
            to="/patient/appointments"
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center space-x-2 text-gray-700 ${
              activeTab === "appointments" ? "font-bold text-blue-600" : ""
            } hover:text-blue-600 transition-colors`}
          >
            <FaCalendarAlt />
            <span>Appointments</span>
          </Link>
          <Link
            to="/patient/history"
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 text-gray-700 ${
              activeTab === "history" ? "font-bold text-blue-600" : ""
            } hover:text-blue-600 transition-colors`}
          >
            <FaHistory />
            <span>History</span>
          </Link>
        </nav>

        {/* Right Logo (Optional) */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">{userName}</span> {/* Display the user's name */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
          <img
            src="/img/logo2.png" // Replace with your second logo path
            alt="Company Logo"
            className="w-15 h-10"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 mt-20 bg-gray-100 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientDashboard;
