import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import CourseCard from "../components/CourseCard";
import CourseModal from "../components/CourseModal";

function InstructorPanel() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [coursesRes, statsRes] = await Promise.all([
        api.get("/courses/my-courses"),
        api.get("/dashboard/instructor-stats").catch(() => ({ data: {} }))
      ]);
      setCourses(coursesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditCourse(null);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 className="page-title">🛠 Instructor Panel</h1>
            <p className="page-subtitle">Manage your courses and track student engagement</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreate}>
            ➕ Create Course
          </button>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          {[
            { label: "My Courses", value: stats.totalMyCourses ?? courses.length, icon: "📚", color: "var(--accent)", bg: "var(--accent-light)" },
            { label: "Total Enrollments", value: stats.totalMyEnrollments ?? "—", icon: "🎓", color: "var(--success)", bg: "var(--success-light)" },
            { label: "Total Students", value: stats.totalMyStudents ?? "—", icon: "👥", color: "var(--warning)", bg: "var(--warning-light)" }
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{ background: s.bg }}>
                <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
              </div>
              <div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Courses */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your Courses</h2>
          <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{courses.length} course{courses.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="grid-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 320, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No courses yet</h3>
              <p className="empty-state-text">Create your first course to get started</p>
              <button className="btn btn-primary" onClick={handleCreate}>➕ Create First Course</button>
            </div>
          </div>
        ) : (
          <div className="grid-3">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                showActions
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CourseModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditCourse(null); }}
        course={editCourse}
        onSuccess={loadAll}
      />
    </Layout>
  );
}

export default InstructorPanel;
