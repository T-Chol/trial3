// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ component: Component, role }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a specific role and user doesn't have it,
  // redirect to their appropriate dashboard
  if (role && user.role !== role) {
    switch (user.role) {
      case 'deputyDirector':
        return <Navigate to="/admin-dashboard" replace />;
      case 'principalOfficer':
        return <Navigate to="/principal-officer-dashboard" replace />;
      case 'seniorOfficer':
        return <Navigate to="/senior-officer-dashboard" replace />;
      case 'officer':
        return <Navigate to="/officer-dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  // If everything is okay, render the protected component
  return <Component />;
};

export default ProtectedRoute;