import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const studentToken = localStorage.getItem('studentToken');
  const studentData = localStorage.getItem('studentData');

  if (!studentToken || !studentData) {
    // Clear any partial data
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    // Redirect to login page but save the attempted url
    return <Navigate to="/student/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 