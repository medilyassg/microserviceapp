import React from 'react';
import { Navigate } from 'react-router-dom';

// PrivateRoute component to handle route protection
const PrivateRoute = ({ children, requiredRole }) => {
  // Get the user from localStorage (or context)
  const user = JSON.parse(localStorage.getItem("user"));
  
  // If no user or role doesn't match, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the user's role doesn't match the required role, redirect to home or another page
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
