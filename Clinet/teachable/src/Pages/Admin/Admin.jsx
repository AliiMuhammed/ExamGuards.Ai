import React from "react";
import SideMenu from "./Components/Side Menu/SideMenu";
import { Outlet } from "react-router";
import "./Style/admin.css"
const Admin = () => {
  return (
    <section className="admin-section">
      <SideMenu />
      <Outlet />
    </section>
  );
};

export default Admin;
