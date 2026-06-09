const express = require("express");
const router = express.Router();
const { uploadFile, uploadCourseMaterial } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authMiddleware, upload.single("file"), uploadFile);
router.post("/material", authMiddleware, upload.single("file"), uploadCourseMaterial);

module.exports = router;
