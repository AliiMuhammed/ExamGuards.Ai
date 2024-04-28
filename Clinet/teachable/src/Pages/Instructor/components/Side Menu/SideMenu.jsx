import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "./style/sideMenu.css";
import logo from "../../../../Assets/Images/Logos/h-logo-white.png";
import iconW from "../../../../Assets/Images/Logos/icon w.png";
import { FaHome } from "react-icons/fa";
import { IoPerson, IoPieChartSharp } from "react-icons/io5";
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
          <MenuItem component={<NavLink to="/admin/home" />} icon={<FaHome />}>
            Home
          </MenuItem>
          <SubMenu icon={<IoPerson />} label="Users">
            <MenuItem
              component={<NavLink to="/admin/students" />}
              className="submenu-link"
            >
              Students
            </MenuItem>
            <MenuItem
              component={<NavLink to="/admin/instructors" />}
              className="submenu-link"
            >
              Instructors
            </MenuItem>
            <MenuItem
              component={<NavLink to="/admin/admins" />}
              className="submenu-link"
            >
              Admins
            </MenuItem>
          </SubMenu>
          <SubMenu icon={<IoPieChartSharp />} label="Charts">
            <MenuItem className="submenu-link"> Pie charts </MenuItem>
            <MenuItem className="submenu-link"> Line charts </MenuItem>
          </SubMenu>
          <MenuItem
            component={<NavLink to="/admin/courses" />}
            icon={<FaBook />}
          >
            Courses
          </MenuItem>
          <MenuItem icon={<BiSolidReport />}> Reports </MenuItem>
          <MenuItem icon={<IoIosArchive />}> Archive </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SideMenu;
