import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const register = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setStatus({ type: "error", message: "Please fill in all fields." });
      return;
    }
    try {
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password
      });

      setStatus({ type: "success", message: "Registration successful. Redirecting to login..." });
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Registration failed"
      });
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Create Account</h2>

      {status.message && (
        <div className={`register-status ${status.type}`}>{status.message}</div>
      )}

      <input
        className="register-input"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="register-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="register-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="register-btn" onClick={register}>
        Register
      </button>

      <p className="register-info">
        Already signed up? <a className="register-link" href="/">Login here</a>
      </p>
    </div>
  );
}
