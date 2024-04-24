import React from "react";
import "./style/adminPersonalInfo.css";

import { getAuthUser } from "../../../../../../Helper/Storage";
const AdminPersonalInfo = () => {
  const convertTime = (time) => {
    const date = new Date(time);
    // Format the date to a readable format
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };

  const Admin = getAuthUser()?.data?.data?.user;
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
        <div className="align-data">
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

        <div className="times">
          <p>
            <span>Joined at:</span>
            {convertTime(Admin.createdAt)}
          </p>
          <p>
            <span>Last Update:</span>
            {convertTime(Admin.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPersonalInfo;
