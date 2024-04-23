import React from "react";
import "./style/adminPersonalInfo.css";

import { getAuthUser } from "../../../../../../Helper/Storage";
const AdminPersonalInfo = () => {
  const Admin = getAuthUser()?.data?.data?.user;
  console.log(Admin);
  return (
    <div className="admin-personal-info">
      <div className="left">
        <div
          className="image"
          style={{ backgroundImage: `url(${Admin.file})` }}
        ></div>
      </div>
      <div className="right">
        <div className="name">
          <p>
            <span>First Name:</span>
            {Admin.firstName}
          </p>
        </div>
        <div className="name">
          <p>
            <span>Last Name:</span>
            {Admin.lastName}
          </p>
        </div>
        <div className="email">
          <p>
            <span>Email:</span>
            {Admin.email}
          </p>
        </div>
        <div className="role">
          <p>
            <span>Role:</span>
            {Admin.role}
          </p>
        </div>
        <div className="status">
          <p>
            <span>Status:</span>
            {Admin.active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPersonalInfo;
