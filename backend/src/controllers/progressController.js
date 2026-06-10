const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, percentage } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }
    if (percentage === undefined || percentage === null) {
      return res.status(400).json({ message: "Percentage is required" });
    }

    const pct = Math.min(100, Math.max(0, Number(percentage)));
    if (isNaN(pct)) {
      return res.status(400).json({ message: "Invalid percentage value" });
    }

    const enrolled = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    if (!enrolled) {
      return res
        .status(403)
        .json({ message: "You must be enrolled to update progress" });
    }

    const progress = await Progress.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { percentage: pct, lastUpdated: new Date() },
      { new: true, upsert: true }
    ).populate("course", "title category level");

    // Auto-mark enrollment complete at 100%
    if (pct >= 100) {
      await Enrollment.findOneAndUpdate(
        { student: req.user.id, course: courseId },
        { completedAt: new Date() }
      );
    }

    res.json(progress);
  } catch (error) {
    console.error("updateProgress error:", error);
    res.status(500).json({ message: error.message });
  }
};

// My progress (student view)
exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user.id })
      .populate("course", "title description category level instructor")
      .sort({ lastUpdated: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Single course progress
exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId,
    });
    res.json(progress || { percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};