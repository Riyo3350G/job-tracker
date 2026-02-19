function StatsCard({ stats }) {
  return (
    <div className="card">
      <h4>Statistics</h4>
      <p>Applied: {stats.applied || 0}</p>
      <p>Interview: {stats.interview || 0}</p>
      <p>Rejected: {stats.rejected || 0}</p>
    </div>
  );
}

export default StatsCard;
