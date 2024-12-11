import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUserMd, FaCalendarAlt, FaSignOutAlt } from "react-icons/fa";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [userName, setUserName] = useState(""); // State to store the user's name
  const navigate = useNavigate();

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
      {/* Fixed Horizontal Navigation Bar */}
      <header className="flex items-center justify-between p-4 shadow-md fixed top-0 left-0 w-full bg-white z-10 border-b border-gray-200">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <img
            src="/img/logo.png" // Replace with your logo path
            alt="Doctor Logo"
            className="w-20 h-15"
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex space-x-8">
          <Link
            to="/doctor/"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center space-x-2 text-gray-700 ${
              activeTab === "profile" ? "font-bold text-blue-600" : ""
            } hover:text-blue-600 transition-colors`}
          >
            <FaUserMd />
            <span>Profile</span>
          </Link>
          <Link
            to="/doctor/appointments"
            onClick={() => setActiveTab("appointments")}
            className={`flex items-center space-x-2 text-gray-700 ${
              activeTab === "appointments" ? "font-bold text-blue-600" : ""
            } hover:text-blue-600 transition-colors`}
          >
            <FaCalendarAlt />
            <span>Manage Appointments</span>
          </Link>
        </nav>

        {/* Right Logo */}
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
      <div className="flex-1 p-6 mt-[80px] bg-gray-100 rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
};

export default DoctorDashboard;
