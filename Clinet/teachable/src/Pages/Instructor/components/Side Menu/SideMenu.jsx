import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./style/sideMenu.css";
import logo from "../../../../Assets/Images/Logos/h-logo-white.png";
import iconW from "../../../../Assets/Images/Logos/icon w.png";
import { FaHome } from "react-icons/fa";
import { IoPieChartSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { IoIosArrowBack, IoIosArchive } from "react-icons/io";
import { FaBook } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

const SideMenu = ({ toggled, setToggled }) => {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggle = () => {
    setCollapsed(false);
    setToggled(false);
  };
  return (
    <div className="custom-side">
      <Sidebar
        className="sideMenu"
        onBackdropClick={() => setToggled(false)}
        toggled={toggled}
        breakPoint="md"
        collapsed={collapsed}
        backgroundColor=""
        width="100%"
      >
        <div className="sideMenu-header">
          <div className="logo">
            <img src={logo} loading="lazy" alt="logo" />
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="collapsed"
          >
            {collapsed ? (
              <img src={iconW} className="open-icon" alt="icon" />
            ) : (
              <IoIosArrowBack />
            )}
          </button>
          <button onClick={() => handleToggle()} className="toggle">
            {collapsed ? (
              <img src={iconW} className="open-icon" alt="icon" />
            ) : (
              <IoIosArrowBack />
            )}
          </button>
        </div>
        <Menu closeOnClick={true}>
          <MenuItem
            onClick={() => setToggled(false)}
            component={<NavLink to="/instructor/home" />}
            icon={<FaHome />}
          >
            Home
          </MenuItem>
          <MenuItem
            onClick={() => setToggled(false)}
            component={<NavLink to="/instructor/courses" />}
            icon={<FaBook />}
          >
            Courses
          </MenuItem>
          <SubMenu icon={<IoPieChartSharp />} label="Charts">
            <MenuItem
              onClick={() => setToggled(false)}
              className="submenu-link"
            >
              Pie charts
            </MenuItem>
            <MenuItem
              onClick={() => setToggled(false)}
              className="submenu-link"
            >
              Line charts
            </MenuItem>
          </SubMenu>
          <MenuItem
            component={<NavLink to="/instructor/Reports" />}
            onClick={() => setToggled(false)}
            icon={<BiSolidReport />}
          >
            Reports
          </MenuItem>
          <MenuItem onClick={() => setToggled(false)} icon={<IoIosArchive />}>
            Archive
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SideMenu;
