const express = require("express");
const router = express.Router();
const { getStats, getInstructorStats } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/stats", authMiddleware, getStats);
router.get("/instructor-stats", authMiddleware, getInstructorStats);

module.exports = router;
