const { Pool } = require("pg");
require("dotenv").config();

if (process.env.DATABASE_URL) {
  // For production render
  let pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  // For local development
  let pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

pool.on("connect", () => {
  console.log("Connected to the database");
});

module.exports = pool;
