import React, { useState } from "react";
import "./style/restPass.css";
import { TextField, Button } from "@mui/material";
import logo from "../../../../Assets/Images/Logos/h-logo.png";
import http from "../../../../Helper/http";
import Alert from "@mui/material/Alert";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";
import { setAuthUser } from "../../../../Helper/Storage";

const RestPass = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [reset, setReset] = useState({
    loading: false,
    errorMsg: "",
  });
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password || !passwordConfirm) {
      setReset({ ...reset, errorMsg: "Please enter both passwords" });
      return;
    }
    if (password !== passwordConfirm) {
      setReset({ ...reset, errorMsg: "Passwords do not match" });
      return;
    }
    setReset({ ...reset, loading: true, errorMsg: "" });
    let data = {
      password,
      passwordConfirm,
    };
    http
      .PATCH(`users/resetPassword/${token}`, data)
      .then((res) => {
        setReset({
          ...reset,
          loading: false,
          errorMsg: "",
        });
        dispatch(
          openToast({
            msg: "Password reset successfully",
            type: "success",
          })
        );
        setAuthUser(res, res.data?.data?.user?.rememberMe);
        const role = res.data.data.user.role;
        navigate(`/${role}`);
      })
      .catch((err) => {
        setReset({
          ...reset,
          loading: false,
          errorMsg: err.response.data.message,
        });
        dispatch(
          openToast({
            msg: "something went wrong",
            type: "error",
          })
        );
      });
    // Add your OTP verification logic here
  };

  return (
    <section className="reset-section">
      <div className="container">
        <div className="reset-box">
          {reset.errorMsg !== "" && (
            <Alert sx={{ width: "100%" }} severity="error">
              {reset.errorMsg}
            </Alert>
          )}
          <div className="header">
            <div className="logo">
              <img src={logo} alt="logo" loading="lazy" />
            </div>
            <h1>Reset Password</h1>
            <p>Please enter the new password</p>
          </div>
          <div className="form-reset">
            <form onSubmit={handleSubmit}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="reset-password-input"
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="reset-password-input"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="reset-btn"
              >
                Reset Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestPass;
