import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isAuthenticated, isAdmin, isReporter } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const userHasRequiredRole = () => {
    if (roles.includes('admin') && isAdmin()) {
      return true;
    }
    if (roles.includes('reporter') && isReporter()) {
      return true;
    }
    return false;
  };

  if (!userHasRequiredRole()) {
    // Redirect them to the page they were on.
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
