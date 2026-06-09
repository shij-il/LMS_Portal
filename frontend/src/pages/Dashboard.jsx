import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import { StatsBarChart, EnrollmentChart } from "../components/StatsChart";
import { useAuth } from "../context/AuthContext";

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: bg }}>
        <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      </div>
      <div>
        <div className="stat-value" style={{ color }}>{value ?? "—"}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const barData = [
    { name: "Courses", value: stats.totalCourses || 0 },
    { name: "Students", value: stats.totalStudents || 0 },
    { name: "Instructors", value: stats.totalInstructors || 0 },
    { name: "Enrollments", value: stats.totalEnrollments || 0 }
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            {greeting}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Here's what's happening on your platform today.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid-4" style={{ marginBottom: "2rem" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : (
          <div className="grid-4" style={{ marginBottom: "2rem" }}>
            <StatCard icon="📚" label="Total Courses" value={stats.totalCourses} color="var(--accent)" bg="var(--accent-light)" />
            <StatCard icon="🎓" label="Students" value={stats.totalStudents} color="var(--success)" bg="var(--success-light)" />
            <StatCard icon="👨‍🏫" label="Instructors" value={stats.totalInstructors} color="var(--warning)" bg="var(--warning-light)" />
            <StatCard icon="📋" label="Enrollments" value={stats.totalEnrollments} color="var(--info)" bg="var(--info-light)" />
          </div>
        )}

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
          <div className="card card-body">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.15rem" }}>Platform Overview</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>All-time statistics</p>
              </div>
              <span className="badge badge-primary">Live</span>
            </div>
            <StatsBarChart data={barData} />
          </div>

          <div className="card card-body">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.15rem" }}>Enrollment Trends</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Last 6 months</p>
              </div>
            </div>
            {stats.chartData?.length > 0
              ? <EnrollmentChart data={stats.chartData} />
              : <div className="empty-state" style={{ padding: "3rem 1rem" }}>
                  <div className="empty-state-icon" style={{ fontSize: "2.5rem" }}>📊</div>
                  <p className="empty-state-text">No enrollment data yet</p>
                </div>
            }
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card card-body">
          <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Quick Actions</h3>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/courses" className="btn btn-primary">📚 Browse Courses</Link>
            <Link to="/my-courses" className="btn btn-secondary">🎯 My Enrollments</Link>
            <Link to="/progress" className="btn btn-secondary">📈 View Progress</Link>
            {user?.role === "instructor" && (
              <>
                <Link to="/instructor" className="btn btn-success">➕ Create Course</Link>
                <Link to="/upload" className="btn btn-secondary">📤 Upload Material</Link>
              </>
            )}
            <Link to="/profile" className="btn btn-secondary">👤 Edit Profile</Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
