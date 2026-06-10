const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Instructors cannot enroll in their own courses
    if (course.instructor.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot enroll in your own course" });
    }

    const existing = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId,
    });

    // Upsert progress record at 0%
    await Progress.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { student: req.user.id, course: courseId, percentage: 0, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    const populated = await Enrollment.findById(enrollment._id).populate({
      path: "course",
      populate: { path: "instructor", select: "name" },
    });

    res.status(201).json(populated);
  } catch (error) {
    console.error("enrollCourse error:", error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email" },
      })
      .sort({ createdAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId,
    });
    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unenroll = async (req, res) => {
  try {
    const result = await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: req.params.courseId,
    });
    if (!result) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    await Progress.findOneAndDelete({
      student: req.user.id,
      course: req.params.courseId,
    });
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};