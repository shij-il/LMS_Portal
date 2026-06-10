const express = require("express");
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getInstructorCourses,
} = require("../controllers/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public — everyone (students, instructors, guests) can list all courses
router.get("/", getCourses);

// CRITICAL: /my-courses MUST be declared BEFORE /:id
// Otherwise Express treats "my-courses" as an id param
router.get(
  "/my-courses",
  authMiddleware,
  roleMiddleware("instructor"),
  getInstructorCourses
);

// Single course — public
router.get("/:id", getCourseById);

// Instructor CRUD
router.post("/", authMiddleware, roleMiddleware("instructor"), createCourse);
router.put("/:id", authMiddleware, roleMiddleware("instructor"), updateCourse);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("instructor"),
  deleteCourse
);

module.exports = router;