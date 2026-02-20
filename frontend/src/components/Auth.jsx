import { useState } from "react";

const API = "https://job-tracker-production-e46b.up.railway.app";

function Auth({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    alert("Registered successfully");
    setError("");
  };

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login / Register</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <div>
          <button className="success" onClick={register}>Register</button>
          <button className="primary" onClick={login}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default Auth;
