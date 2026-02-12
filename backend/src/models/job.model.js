const pool = require("../config/db");

const createJob = async (title, company, status, notes, user_id) => {
  const result = await pool.query(
    "INSERT INTO jobs (title, company, status, notes, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, company, status, notes, user_id],
  );
  return result.rows[0];
};

const getJobsByUserId = async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM jobs WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id],
  );
  return result.rows;
};

module.exports = {
  createJob,
  getJobsByUserId,
};
