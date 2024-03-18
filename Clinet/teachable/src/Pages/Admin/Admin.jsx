import React from "react";
import SideMenu from "./Components/Side Menu/SideMenu";
import { Outlet } from "react-router";
import "./Style/admin.css";
import AdminNav from "./Components/NavBar/AdminNav";
const Admin = () => {
  return (
    <section className="admin-section">
      <div className="left">
        <SideMenu />
      </div>
      <div className="right">
        <AdminNav />
        <Outlet />
      </div>
    </section>
  );
};

export default Admin;
