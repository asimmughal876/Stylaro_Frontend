import React from "react";
import { Navigate } from "react-router-dom";
import { showErrorToast } from "./toast";
import { getUserFromToken } from "../model/Model";

const ProtectedAdminRoute = ({ children }) => {
  const user = getUserFromToken();

  if (!user || user.role !== "admin") {
    showErrorToast("Only Admin Can Access Admin Panel");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
