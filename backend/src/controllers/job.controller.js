const {
  createJob,
  getJobsByUserId,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../models/job.model");
const jobSchema = require("../validation/job.validation");

const addJob = async (req, res) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

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
    const { status, search, sort, page = 1, limit = 5 } = req.query;

    const offset = (page - 1) * limit;

    const jobs = await getJobsByUserId(
      req.user.id,
      status,
      search,
      sort,
      parseInt(limit),
      parseInt(offset),
    );

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      results: jobs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const stats = async (req, res) => {
  try {
    const data = await getJobStats(req.user.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
  const { error } = jobSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const { id } = req.params;
    const { title, company, status, notes } = req.body;
    // Validation
    if (!title || !company) {
      return res
        .status(400)
        .json({ message: "Title and company are required" });
    }

    const updatedJob = await updateJob(
      id,
      title,
      company,
      status || "Applied",
      notes || "",
      req.user.id,
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await deleteJob(id, req.user.id);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addJob,
  getAllJobs,
  update,
  remove,
  stats,
};
