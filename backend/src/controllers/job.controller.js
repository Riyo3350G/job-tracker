const {
  createJob,
  getJobsByUserId,
  updateJob,
  deleteJob,
} = require("../models/job.model");

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
    const { status, page = 1, limit = 5 } = req.query;

    // Convert to numbers safely
    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (
      !Number.isInteger(pageNum) ||
      pageNum <= 0 ||
      !Number.isInteger(limitNum) ||
      limitNum <= 0
    ) {
      return res.status(400).json({ message: "Invalid page or limit values" });
    }

    const offset = (pageNum - 1) * limitNum;

    const jobs = await getJobsByUserId(
      req.user.id,
      status || null, // ← this line is important
      limitNum,
      offset,
    );

    res.json({
      page: pageNum,
      limit: limitNum,
      results: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req, res) => {
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
};
