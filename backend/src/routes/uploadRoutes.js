const express = require("express");
const router = express.Router();
const {
  uploadFile,
  uploadCourseMaterial,
} = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Multer error wrapper — converts multer errors to proper JSON responses
const handleUpload = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File too large. Maximum size is 50MB." });
      }
      return res
        .status(400)
        .json({ message: err.message || "File upload error" });
    }
    next();
  });
};

// Generic upload (any authenticated user)
router.post("/", authMiddleware, handleUpload("file"), uploadFile);

// Upload material and attach to a course (instructors only)
router.post(
  "/material",
  authMiddleware,
  roleMiddleware("instructor"),
  handleUpload("file"),
  uploadCourseMaterial
);

module.exports = router;