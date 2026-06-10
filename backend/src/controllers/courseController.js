const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");

// Create a course (instructor only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, level, duration } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }
    const course = await Course.create({
      title: title.trim(),
      description: description.trim(),
      category: category || "General",
      level: level || "Beginner",
      duration: duration || "Self-paced",
      instructor: req.user.id,
      isPublished: true,
    });
    const populated = await Course.findById(course._id).populate(
      "instructor",
      "name email"
    );
    res.status(201).json(populated);
  } catch (error) {
    console.error("createCourse error:", error);
    res.status(500).json({ message: error.message });
  }
};

// FIXED: Get ALL courses — NO isPublished filter so every user sees every course
exports.getCourses = async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const filter = {}; // No isPublished filter — show ALL courses to everyone

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
        { category: { $regex: search.trim(), $options: "i" } },
      ];
    }
    if (category && category !== "All") filter.category = category;
    if (level && level !== "All") filter.level = level;

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (error) {
    console.error("getCourses error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email bio"
    );
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update course (own courses only)
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this course" });
    }
    const { title, description, category, level, duration } = req.body;
    const updateData = {};
    if (title) updateData.title = title.trim();
    if (description) updateData.description = description.trim();
    if (category) updateData.category = category;
    if (level) updateData.level = level;
    if (duration) updateData.duration = duration;

    const updated = await Course.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("instructor", "name email");
    res.json(updated);
  } catch (error) {
    console.error("updateCourse error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this course" });
    }
    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course: req.params.id });
    await Progress.deleteMany({ course: req.params.id });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("deleteCourse error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Instructor's own courses
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error("getInstructorCourses error:", error);
    res.status(500).json({ message: error.message });
  }
};