const { createJob, getJobsByUserId } = require("../models/job.model");

const addJob = async (req, res) => {
  try {
    const { title, company, status, notes } = req.body;

    if (!title || !company) {
      return res
        .status(400)
        .json({ message: "Title and company are required" });
    }

    const newJob = await createJob(
      title,
      company,
      status || "Applied",
      notes || "",
      req.user.id,
    );
    res.status(201).json(newJob);
  } catch (error) {
    console.error("Error adding job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await getJobsByUserId(req.user.id);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addJob,
  getAllJobs,
};
