import React, { useState } from "react";
import "../Style/nav.css";
import { Link, useNavigate } from "react-router-dom";
import userImg from "../../Assets/Images/user.png";
import { getAuthUser, removeAuthUser } from "../../Helper/Storage";
import { FiLogOut } from "react-icons/fi";
import { IoNotifications, IoClose } from "react-icons/io5";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import { FaRegClock } from "react-icons/fa6";

const Nav = () => {
  const [show, setShow] = useState(false);
  const [showNot, setShowNot] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setShowNot(true);
  };
  const user = getAuthUser();
  const naviagate = useNavigate();
  const role = user?.data?.data?.user?.role;
  const handleLogOut = () => {
    naviagate("/");
    removeAuthUser();
  };
  return (
    <nav className="user-nav">
      <Tooltip title="Profile">
        <Link
          to={`/${role === "super admin" ? "admin" : role}/profile/${
            user?.data?.data?.user?._id
          }`}
          className="user-profile"
          style={{
            backgroundImage: `url(${
              user ? user?.data?.data?.user?.file : userImg
            })`,
          }}
        ></Link>
      </Tooltip>

      <Tooltip title="2 unread notifications">
        <button className="not-btn" onClick={handleShow}>
          <div className="badge-number">5</div>
          <IoNotifications />
        </button>
      </Tooltip>

      <Tooltip title="Logout">
        <button className="logout-btn" onClick={handleLogOut}>
          <FiLogOut />
        </button>
      </Tooltip>
      <Drawer
        open={show}
        onClose={handleClose}
        anchor="right"
        className="drawer-notification"
        sx={{ width: "100px" }}
      >
        <div className="cloes-btn">
          <button onClick={handleClose}>
            <IoClose />
          </button>
        </div>
        <div className="notification">
          <div className="header">
            <div className="time">
              <FaRegClock />
              just now
            </div>
            <Tooltip title="Delete">
              <button className="delete">
                <IoClose />
              </button>
            </Tooltip>
          </div>
          <div className="body">
            test notification bodytest notification bodytest notification
            bodytest notification bodytest notification bodytest notification
            bodytest notification bodytest notification body
          </div>
        </div>
        {/* <div className="empty-notification">
          <div className="icon">
            <IoNotifications />
          </div>
          <div className="text">
            <p>No new notifications</p>
          </div>
        </div> */}
      </Drawer>
    </nav>
  );
};

export default Nav;
