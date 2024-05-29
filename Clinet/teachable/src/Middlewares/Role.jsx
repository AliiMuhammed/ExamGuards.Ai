import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthUser } from "../Helper/Storage";

const Role = () => {
  const auth = getAuthUser();
  const location = useLocation();

  if (!auth) {
    return <Navigate to={"/"} />;
  }

  const { role } = auth.data.data.user;

  // Check if the current location matches the user's role path
  if (location.pathname.startsWith(`/${role}`)) {
    return <Outlet />;
  }

  // Redirect based on the user's role
  if (role === "admin" || role === "super admin") {
    return <Navigate to={"/admin"} />;
  } else if (role === "instructor") {
    return <Navigate to={"/instructor"} />;
  } else if (role === "student") {
    return <Navigate to={"/student"} />;
  }

  // Default case: redirect to login
  return <Navigate to={"/"} />;
};

export default Role;
