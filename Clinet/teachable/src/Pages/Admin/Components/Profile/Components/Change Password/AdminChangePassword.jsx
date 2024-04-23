import React, { useState } from "react";
import "./style/adminChangePassword.css";
import MyToast from "../../../../../../Shared/Components/MyToast";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAuthUser, setAuthUser } from "../../../../../../Helper/Storage";
import http from "./../../../../../../Helper/http";
import { TextField, Button, FormHelperText } from "@mui/material";

const AdminChangePassword = () => {
  const [ToastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState({
    msg: "",
    type: "",
  });
  const [passChange, setPassChange] = useState({
    password: "",
    passwordConfirm: "",
  });

  const [pass, setPass] = useState({
    loading: false,
    errorMsg: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassChange((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // handle open and colse toaster
  const handleToastOpen = () => {
    setToastOpen(true);
  };

  const handleSucessClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setToastOpen(false);
  };

  const handleSubmit = (e) => {
    setPass({ ...pass, loading: true });
    e.preventDefault();
    if (!passChange.password || !passChange.passwordConfirm) {
      setPass({
        ...pass,
        loading: false,
        errorMsg: "You must fill both fields to change the password",
      });
      return;
    }

    http
      .PATCH("users/updateMe")
      .then((res) => {
        setPass({ ...pass, loading: false, errorMsg: "" });
        setToastMsg({
          ...toastMsg,
          msg: "ِPassword Changed successfully",
          type: "success",
        });
        handleToastOpen();

        setPassChange({
          password: "",
          passwordConfirm: "",
        });
      })
      .catch((err) => {
        setPass({
          ...pass,
          loading: false,
          errorMsg: "something went wrong",
        });
        setToastMsg({
          ...toastMsg,
          msg: "Something went wrong",
          type: "error",
        });
        handleToastOpen();
      });
  };
  return (
    <div className="admin-change-password">
      {pass.errorMsg !== "" && <Alert severity="error">{pass.errorMsg}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Password"
          name="password"
          value={passChange.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Confirm Password"
          name="passwordConfirm"
          value={passChange.passwordConfirm}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          size="large"
          className="update-admin-btn"
          variant="contained"
          color="primary"
          disabled={pass.loading}
        >
          {pass.loading ? (
            <CircularProgress
              size={20}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ED6B17",
              }}
            />
          ) : (
            "Update"
          )}
        </Button>
      </form>
      <MyToast
        handleClose={handleSucessClose}
        open={ToastOpen}
        msg={toastMsg}
      />
    </div>
  );
};

export default AdminChangePassword;
