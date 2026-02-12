const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { addJob, getAllJobs } = require("../controllers/job.controller");

router.use(authMiddleware);

router.post("/create_job", addJob);
router.get("/get_jobs", getAllJobs);

module.exports = router;
