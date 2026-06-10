const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads directory:", uploadDir);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .slice(0, 40);
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

const ALLOWED_EXTENSIONS = /\.(pdf|doc|docx|ppt|pptx|mp4|mov|avi|jpg|jpeg|png|gif|txt|zip)$/i;

const fileFilter = (_req, file, cb) => {
  if (ALLOWED_EXTENSIONS.test(path.extname(file.originalname))) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "File type not supported. Allowed: PDF, DOC, DOCX, PPT, MP4, Images."
      ),
      false
    );
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});