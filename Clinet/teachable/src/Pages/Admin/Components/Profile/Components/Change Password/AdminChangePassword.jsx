import React, { useState } from "react";
import "./style/adminChangePassword.css";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { getAuthUser, setAuthUser } from "../../../../../../Helper/Storage";
import http from "./../../../../../../Helper/http";
import { TextField, Button, FormHelperText } from "@mui/material";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../../../Redux/Slices/toastSlice";

const AdminChangePassword = () => {
  const dispatch = useDispatch();
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
        dispatch(
          openToast({
            msg: "ِPassword Changed successfully",
            type: "success",
          })
        );
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
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
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
    </div>
  );
};

export default AdminChangePassword;
