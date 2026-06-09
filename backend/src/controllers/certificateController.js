const PDFDocument = require("pdfkit");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Progress = require("../models/Progress");

exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;

    const [user, course, enrollment, progress] = await Promise.all([
      User.findById(req.user.id),
      Course.findById(courseId).populate("instructor", "name"),
      Enrollment.findOne({ student: req.user.id, course: courseId }),
      Progress.findOne({ student: req.user.id, course: courseId })
    ]);

    if (!enrollment) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    if (!progress || progress.percentage < 100) {
      return res.status(400).json({ message: "Course not completed yet. Complete 100% to get certificate." });
    }

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=certificate-${course.title.replace(/\s+/g, "-")}.pdf`
    );

    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#0f172a");

    // Gold border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(3)
      .stroke("#f59e0b");

    doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56)
      .lineWidth(1)
      .stroke("#d97706");

    // Header
    doc.fillColor("#f59e0b").fontSize(14).text("✦ LMS PORTAL ✦", 0, 60, { align: "center" });

    doc.fillColor("#ffffff").fontSize(42)
      .font("Helvetica-Bold")
      .text("Certificate of Completion", 0, 90, { align: "center" });

    // Divider
    doc.moveTo(100, 150).lineTo(doc.page.width - 100, 150).stroke("#f59e0b");

    doc.fillColor("#9ca3af").fontSize(14)
      .font("Helvetica")
      .text("This is to certify that", 0, 170, { align: "center" });

    // Student Name
    doc.fillColor("#f59e0b").fontSize(36)
      .font("Helvetica-BoldOblique")
      .text(user.name, 0, 200, { align: "center" });

    doc.fillColor("#9ca3af").fontSize(14)
      .font("Helvetica")
      .text("has successfully completed the course", 0, 250, { align: "center" });

    // Course Title
    doc.fillColor("#ffffff").fontSize(26)
      .font("Helvetica-Bold")
      .text(course.title, 0, 280, { align: "center" });

    // Instructor
    doc.fillColor("#9ca3af").fontSize(12)
      .font("Helvetica")
      .text(`Instructor: ${course.instructor?.name || "LMS Portal"}`, 0, 320, { align: "center" });

    // Date
    const completionDate = enrollment.completedAt
      ? new Date(enrollment.completedAt).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric"
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric"
        });

    doc.fillColor("#6b7280").fontSize(12)
      .text(`Completed on: ${completionDate}`, 0, 345, { align: "center" });

    // Divider
    doc.moveTo(100, 370).lineTo(doc.page.width - 100, 370).stroke("#f59e0b");

    // Footer
    doc.fillColor("#4b5563").fontSize(10)
      .text("LMS Portal — Empowering Learning, One Course at a Time", 0, 385, { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
