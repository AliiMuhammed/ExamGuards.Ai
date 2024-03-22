import React, { useState } from "react";
import "./style/adminNav.css";
import { Link, useNavigate } from "react-router-dom";
import adminImg from "../../../../Assets/Images/user.png";
import { getAuthUser, removeAuthUser } from "../../../../Helper/Storage";
import { FiLogOut } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Offcanvas from "react-bootstrap/Offcanvas";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const AdminNav = () => {
  const [show, setShow] = useState(false);
  const [showNot, setShowNot] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setShowNot(true);
  };
  const user = getAuthUser();
  const naviagate = useNavigate();
  const handleLogOut = () => {
    naviagate("/");
    removeAuthUser();
  };
  return (
    <nav className="admin-nav">
      <OverlayTrigger
        key={"bottom-1"}
        placement={"bottom"}
        overlay={<Tooltip>Profile</Tooltip>}
      >
        <Link
          to={"/admin/profle"}
          className="admin-profile"
          style={{
            backgroundImage: `url(${
              user ? user?.data?.data?.user?.photo : adminImg
            })`,
          }}
        ></Link>
      </OverlayTrigger>
      <OverlayTrigger
        key={"bottom-3"}
        placement={"bottom"}
        overlay={<Tooltip>2 unread notifications</Tooltip>}
      >
        <button className="not-btn" onClick={handleShow}>
          <div className="badge-number">5</div>
          <IoNotifications />
        </button>
      </OverlayTrigger>
      <OverlayTrigger
        key={"bottom-2"}
        placement={"bottom"}
        overlay={<Tooltip>Logout</Tooltip>}
      >
        <button className="logout-btn" onClick={handleLogOut}>
          <FiLogOut />
        </button>
      </OverlayTrigger>

      <Offcanvas show={show} onHide={handleClose} placement={"end"}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ToastContainer className="position-static">
            <Toast
              onClose={() => setShowNot(false)}
              show={showNot}
              delay={3000}
              animation={true}
            >
              <Toast.Header>
                <IoNotifications className="me-2" />
                <strong className="me-auto">test notification</strong>
                <small className="text-muted">just now</small>
              </Toast.Header>
              <Toast.Body>See? Just like this.</Toast.Body>
            </Toast>
            <Toast
              delay={3000}
              animation={true}
            >
              <Toast.Header>
                <IoNotifications className="me-2" />
                <strong className="me-auto">test notification</strong>
                <small className="text-muted">2 seconds ago</small>
              </Toast.Header>
              <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
            </Toast>
          </ToastContainer>
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
};

export default AdminNav;
