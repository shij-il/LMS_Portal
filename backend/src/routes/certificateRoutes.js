const express = require("express");
const router = express.Router();
const { generateCertificate } = require("../controllers/certificateController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:courseId", authMiddleware, generateCertificate);

module.exports = router;