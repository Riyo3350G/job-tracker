const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();

const pool = require("./config/db");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Job Tracker API is running!" });
});

app.use("/auth", authRoutes);

module.exports = app;
