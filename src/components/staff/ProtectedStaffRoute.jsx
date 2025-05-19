import * as React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedStaffRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isStaffAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/staff/login" />;
  }
  
  return children;
};

export default ProtectedStaffRoute; 