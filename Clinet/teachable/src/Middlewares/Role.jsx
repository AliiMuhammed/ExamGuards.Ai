import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../Helper/Storage";

const Role = () => {
  const auth = getAuthUser();

  if (!auth) {
    return <Navigate to={"/"} />;
  } else if (
    auth.data.data.user.role === "admin" ||
    auth.data.data.user.role === "super admin"
  ) {
    return (
      <>
        <Navigate to={"/admin"} />
        <Outlet />
      </>
    );
  } else if (auth.data.data.user.role === "instructor") {
    return (
      <>
        <Navigate to={"/instructor"} />
        <Outlet />
      </>
    );
  } else if (auth.data.data.user.role === "student") {
    return (
      <>
        <Navigate to={"/student"} />
        <Outlet />
      </>
    );
  }

  // Default case: redirect to login
  return <Navigate to={"/"} />;
};

export default Role;
