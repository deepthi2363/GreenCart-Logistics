import React, { useState, useContext } from "react";
import { loginUser } from "../../api/api"; // your API helper
import { AuthContext } from "../../context/AuthContext";
import './Login.css';


const Login = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser({ username, password });
      login(res.data.token, { username: res.data.username, role: res.data.role });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Manager Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 10 }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" style={{ width: "100%" }}>Login</button>
    </form>
  );
};

export default Login;
