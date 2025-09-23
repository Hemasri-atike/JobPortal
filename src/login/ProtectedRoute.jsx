import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { userInfo } = useSelector((state) => state.user || {});

  // Check if user is authenticated
  if (!userInfo?.token) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(userInfo?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render child routes or component
  return <Outlet />;
};

export default ProtectedRoute;