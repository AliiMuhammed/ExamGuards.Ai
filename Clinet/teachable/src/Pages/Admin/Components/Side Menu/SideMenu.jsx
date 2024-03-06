import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";
import logo from "../../../../Assets/Images/Logos/h-logo-white.png";
import "./Style/sideMenu.css";
import { FaHome } from "react-icons/fa";
import { IoPerson, IoPieChartSharp } from "react-icons/io5";
import { BiSolidReport } from "react-icons/bi";

function SideMenu() {
  return (
    <Sidebar width={"100%"} backgroundColor="" className="sideMenu">
      <div className="sideMenu-header">
        <div className="logo">
          <img src={logo} loading="lazy" alt="logo" />
        </div>
      </div>
      <Menu>
        <MenuItem component={<Link to="/admin/home" />} icon={<FaHome />}>
          Home
        </MenuItem>
        <SubMenu icon={<IoPerson />} label="Users">
          <MenuItem
            component={<Link to="/admin/students" />}
            className="submenu-link"
          >
            Students
          </MenuItem>
          <MenuItem
            component={<Link to="/admin/instructors" />}
            className="submenu-link"
          >
            Instructors
          </MenuItem>
        </SubMenu>
        <SubMenu icon={<IoPieChartSharp />} label="Charts">
          <MenuItem className="submenu-link"> Pie charts </MenuItem>
          <MenuItem className="submenu-link"> Line charts </MenuItem>
        </SubMenu>
        <MenuItem icon={<BiSolidReport />}> Reports </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideMenu;
