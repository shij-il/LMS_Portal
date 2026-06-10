const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://lms-portal-bice-rho.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/certificate", certificateRoutes);

app.get("/", (_req, res) =>
  res.json({ message: "LMS Portal API Running ✅", version: "2.0" })
);

// 404
app.use((req, res) =>
  res
    .status(404)
    .json({ message: `Route ${req.method} ${req.url} not found` })
);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Global error:", err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running → http://localhost:${PORT}`);
  console.log(`📁 Uploads → http://localhost:${PORT}/uploads`);
});