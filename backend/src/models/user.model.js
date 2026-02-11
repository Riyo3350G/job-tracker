const pool = require("../config/db");

const createUser = async (email, password) => {
  const query = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
  const values = [email, password];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const values = [email];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
};

