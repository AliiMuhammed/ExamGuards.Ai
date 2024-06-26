import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { setAuthUser } from "../../Helper/Storage";
import { useNavigate } from "react-router";
import http from "../../Helper/http";
import "./style/login.css";
import logo from "../../Assets/Images/Logos/exam white-01.png";
import loginImg from "../../Assets/Images/Login/login-img.png";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State to store the "Remember Me" checkbox value
  const [login, setLogin] = useState({
    loading: false, //
    errorMsg: "",
  });
  const navigate = useNavigate();

  const handleLogin = (e) => {
    setLogin({ ...login, loading: true, errorMsg: "" });
    e.preventDefault();
    if (email === "" || password === "") {
      setLogin({
        ...login,
        loading: false,
        errorMsg: "You must enter email and password",
      });
      return;
    }
    http
      .POST(`users/login`, {
        email: email,
        password: password,
        // rememberMe: rememberMe,
      })
      .then((res) => {
        setAuthUser(res, rememberMe);
        const role = res.data.data.user.role;
        if (role === "admin" || role === "super admin") {
          navigate("/admin/home");
        } else if (role === "student") {
          navigate("/student/home");
        } else navigate("/instructor/home");
        setLogin({ ...login, loading: false, errorMsg: "" });
      })
      .catch((err) => {
        setLogin({
          ...login,
          loading: false,
          errorMsg:
            err?.response?.data?.message || "Email or password is incorrect",
        });
      });
  };

  return (
    <section className="login">
      <div className="container">
        <div className="login-form">
          {login.errorMsg !== "" && (
            <Alert sx={{ width: "100%" }} severity="error">
              {login.errorMsg}
            </Alert>
          )}
          <h1>welcome back</h1>
          <span>welcome back with your account</span>
          <form onSubmit={handleLogin}>
            <TextField
              type="email"
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="login-input"
            />
            <TextField
              type="password"
              label="Password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="login-input"
            />
            <div className="forget-remmber">
              <div className="remmber">
                <input
                  type="checkbox"
                  id="remmber"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label htmlFor="remmber">Remember me</label>
              </div>
              <div className="forget">
                <Link to={"/forgetPassword"}>Forget Password?</Link>
              </div>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="login-btn"
              disabled={login.loading}
            >
              {login.loading ? (
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
                "Login"
              )}
            </Button>
            <div className="new-account">
              <span>Don't have an account?</span>
              <Link to={"/register"}>Create new account</Link>
            </div>
          </form>
        </div>
        <div className="img-logo">
          <div className="logo">
            <img src={logo} alt="logo" loading="lazy" />
          </div>
          <div className="img-ai">
            <img src={loginImg} alt="ai-img" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
