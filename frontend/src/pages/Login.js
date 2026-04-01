import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user?.name || "");
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h1 className="app-title">Online Examination System</h1>

      <div className="login-box">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>

        <p className="register-text">
          New user? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
