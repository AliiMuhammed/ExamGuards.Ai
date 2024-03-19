import React, { useState } from "react";
import { setAuthUser } from "../../Helper/Storage";
import { useNavigate } from "react-router";
import http from "../../Helper/http";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
    http
      .POST(`users/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        setAuthUser(res);

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <form action="">
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="main-btn login-btn" onClick={handleLogin}>
          "Login"
        </button>
      </form>
    </div>
  );
};

export default Login;
