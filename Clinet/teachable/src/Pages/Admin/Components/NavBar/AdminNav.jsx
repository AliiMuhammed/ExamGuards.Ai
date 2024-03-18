import React from "react";
import "./style/adminNav.css";
import { Link } from "react-router-dom";
import adminImg from "../../../../Assets/Images/user.png";
const AdminNav = () => {
  return (
    <nav className="admin-nav">
      <Link
        to={"/admin/profle"}
        className="admin-profile"
        style={{ backgroundImage: `url(${adminImg})` }}
      >
      </Link>
    </nav>
  );
};

export default AdminNav;
