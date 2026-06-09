const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Progress = require("../models/Progress");

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ message: "Course ID is required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const existing = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (existing) return res.status(400).json({ message: "Already enrolled in this course" });

    const enrollment = await Enrollment.create({
      student: req.user.id,
      course: courseId
    });

    // Create initial progress record
    await Progress.create({
      student: req.user.id,
      course: courseId,
      percentage: 0
    });

    const populated = await Enrollment.findById(enrollment._id).populate("course");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name" }
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
      course: req.params.courseId
    });
    res.json({ enrolled: !!enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unenroll = async (req, res) => {
  try {
    await Enrollment.findOneAndDelete({
      student: req.user.id,
      course: req.params.courseId
    });
    await Progress.findOneAndDelete({
      student: req.user.id,
      course: req.params.courseId
    });
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
