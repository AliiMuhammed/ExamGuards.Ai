import React, { useState } from "react";
import "./style/instructor.css";
import SideMenu from "./components/Side Menu/SideMenu";
import { LuMenu } from "react-icons/lu";
import { Outlet } from "react-router";
import Nav from "../../Shared/Components/Nav";
import Footer from "./../../Shared/Components/Footer";

const Instructor = () => {
  const [toggled, setToggled] = useState(false);
  return (

      <div className="instructor-section">
        <div className="left">
          <SideMenu toggled={toggled} setToggled={setToggled} />
        </div>
        <div className="right">
          <Nav />
          <div className="toggle-container">
            <button className="toggle-btn" onClick={() => setToggled(!toggled)}>
              <LuMenu />
            </button>
          </div>
          <Outlet />
          <Footer />
        </div>
      </div>

  );
};

export default Instructor;
