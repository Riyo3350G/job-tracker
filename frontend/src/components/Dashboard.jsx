import { useState, useEffect } from "react";
// import StatsCard from "./StatsCard";
import JobCard from "./JobCard";
import JobForm from "./JobForm";
import StatsChart from "./StatsChart";

const API = "https://job-tracker-production-e46b.up.railway.app";

function Dashboard({ token, logout }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch(`${API}/jobs/get_jobs?search=${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }

    setJobs(data.results || []);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API}/jobs/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setStats(data);
  };

  const addJob = async (title, company) => {
    const res = await fetch(`${API}/jobs/create_job`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, company }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setError("");
    fetchJobs();
    fetchStats();
  };

  const deleteJob = async (id) => {
    await fetch(`${API}/jobs/delete_job/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchJobs();
    fetchStats();
  };

  const updateStatus = async (job) => {
  const newStatus =
    job.status === "Applied"
      ? "Interview"
      : job.status === "Interview"
      ? "Rejected"
      : "Applied";

  const res = await fetch(`${API}/jobs/update_job/${job.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: job.title || "",          // ← ensure sent (required!)
      company: job.company || "",      // ← ensure sent (required!)
      status: newStatus,
      notes: job.notes || "",
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("Update failed:", err);
    setError(err.message || "Failed to update status");
    return;
  }

  fetchJobs();
  fetchStats();
};

  return (
    <div className="container">
    <div className="sidebar">
      <h2>Job Tracker</h2>
      <p>Welcome 👋</p>
      <button onClick={logout}>Logout</button>
    </div>

    <div className="main">
      <h2>Dashboard</h2>

      {/* Stats */}
      <StatsChart stats={stats} />

      {/* <div className="card">
        <h4>Statistics</h4>
        <div className="stats-grid">
          <div className="stat-box">
            <h3>{stats.applied || 0}</h3>
            <p>Applied</p>
          </div>
          <div className="stat-box">
            <h3>{stats.interview || 0}</h3>
            <p>Interview</p>
          </div>
          <div className="stat-box">
            <h3>{stats.rejected || 0}</h3>
            <p>Rejected</p>
          </div>
        </div>
      </div> */}

      {/* Search */}
      <div className="card">
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="primary" onClick={fetchJobs}>
          Search
        </button>
      </div>

      {/* Add Job */}
      <JobForm onAdd={addJob} error={error} />

      {/* Jobs */}
      {jobs.map((job) => (
        <div key={job.id} className="card">
          <h4>{job.title}</h4>
          <p>{job.company}</p>

          <span className={`status ${job.status}`}>
            {job.status}
          </span>

          <div style={{ marginTop: "10px" }}>
            <button
              className="success"
              onClick={() => updateStatus(job)}
            >
              Change Status
            </button>

            <button
              className="danger"
              onClick={() => deleteJob(job.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default Dashboard;
