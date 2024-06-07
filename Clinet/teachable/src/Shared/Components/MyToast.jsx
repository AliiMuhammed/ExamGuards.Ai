// MyToast.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { closeToast } from "../../Redux/Slices/toastSlice";

const MyToast = () => {
  const { open, msg, type } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeToast());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      sx={{ width:"30%" }}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        sx={{ width: "100%" }}
        variant="filled"
      >
        {msg}
      </Alert>
    </Snackbar>
  );
};

export default MyToast;
