import React, { useState } from "react";
import "./style/register.css";
import logo from "../../Assets/Images/Logos/exam white-01.png";
import registerImg from "../../Assets/Images/Register/register-img.png";
import { TextField, Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
import http from "./../../Helper/http";
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/Slices/toastSlice";
import CircularProgress from "@mui/material/CircularProgress";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    photo: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    passwordConfirm: false,
    photo: false,
  });
  const [register, setRegister] = useState({
    loading: false,
    errorMsg: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setError({
      ...error,
      [name]: false,
    });

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(value);
      setError((prevError) => ({ ...prevError, email: !isValidEmail }));
    }

    if (name === "phone") {
      const phoneRegex = /^\d{11}$/;
      const isValidPhone = phoneRegex.test(value);
      setError((prevError) => ({ ...prevError, phone: !isValidPhone }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let hasError = false;
    const newErrorState = { ...error };

    if (!formData.firstName.trim()) {
      newErrorState.firstName = true;
      hasError = true;
    }

    if (!formData.lastName.trim()) {
      newErrorState.lastName = true;
      hasError = true;
    }

    if (!formData.email.trim() || error.email) {
      newErrorState.email = true;
      hasError = true;
    }

    if (!formData.phone.trim() || error.phone) {
      newErrorState.phone = true;
      hasError = true;
    }

    if (!formData.password.trim() || formData.password.length < 8) {
      newErrorState.password = true;
      hasError = true;
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrorState.passwordConfirm = true;
      hasError = true;
    }

    if (!formData.photo) {
      newErrorState.photo = true;
      hasError = true;
    }

    if (hasError) {
      setError(newErrorState);
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    setRegister({ ...register, loading: true, errorMsg: "" });

    http
      .POST("users/signup", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        setRegister({ ...register, loading: false, errorMsg: "" });
        dispatch(
          openToast({
            msg: "Account created successfully",
            type: "success",
          })
        );
        navigate("/login");
      })
      .catch((err) => {
        setRegister({
          ...register,
          loading: false,
          errorMsg: err?.response?.data?.message || "Something went wrong",
        });
        dispatch(
          openToast({
            msg: "Something went wrong",
            type: "error",
          })
        );
      });

    console.log("Form submitted:", formData);
  };

  return (
    <section className="register-section">
      <div className="container">
        <div className="register-form">
          {register.errorMsg !== "" && (
            <Alert sx={{ width: "100%" }} severity="error">
              {register.errorMsg}
            </Alert>
          )}
          <h1>Create New Account</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={error.firstName}
              helperText={error.firstName ? "First Name is required" : ""}
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={error.lastName}
              helperText={error.lastName ? "Last Name is required" : ""}
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={error.email}
              helperText={error.email ? "Invalid email address" : ""}
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={error.phone}
              helperText={error.phone ? "Invalid phone number (11 digits)" : ""}
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              error={error.password}
              helperText={
                error.password
                  ? "Password must be at least 8 characters long"
                  : ""
              }
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              name="passwordConfirm"
              type={showPassword ? "text" : "password"}
              value={formData.passwordConfirm}
              onChange={handleChange}
              error={error.passwordConfirm}
              helperText={error.passwordConfirm ? "Passwords do not match" : ""}
              fullWidth
              variant="outlined"
              className="register-input"
              margin="normal"
            />
            <input
              type="file"
              name="photo"
              onChange={handleChange}
              accept="image/*"
              className={error.photo ? "error" : ""}
              style={{ display: 'block', margin: '20px 0' }}
            />
            {error.photo && <p className="error-text">Photo is required</p>}
            <div className="show-pass-login">
              <div className="show-pass">
                <input
                  type="checkbox"
                  id="show"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="show">Show Password</label>
              </div>
              <div className="have-account">
                Already have an account? <Link to={"/login"}>Login here</Link>
              </div>
            </div>
            <Button
              className="register-btn"
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={register.loading}
            >
              {register.loading ? (
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
                "Register"
              )}
            </Button>
          </form>
        </div>
        <div className="img-logo">
          <div className="logo">
            <img src={logo} alt="logo" loading="lazy" />
          </div>
          <div className="img-ai">
            <img src={registerImg} alt="ai-img" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
