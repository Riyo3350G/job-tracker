const pool = require("../config/db");

const createJob = async (title, company, status, notes, user_id) => {
  const result = await pool.query(
    "INSERT INTO jobs (title, company, status, notes, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, company, status, notes, user_id],
  );
  return result.rows[0];
};

const getJobsByUserId = async (
  user_id,
  status,
  search,
  sort,
  limit,
  offset,
) => {
  let query = "SELECT * FROM jobs WHERE user_id = $1";
  let values = [user_id];
  let index = 2;

  if (status) {
    query += ` AND status = $${index++}`;
    values.push(status);
  }

  if (search) {
    query += ` AND (LOWER(title) LIKE $${index} OR LOWER(company) LIKE $${index})`;
    values.push(`%${search.toLowerCase()}%`);
    index++;
  }

  query += " ORDER BY ";

  if (sort === "company") {
    query += "company ASC";
  } else {
    query += "created_at DESC";
  }

  query += ` LIMIT $${index++}`;
  values.push(limit);

  query += ` OFFSET $${index}`;
  values.push(offset);

  const result = await pool.query(query, values);
  return result.rows;
};

const getJobStats = async (user_id) => {
  const result = await pool.query(
    `SELECT 
      COUNT(*) FILTER (WHERE status = 'Applied') AS applied,
      COUNT(*) FILTER (WHERE status = 'Interview') AS interview,
      COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected
     FROM jobs WHERE user_id = $1`,
    [user_id],
  );
  return result.rows[0];
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
  getJobStats,
};
