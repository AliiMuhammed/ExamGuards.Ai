import React from "react";
import { Outlet } from "react-router";
import "./Style/admin.css";
import Nav from "../../Shared/Components/Nav";
const SideMenu = React.lazy(() => import("./Components/Side Menu/SideMenu"));

const Admin = () => {
  return (
      <section className="admin-section">
        <div className="left">
          <SideMenu />
        </div>
        <div className="right">
          <Nav />
          <Outlet />
        </div>
      </section>
  );
};

export default Admin;
