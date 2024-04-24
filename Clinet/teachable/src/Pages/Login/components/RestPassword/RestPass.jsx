import React, { useState } from "react";
import "./style/restPass.css";
import { TextField, Button } from "@mui/material";
import logo from "../../../../Assets/Images/Logos/h-logo.png";

const RestPass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your OTP verification logic here
  };
  return (
    <section className="reset-section">
      <div className="container">
        <div className="reset-box">
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
                className="reset-password-input"
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                fullWidth
                type="password"
                value={confirmPassword}
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
