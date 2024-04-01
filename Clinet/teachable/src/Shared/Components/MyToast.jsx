import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
const MyToast = ({ handleClose, open, msg }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={msg.type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {msg.msg}
      </Alert>
    </Snackbar>
  );
};

export default MyToast;
