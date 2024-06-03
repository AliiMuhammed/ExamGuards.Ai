import React, { useEffect, useState } from "react";
import "./style/personalInfo.css";
import { useSelector } from "react-redux";

import { getAuthUser } from "../../../../Helper/Storage";
const PersonalInfo = () => {
  const refresh = useSelector((state) => state.refresh); // Accessing the refresh state from Redux
  const convertTime = (time) => {
    const date = new Date(time);
    // Format the date to a readable format
    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  const [User, setUser] = useState(getAuthUser()?.data?.data?.user);
  useEffect(() => {
    setUser(getAuthUser()?.data?.data?.user);
  }, [refresh]);
  return (
    <div className="admin-personal-info">
      <div className="left">
        <div
          className="image"
          style={{ backgroundImage: `url(${User.file})` }}
        ></div>
      </div>
      <div className="right">
        <div className="name">
          <p>
            <span>First Name:</span>
            {User.firstName}
          </p>
        </div>
        <div className="name">
          <p>
            <span>Last Name:</span>
            {User.lastName}
          </p>
        </div>
        <div className="email">
          <p>
            <span>Email:</span>
            {User.email}
          </p>
        </div>
        <div className="align-data">
          <div className="role">
            <p>
              <span>Role:</span>
              {User.role}
            </p>
          </div>
          <div className="status">
            <p>
              <span>Status:</span>
              {User.active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>

        <div className="times">
          <p>
            <span>Joined at:</span>
            {convertTime(User.createdAt)}
          </p>
          <p>
            <span>Last Update:</span>
            {convertTime(User.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
