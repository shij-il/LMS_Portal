import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

const CATEGORIES = ["General", "Programming", "Design", "Business", "Science", "Mathematics", "Language", "Other"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

function CourseModal({ isOpen, onClose, course, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    level: "Beginner",
    duration: "Self-paced"
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "General",
        level: course.level || "Beginner",
        duration: course.duration || "Self-paced"
      });
    } else {
      setForm({ title: "", description: "", category: "General", level: "Beginner", duration: "Self-paced" });
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setLoading(true);
    try {
      if (course) {
        await api.put(`/courses/${course._id}`, form);
        toast.success("Course updated successfully!");
      } else {
        await api.post("/courses", form);
        toast.success("Course created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3 className="modal-title">{course ? "✏️ Edit Course" : "➕ Create Course"}</h3>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Course Title *</label>
              <input
                className="form-control"
                placeholder="e.g. Introduction to Python"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                className="form-control"
                placeholder="Describe what students will learn..."
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control form-select"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Level</label>
                <select
                  className="form-control form-select"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                >
                  {LEVELS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Duration</label>
              <input
                className="form-control"
                placeholder="e.g. 4 weeks, 10 hours, Self-paced"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseModal;
