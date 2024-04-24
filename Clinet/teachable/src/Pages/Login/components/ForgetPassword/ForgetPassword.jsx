import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../../../../Assets/Images/Logos/h-logo.png";
import "./style/forget.css";
import { Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import Alert from "@mui/material/Alert";
import http from "../../../../Helper/http";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";

const ForgetPassword = ({ handleShowOTP }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [forget, setForget] = useState({
    loading: false,
    errorMsg: "",
  });
  const handleForget = (e) => {
    e.preventDefault();
    if (!email) {
      setForget({
        ...forget,
        errorMsg: "Email is required",
      });
      return;
    }
    setForget({ ...forget, errorMsg: "", loading: true });
    http
      .POST(`users/forgotPassword`, { email })
      .then((res) => {
        console.log(res);
        setForget({
          ...forget,
          loading: false,
          errorMsg: "",
        });
        dispatch(
          openToast({
            msg: "OTP is sent to your email successfully",
            type: "success",
          })
        );
        handleShowOTP();
      })
      .catch((err) => {
        console.log(err);
        setForget({
          ...forget,
          loading: false,
          errorMsg: err.message,
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
    <section className="forget-section">
      <div className="container">
        <div className="forget-box">
          {forget.errorMsg !== "" && (
            <Alert sx={{ width: "100%" }} severity="error">
              {forget.errorMsg}
            </Alert>
          )}

          <div className="header">
            <div className="logo">
              <img src={logo} alt="logo" loading="lazy" />
            </div>
            <h1>Forget Password</h1>
            <p>
              Enter your email and we'll send you an OTP code to reset your
              password
            </p>
          </div>
          <div className="form">
            <form onSubmit={handleForget}>
              <TextField
                type="email"
                label="Email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                className="login-input"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="forget-btn"
                disabled={forget.loading}
              >
                {forget.loading ? (
                  <CircularProgress
                    size={20}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Send Code"
                )}
              </Button>
              <div className="back-login">
                <Link to={"/login"}>
                  <IoChevronBackOutline /> Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
