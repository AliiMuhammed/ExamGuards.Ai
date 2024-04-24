import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import "./style/otp.css";
import logo from "../../../../Assets/Images/Logos/h-logo.png";
import { useDispatch } from "react-redux";
import { openToast } from "../../../../Redux/Slices/toastSlice";

const OTP = ({ handleShowResetPass }) => {
  const dispatch = useDispatch();
  const [otp, setOTP] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length <= 4) {
      setOTP(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your OTP verification logic here
  };

  return (
    <section className="otp-section">
      <div className="container">
        <div className="otp-box">
          <div className="header">
            <div className="logo">
              <img src={logo} alt="logo" loading="lazy" />
            </div>
            <h1>OTP Verification</h1>
            <p>Please enter the OTP sent to your email</p>
          </div>
          <div className="form-otp">
            <form onSubmit={handleSubmit}>
              <TextField
                label="OTP"
                type="password"
                variant="outlined"
                fullWidth
                value={otp}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="otp-btn"
              >
                Verify OTP
              </Button>
              <div className="resend">
                <p>Didn't receive OTP code?</p>
                <button>Resend Code?</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OTP;
