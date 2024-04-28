import React, { useState } from "react";
import "./style/instructor.css";
import SideMenu from "./components/Side Menu/SideMenu";
import AdminNav from "../Admin/Components/NavBar/AdminNav";
import { LuMenu } from "react-icons/lu";
import { Outlet } from "react-router";

const Instructor = () => {
  const [toggled, setToggled] = useState(false);
  return (
    <div className="instructor-section">
      <div className="left">
        <SideMenu toggled={toggled} setToggled={setToggled} />
      </div>
      <div className="right">
        <AdminNav />
        <div className="toggle-container">
          <button className="toggle-btn" onClick={() => setToggled(!toggled)}>
            <LuMenu />
          </button>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Instructor;
