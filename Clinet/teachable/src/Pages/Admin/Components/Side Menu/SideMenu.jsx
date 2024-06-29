import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
import logo from "../../../../Assets/Images/Logos/h-logo-white.png";
import iconW from "../../../../Assets/Images/Logos/icon w.png";
import "./Style/sideMenu.css";
import { FaHome } from "react-icons/fa";
import { IoPerson, IoPieChartSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";
import { IoIosArrowBack, IoIosArchive } from "react-icons/io";
import { FaBook } from "react-icons/fa6";
import { FaCheckSquare } from "react-icons/fa";

function SideMenu() {
  const [sideMenuToggle, setSideMenuToggle] = useState(false);
  const handleToggle = () => {
    setSideMenuToggle(!sideMenuToggle);
  };
  return (
    <Sidebar
      collapsed={sideMenuToggle}
      width={"100%"}
      backgroundColor=""
      className="sideMenu"
      toggled={sideMenuToggle}
    >
      <div className="sideMenu-header">
        <div className="logo">
          <img src={logo} loading="lazy" alt="logo" />
        </div>
        <button onClick={handleToggle} className="toggle">
          {sideMenuToggle ? (
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
        <MenuItem component={<NavLink to="/admin/courses" />} icon={<FaBook />}>
          Courses
        </MenuItem>
        <MenuItem
          component={<NavLink to="/admin/approvedCourses" />}
          icon={<FaCheckSquare />}
        >
          Approve
        </MenuItem>
        <MenuItem icon={<BiSolidReport />}> Reports </MenuItem>
        <MenuItem icon={<IoIosArchive />}> Archive </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideMenu;
