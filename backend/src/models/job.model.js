const pool = require("../config/db");

const createJob = async (title, company, status, notes, user_id) => {
  const result = await pool.query(
    "INSERT INTO jobs (title, company, status, notes, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [title, company, status, notes, user_id],
  );
  return result.rows[0];
};

const getJobsByUserId = async (user_id, status, limit, offset) => {
  let query = "SELECT * FROM jobs WHERE user_id = $1";
  const params = [user_id];

  let nextPlaceholder = 2; // keeps track of next $n

  // Status filter — only if meaningful value is provided
  if (status && typeof status === "string" && status.trim() !== "") {
    query += ` AND status = $${nextPlaceholder}`;
    params.push(status.trim());
    nextPlaceholder++;
  }

  query += " ORDER BY created_at DESC";

  // LIMIT — only if it's a valid positive number
  if (typeof limit === "number" && limit > 0 && Number.isInteger(limit)) {
    query += ` LIMIT $${nextPlaceholder}`;
    params.push(limit);
    nextPlaceholder++;
  }

  // OFFSET — only if it's a valid non-negative integer
  if (typeof offset === "number" && offset >= 0 && Number.isInteger(offset)) {
    query += ` OFFSET $${nextPlaceholder}`;
    params.push(offset);
    nextPlaceholder++;
  }

  console.log("→ Executing query:", query);
  console.log("→ With params:", params);

  try {
    const result = await pool.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("Database query failed:", {
      query,
      params,
      error: err.message,
      code: err.code,
    });
    throw err;
  }
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
