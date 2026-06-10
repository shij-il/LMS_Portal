const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrollments,
  checkEnrollment,
  unenroll,
} = require("../controllers/enrollmentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, enrollCourse);
router.get("/my-courses", authMiddleware, getMyEnrollments);
router.get("/check/:courseId", authMiddleware, checkEnrollment);
router.delete("/:courseId", authMiddleware, unenroll);

module.exports = router;