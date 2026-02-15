import { useState, useEffect } from "react";

const API = "http://localhost:5000";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token]);

  const register = async () => {
    await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    alert("Registered successfully");
  };

  const login = async () => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const fetchJobs = async () => {
    const res = await fetch(`${API}/jobs/get_jobs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setJobs(data.results);
  };

  const addJob = async () => {
    await fetch(`${API}/jobs/create_job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, company }),
    });
    fetchJobs();
  };

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login / Register</h2>
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={register}>Register</button>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Job Tracker Dashboard</h2>

      <input
        placeholder="Job Title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Company"
        onChange={(e) => setCompany(e.target.value)}
      />
      <button onClick={addJob}>Add Job</button>

      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            {job.title} - {job.company} ({job.status})
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default App;
