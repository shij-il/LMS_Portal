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
      Progress.findOne({ student: req.user.id, course: courseId }),
    ]);

    if (!enrollment) {
      return res.status(403).json({ message: "You are not enrolled in this course" });
    }
    if (!progress || progress.percentage < 100) {
      return res.status(400).json({
        message: "Course not completed yet. Reach 100% progress to unlock your certificate.",
      });
    }

    const doc = new PDFDocument({ size: "A4", layout: "landscape", margins: { top: 50, bottom: 50, left: 50, right: 50 } });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="certificate-${course.title.replace(/\s+/g, "-")}.pdf"`);
    doc.pipe(res);

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#0f172a");

    // Gold borders
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(3).stroke("#f59e0b");
    doc.rect(28, 28, doc.page.width - 56, doc.page.height - 56).lineWidth(1).stroke("#d97706");

    // Header
    doc.fillColor("#f59e0b").fontSize(13).font("Helvetica-Bold")
      .text("✦  LMS PORTAL  ✦", 0, 62, { align: "center" });

    doc.fillColor("#ffffff").fontSize(40).font("Helvetica-Bold")
      .text("Certificate of Completion", 0, 90, { align: "center" });

    // Top divider
    doc.moveTo(100, 148).lineTo(doc.page.width - 100, 148).lineWidth(1).stroke("#f59e0b");

    // Body
    doc.fillColor("#94a3b8").fontSize(14).font("Helvetica")
      .text("This is to certify that", 0, 168, { align: "center" });

    doc.fillColor("#f59e0b").fontSize(34).font("Helvetica-BoldOblique")
      .text(user.name, 0, 196, { align: "center" });

    doc.fillColor("#94a3b8").fontSize(14).font("Helvetica")
      .text("has successfully completed the course", 0, 244, { align: "center" });

    doc.fillColor("#ffffff").fontSize(24).font("Helvetica-Bold")
      .text(course.title, 0, 272, { align: "center" });

    doc.fillColor("#94a3b8").fontSize(12).font("Helvetica")
      .text(`Instructor: ${course.instructor?.name || "LMS Portal"}`, 0, 314, { align: "center" });

    const completionDate = (enrollment.completedAt || new Date()).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });
    doc.fillColor("#64748b").fontSize(12)
      .text(`Date of Completion: ${completionDate}`, 0, 338, { align: "center" });

    // Bottom divider
    doc.moveTo(100, 362).lineTo(doc.page.width - 100, 362).stroke("#f59e0b");

    doc.fillColor("#475569").fontSize(10)
      .text("LMS Portal — Empowering Learning, One Course at a Time", 0, 378, { align: "center" });

    doc.end();
  } catch (error) {
    console.error("generateCertificate error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: error.message });
    }
  }
};