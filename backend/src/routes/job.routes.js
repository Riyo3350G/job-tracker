const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  addJob,
  getAllJobs,
  update,
  remove,
  stats,
} = require("../controllers/job.controller");

router.use(authMiddleware);

router.post("/create_job", addJob);
router.get("/get_jobs", getAllJobs);
router.put("/update_job/:id", update);
router.delete("/delete_job/:id", remove);
router.get("/stats", stats);

module.exports = router;
