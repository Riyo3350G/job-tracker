import { useState } from "react";

function JobForm({ onAdd, error }) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = () => {
    onAdd(title, company);
    setTitle("");
    setCompany("");
  };

  return (
    <div className="card">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <button className="primary" onClick={handleSubmit}>
        Add Job
      </button>
    </div>
  );
}

export default JobForm;
