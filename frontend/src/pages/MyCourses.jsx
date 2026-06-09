import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import CertificateButton from "../components/CertificateButton";

const LEVEL_COLOR = { Beginner: "success", Intermediate: "warning", Advanced: "danger" };
const EMOJIS = ["🚀", "💡", "🎯", "🔬", "🎨", "💻", "🌍", "🔧", "📊", "🧠"];

function MyCourses() {
  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [enrollRes, progRes] = await Promise.all([
        api.get("/enrollments/my-courses"),
        api.get("/progress")
      ]);
      setEnrollments(enrollRes.data);
      const map = {};
      progRes.data.forEach((p) => { map[p.course?._id] = p.percentage; });
      setProgressMap(map);
    } catch (err) {
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseId, pct) => {
    try {
      await api.post("/progress", { courseId, percentage: pct });
      setProgressMap((prev) => ({ ...prev, [courseId]: pct }));
      if (pct >= 100) toast.success("🎉 Course completed! Certificate available!");
      else toast.success(`Progress updated to ${pct}%`);
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  const unenroll = async (courseId) => {
    if (!window.confirm("Unenroll from this course?")) return;
    try {
      await api.delete(`/enrollments/${courseId}`);
      toast.success("Unenrolled successfully");
      load();
    } catch {
      toast.error("Failed to unenroll");
    }
  };

  return (
    <Layout>
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">🎯 My Courses</h1>
          <p className="page-subtitle">Track your learning progress and download certificates</p>
        </div>

        {loading ? (
          <div className="grid-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No courses yet</h3>
              <p className="empty-state-text">Browse our course catalog and enroll to start learning</p>
              <a href="/courses" className="btn btn-primary">Browse Courses →</a>
            </div>
          </div>
        ) : (
          <div className="grid-2">
            {enrollments.map((item) => {
              if (!item.course) return null;
              const course = item.course;
              const pct = progressMap[course._id] ?? 0;
              const emoji = EMOJIS[course.title?.charCodeAt(0) % EMOJIS.length];
              const isComplete = pct >= 100;

              return (
                <div key={item._id} className="card slide-up" style={{ overflow: "hidden" }}>
                  {/* Header strip */}
                  <div style={{
                    height: 6,
                    background: isComplete
                      ? "linear-gradient(90deg, var(--success), #34d399)"
                      : "linear-gradient(90deg, var(--accent), #8b5cf6)"
                  }} />

                  <div className="card-body">
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: "var(--radius)",
                        background: "var(--accent-light)", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "1.6rem", flexShrink: 0
                      }}>
                        {emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem",
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                        }}>
                          {course.title}
                        </h3>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span className={`badge badge-${LEVEL_COLOR[course.level] || "primary"}`}>
                            {course.level || "General"}
                          </span>
                          {course.category && (
                            <span className="badge" style={{ background: "var(--bg-input)", color: "var(--text-muted)" }}>
                              {course.category}
                            </span>
                          )}
                          {isComplete && <span className="badge badge-success">✅ Completed</span>}
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div style={{ marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>Progress</span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: isComplete ? "var(--success)" : "var(--accent)" }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div
                          className={`progress-bar-fill ${isComplete ? "success" : ""}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    {/* Instructor */}
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                      👨‍🏫 {course.instructor?.name || "Instructor"} •
                      Enrolled {new Date(item.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {/* Progress buttons */}
                      {[25, 50, 75, 100].map((p) => (
                        <button
                          key={p}
                          className={`btn btn-sm ${pct >= p ? "btn-success" : "btn-ghost"}`}
                          onClick={() => updateProgress(course._id, p)}
                          title={`Set progress to ${p}%`}
                        >
                          {p}%
                        </button>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                      {isComplete && (
                        <CertificateButton courseId={course._id} courseName={course.title} />
                      )}

                      {/* Materials */}
                      {course.materials?.length > 0 && (
                        <div style={{ flex: 1 }}>
                          <details>
                            <summary style={{
                              cursor: "pointer", fontSize: "0.8rem",
                              color: "var(--accent)", fontWeight: 600, listStyle: "none"
                            }}>
                              📁 {course.materials.length} Material{course.materials.length !== 1 ? "s" : ""}
                            </summary>
                            <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                              {course.materials.map((m) => (
                                <a
                                  key={m.filename}
                                  href={`http://localhost:5000/uploads/${m.filename}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-ghost btn-sm"
                                  style={{ justifyContent: "flex-start" }}
                                >
                                  📄 {m.originalName}
                                </a>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ color: "var(--danger)", borderColor: "var(--danger-light)" }}
                        onClick={() => unenroll(course._id)}
                      >
                        Unenroll
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MyCourses;
