import React from "react";
import { Outlet } from "react-router";
import "./Style/admin.css";
const SideMenu = React.lazy(() => import("./Components/Side Menu/SideMenu"));
const AdminNav = React.lazy(() => import("./Components/NavBar/AdminNav"));

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
