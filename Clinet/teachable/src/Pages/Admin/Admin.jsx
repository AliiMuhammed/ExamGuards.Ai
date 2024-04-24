import React, { Suspense } from "react";
import { Outlet } from "react-router";
import "./Style/admin.css";
import MyToast from "../../Shared/Components/MyToast";
const SideMenu = React.lazy(() => import("./Components/Side Menu/SideMenu"));
const AdminNav = React.lazy(() => import("./Components/NavBar/AdminNav"));
const Backdrop = React.lazy(() => import("./../../Shared/Components/Backdrop"));

const Admin = () => {
  return (
    <Suspense fallback={<Backdrop />}>
      <section className="admin-section">
        <div className="left">
          <SideMenu />
        </div>
        <div className="right">
          <AdminNav />
          <Outlet />
        </div>
      </section>
      <MyToast />
    </Suspense>
  );
};

export default Admin;
