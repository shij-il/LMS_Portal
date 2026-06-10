const Course = require("../models/Course");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file received. Please select a file to upload." });
    }
    res.json({
      success: true,
      message: "File uploaded successfully",
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("uploadFile error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
};

exports.uploadCourseMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No file received. Please select a file." });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res
        .status(400)
        .json({ message: "Please select a course to attach this material to." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only upload materials to your own courses" });
    }

    course.materials.push({
      filename: req.file.filename,
      originalName: req.file.originalname,
      uploadedAt: new Date(),
    });
    await course.save();

    res.json({
      success: true,
      message: `"${req.file.originalname}" uploaded and attached to "${course.title}" successfully`,
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("uploadCourseMaterial error:", error);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
};