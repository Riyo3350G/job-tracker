function JobCard({ job, onDelete, onUpdate }) {
  return (
    <div className="card">
      <h4>{job.title}</h4>
      <p>{job.company}</p>
      <p>Status: {job.status}</p>

      <button className="success" onClick={() => onUpdate(job)}>
        Change Status
      </button>

      <button className="danger" onClick={() => onDelete(job.id)}>
        Delete
      </button>
    </div>
  );
}

export default JobCard;
