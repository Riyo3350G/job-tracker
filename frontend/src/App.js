import { useState, useEffect } from "react";
import "./App.css";

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

  const deleteJob = async (id) => {
    await fetch(`${API}/jobs/delete_job/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
  };

  const updateStatus = async (job) => {
    const newStatus =
      job.status === "Applied"
        ? "Interviewing"
        : job.status === "Interviewing"
          ? "Rejected"
          : "Applied";

    await fetch(`${API}/jobs/update_job/${job.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: job.title,
        company: job.company,
        status: newStatus,
        notes: job.notes || "",
      }),
    });
    fetchJobs();
  };

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          <h2>Login / Register</h2>

          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div>
            <button className="success" onClick={register}>
              Register
            </button>
            <button className="primary" onClick={login}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Job Tracker Dashboard</h2>

      <div className="card">
        <input
          placeholder="Job Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Company"
          onChange={(e) => setCompany(e.target.value)}
        />
        <button className="primary" onClick={addJob}>
          Add Job
        </button>
      </div>

      {jobs.map((job) => (
        <div key={job.id} className="card">
          <h4>{job.title}</h4>
          <p>{job.company}</p>
          <p>Status: {job.status}</p>

          <button className="success" onClick={() => updateStatus(job)}>
            Change Status
          </button>

          <button className="danger" onClick={() => deleteJob(job.id)}>
            Delete
          </button>
        </div>
      ))}

      <button
        className="danger"
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
