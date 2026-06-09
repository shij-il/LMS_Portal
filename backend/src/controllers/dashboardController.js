const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");

exports.getStats = async (req, res) => {
  try {
    const [totalCourses, totalStudents, totalInstructors, totalEnrollments] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "instructor" }),
      Enrollment.countDocuments()
    ]);

    // Monthly enrollment data for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const chartData = monthlyEnrollments.map((item) => ({
      name: months[item._id.month - 1],
      enrollments: item.count
    }));

    res.json({
      totalCourses,
      totalStudents,
      totalInstructors,
      totalEnrollments,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstructorStats = async (req, res) => {
  try {
    const myCourses = await Course.find({ instructor: req.user.id });
    const courseIds = myCourses.map((c) => c._id);

    const [myEnrollments, myStudents] = await Promise.all([
      Enrollment.countDocuments({ course: { $in: courseIds } }),
      Enrollment.distinct("student", { course: { $in: courseIds } })
    ]);

    res.json({
      totalMyCourses: myCourses.length,
      totalMyEnrollments: myEnrollments,
      totalMyStudents: myStudents.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
