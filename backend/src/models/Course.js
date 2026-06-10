const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, default: "General" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    thumbnail: { type: String, default: "" },
    materials: [
      {
        filename: String,
        originalName: String,
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    duration: { type: String, default: "Self-paced" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);