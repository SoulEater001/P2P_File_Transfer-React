import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const location = useLocation(); // Get the current location of the route

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page and pass the current location
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
