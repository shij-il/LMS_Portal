const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");

// Global platform stats
exports.getStats = async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalInstructors, totalEnrollments] =
      await Promise.all([
        Course.countDocuments(),
        User.countDocuments({ role: "student" }),
        User.countDocuments({ role: "instructor" }),
        Enrollment.countDocuments(),
      ]);

    // Monthly enrollment trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const chartData = monthlyEnrollments.map((item) => ({
      name: months[item._id.month - 1],
      enrollments: item.count,
    }));

    res.json({
      totalCourses,
      totalStudents,
      totalInstructors,
      totalEnrollments,
      chartData,
    });
  } catch (error) {
    console.error("getStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Instructor's own stats
exports.getInstructorStats = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id });
    const courseIds = myCourses.map((c) => c._id);

    const [myEnrollments, distinctStudents] = await Promise.all([
      Enrollment.countDocuments({ course: { $in: courseIds } }),
      Enrollment.distinct("student", { course: { $in: courseIds } }),
    ]);

    res.json({
      totalMyCourses: myCourses.length,
      totalMyEnrollments: myEnrollments,
      totalMyStudents: distinctStudents.length,
    });
  } catch (error) {
    console.error("getInstructorStats error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ADDED: All student progress for instructor's courses — instructors can monitor students
exports.getStudentProgressForInstructor = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id }).select(
      "_id title"
    );
    const courseIds = myCourses.map((c) => c._id);

    const progressList = await Progress.find({ course: { $in: courseIds } })
      .populate("student", "name email")
      .populate("course", "title category level")
      .sort({ lastUpdated: -1 });

    res.json(progressList);
  } catch (error) {
    console.error("getStudentProgressForInstructor error:", error);
    res.status(500).json({ message: error.message });
  }
};