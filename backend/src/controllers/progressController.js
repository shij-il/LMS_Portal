const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");

exports.updateProgress = async (req, res) => {
  try {
    const { courseId, percentage } = req.body;

    if (!courseId || percentage === undefined) {
      return res.status(400).json({ message: "courseId and percentage are required" });
    }

    const enrolled = await Enrollment.findOne({ student: req.user.id, course: courseId });
    if (!enrolled) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    const progress = await Progress.findOneAndUpdate(
      { student: req.user.id, course: courseId },
      { percentage: Math.min(100, Math.max(0, percentage)), lastUpdated: Date.now() },
      { new: true, upsert: true }
    ).populate("course", "title");

    // Mark enrollment as completed if 100%
    if (percentage >= 100) {
      await Enrollment.findOneAndUpdate(
        { student: req.user.id, course: courseId },
        { completedAt: new Date() }
      );
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ student: req.user.id })
      .populate("course", "title description category level")
      .sort({ lastUpdated: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user.id,
      course: req.params.courseId
    });
    res.json(progress || { percentage: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
