import React from "react";
import "./style/adminNav.css";
import { Link } from "react-router-dom";
import adminImg from "../../../../Assets/Images/user.png";
import { getAuthUser } from "../../../../Helper/Storage";
const AdminNav = () => {
  const user = getAuthUser();
  console.log();
  return (
    <nav className="admin-nav">
      <Link
        to={"/admin/profle"}
        className="admin-profile"
        style={{
          backgroundImage: `url(${user ? user.data.user.photo : adminImg})`,
        }}
      ></Link>
    </nav>
  );
};

export default AdminNav;
