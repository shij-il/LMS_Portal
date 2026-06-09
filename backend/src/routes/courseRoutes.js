const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses
} = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", getCourses);
router.get("/my-courses", authMiddleware, roleMiddleware("instructor"), getInstructorCourses);
router.get("/:id", getCourseById);
router.post("/", authMiddleware, roleMiddleware("instructor"), createCourse);
router.put("/:id", authMiddleware, roleMiddleware("instructor"), updateCourse);
router.delete("/:id", authMiddleware, roleMiddleware("instructor"), deleteCourse);

module.exports = router;
