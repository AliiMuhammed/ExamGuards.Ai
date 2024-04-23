import React, { useState } from "react";
import "./Style/adminProfile.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AdminChangePassword from "./Components/Change Password/AdminChangePassword";
import AdminEditProfile from "./Components/Edit Profile/AdminEditProfile";
import AdminPersonalInfo from "./Components/Personal Info/AdminPersonalInfo";
import { IoPerson } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const AdminProfile = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <AdminPersonalInfo />;
      case 1:
        return <AdminEditProfile />;
      case 2:
        return <AdminChangePassword />;
      default:
        return null;
    }
  };
  return (
    <section className="admin-profile-section">
      <div className="container">
        <div className="left">
          <Tabs
            value={value}
            onChange={handleChange}
            className="admin-tabs-contaienr"
            orientation="vertical"
          >
            <Tab
              icon={<IoPerson />}
              iconPosition="start"
              label="Personal info"
              className="admin-tabs"
            />
            <Tab
              label="edit profile"
              icon={<MdEdit />}
              iconPosition="start"
              className="admin-tabs"
            />
            <Tab
              label="change password"
              icon={<RiLockPasswordFill />}
              iconPosition="start"
              className="admin-tabs"
            />
          </Tabs>
        </div>
        <div className="right">{renderTabContent()}</div>
      </div>
    </section>
  );
};

export default AdminProfile;
