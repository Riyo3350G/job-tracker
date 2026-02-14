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

const updateJob = async (id, title, company, status, notes, user_id) => {
  const result = await pool.query(
    "UPDATE jobs SET title = $1, company = $2, status = $3, notes = $4 WHERE id = $5 AND user_id = $6 RETURNING *",
    [title, company, status, notes, id, user_id],
  );
  return result.rows[0];
};

const deleteJob = async (id, user_id) => {
  const result = await pool.query(
    "DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, user_id],
  );
  return result.rows[0];
};

module.exports = {
  createJob,
  getJobsByUserId,
  updateJob,
  deleteJob,
};
