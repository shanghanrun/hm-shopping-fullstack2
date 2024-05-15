import React from "react";
import userStore from '../store/userStore'
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ permissionLevel }) => {
  const {user} = userStore()
  const isAuthenticated =
    user?.level === permissionLevel || user?.level === "admin";

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
