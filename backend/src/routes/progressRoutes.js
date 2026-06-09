const express = require("express");
const router = express.Router();
const {
  updateProgress,
  getMyProgress,
  getCourseProgress
} = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, updateProgress);
router.get("/", authMiddleware, getMyProgress);
router.get("/:courseId", authMiddleware, getCourseProgress);

module.exports = router;
