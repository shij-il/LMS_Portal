import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "../context/ThemeContext";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const { dark } = useTheme();
  const gridColor = dark ? "#2a2e3d" : "#e2e6ef";
  const textColor = dark ? "#5a6480" : "#8b95a8";

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/progress");
      setProgress(res.data);
    } catch {
      toast.error("Failed to load progress");
    } finally {
      setLoading(false);
    }
  };

  const completed = progress.filter((p) => p.percentage >= 100).length;
  const inProgress = progress.filter((p) => p.percentage > 0 && p.percentage < 100).length;
  const notStarted = progress.filter((p) => p.percentage === 0).length;
  const avgPct = progress.length
    ? Math.round(progress.reduce((s, p) => s + p.percentage, 0) / progress.length)
    : 0;

  const chartData = progress
    .filter((p) => p.course)
    .map((p) => ({
      name: p.course.title?.slice(0, 16) + (p.course.title?.length > 16 ? "…" : ""),
      progress: p.percentage
    }));

  return (
    <Layout>
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">📈 Learning Progress</h1>
          <p className="page-subtitle">Track your performance across all enrolled courses</p>
        </div>

        {/* Summary cards */}
        <div className="grid-4" style={{ marginBottom: "1.5rem" }}>
          {[
            { label: "Average Progress", value: `${avgPct}%`, icon: "📊", color: "var(--accent)", bg: "var(--accent-light)" },
            { label: "Completed", value: completed, icon: "✅", color: "var(--success)", bg: "var(--success-light)" },
            { label: "In Progress", value: inProgress, icon: "⏳", color: "var(--warning)", bg: "var(--warning-light)" },
            { label: "Not Started", value: notStarted, icon: "🔒", color: "var(--text-muted)", bg: "var(--bg-input)" }
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

        {/* Chart */}
        {chartData.length > 0 && (
          <div className="card card-body" style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>
              Progress by Course
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Progress"]}
                  contentStyle={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", fontSize: "0.8rem"
                  }}
                />
                <Bar dataKey="progress" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Course list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : progress.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-state-icon">📈</div>
              <h3 className="empty-state-title">No progress data</h3>
              <p className="empty-state-text">Enroll in courses to start tracking your learning journey</p>
              <a href="/courses" className="btn btn-primary">Browse Courses →</a>
            </div>
          </div>
        ) : (
          <div className="card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>All Courses</h3>
            </div>
            {progress.map((item, i) => {
              if (!item.course) return null;
              const pct = item.percentage;
              const isComplete = pct >= 100;
              return (
                <div key={item._id} style={{
                  padding: "1.25rem 1.5rem",
                  borderBottom: i < progress.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "background var(--transition)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "var(--radius)",
                      background: isComplete ? "var(--success-light)" : "var(--accent-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.2rem", flexShrink: 0
                    }}>
                      {isComplete ? "✅" : "📘"}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>
                          {item.course.title}
                        </h4>
                        <span style={{
                          fontSize: "0.85rem", fontWeight: 700,
                          color: isComplete ? "var(--success)" : pct > 50 ? "var(--warning)" : "var(--accent)"
                        }}>
                          {pct}%
                        </span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div
                          className={`progress-bar-fill ${isComplete ? "success" : ""}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {item.course.category} • {item.course.level}
                        {item.lastUpdated && ` • Updated ${new Date(item.lastUpdated).toLocaleDateString()}`}
                      </div>
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

export default Progress;
