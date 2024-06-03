import React, { useState } from "react";
import "./Style/userProfile.css";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ChangePassword from "./Components/Change Password/ChangePassword";
import EditProfile from "./Components/Edit Profile/EditProfile";
import PersonalInfo from "./Components/Personal Info/PersonalInfo";
import { IoPerson } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const UserProfile = () => {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const isSmallOrMedium = useMediaQuery(theme.breakpoints.down("md"));

  const renderTabContent = () => {
    switch (value) {
      case 0:
        return <PersonalInfo />;
      case 1:
        return <EditProfile setValue={setValue} />;
      case 2:
        return <ChangePassword setValue={setValue} />;
      default:
        return null;
    }
  };

  return (
    <section className="user-profile-section">
      <div className="container">
        <div className="left">
          <Tabs
            value={value}
            onChange={handleChange}
            className="user-tabs-contaienr"
            orientation={isSmallOrMedium ? "horizontal" : "vertical"}
            variant="scrollable"
            scrollButtons={"auto"}
            aria-label="scrollable auto tabs example"
            allowScrollButtonsMobile
            role="navigation"
            
            sx={{
              width: "100%",
            }}
          >
            <Tab
              icon={<IoPerson />}
              iconPosition="start"
              label="Personal info"
              className="user-tabs"
            />
            <Tab
              label="edit profile"
              icon={<MdEdit />}
              iconPosition="start"
              className="user-tabs"
            />
            <Tab
              label="change password"
              icon={<RiLockPasswordFill />}
              iconPosition="start"
              className="user-tabs"
            />
          </Tabs>
        </div>
        <div className="right">{renderTabContent()}</div>
      </div>
    </section>
  );
};

export default UserProfile;
