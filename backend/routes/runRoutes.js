const router = require("express").Router();
const {
  getRunHistory,
  getRunById,
  startNewRun,
  pauseRun,
  resumeRun,
  endRun,
} = require("../controllers/runController");
const protect = require("../middleware/authMiddleware");

router.get("/history", protect, getRunHistory);
router.post("/start", protect, startNewRun);
router.get("/:id", protect, getRunById);
router.patch("/:id/pause", protect, pauseRun);
router.patch("/:id/resume", protect, resumeRun);
router.patch("/:id/end", protect, endRun);
module.exports = router;
