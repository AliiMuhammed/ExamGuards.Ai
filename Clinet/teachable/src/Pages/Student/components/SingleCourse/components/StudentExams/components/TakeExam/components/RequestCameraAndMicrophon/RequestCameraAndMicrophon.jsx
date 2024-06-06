import React, { forwardRef } from "react";
import "./style/requestCameraMicorphon.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router";
import Slide from "@mui/material/Slide";
import Backdrop from "@mui/material/Backdrop";

const RequestCameraAndMicrophone = ({
  permissions,
  setPermissions,
  open,
  setOpen,
  onPermissionsGranted,
}) => {

  const navigate = useNavigate();

  const handleAgree = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const newPermissions = { camera: true, microphone: true };
      setPermissions(newPermissions);
      sessionStorage.setItem("permissions", JSON.stringify(newPermissions));
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      const newPermissions = { camera: false, microphone: false };
      setPermissions(newPermissions);
      sessionStorage.setItem("permissions", JSON.stringify(newPermissions));
    } finally {
      setOpen(false);
      onPermissionsGranted();
    }
  };

  const handleDisagree = () => {
    const newPermissions = { camera: false, microphone: false };
    setPermissions(newPermissions);
    sessionStorage.setItem("permissions", JSON.stringify(newPermissions));
    setOpen(false);
    navigate(`/student/home`);
  };

  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <Backdrop sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Request Camera and Microphone Permissions"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This application requires access to your camera and microphone to proceed. Please grant the necessary permissions.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button className="main-btn sm" onClick={handleDisagree}>
            Disagree
          </button>
          <button className="main-btn sm update" onClick={handleAgree} autoFocus>
            Agree
          </button>
        </DialogActions>
      </Dialog>
    </Backdrop>
  );
};

export default RequestCameraAndMicrophone;
