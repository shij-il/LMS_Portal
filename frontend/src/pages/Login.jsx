import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}! 👋`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div className="auth-visual">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎓</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "2.5rem",
            fontWeight: 800, color: "white", marginBottom: "1rem", lineHeight: 1.2
          }}>
            Learn Without Limits
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 340, margin: "0 auto 2.5rem" }}>
            Join thousands of students and instructors on our world-class learning management platform.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
            {[
              { value: "500+", label: "Courses" },
              { value: "10k+", label: "Students" },
              { value: "98%", label: "Satisfaction" }
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "#fbbf24" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Floating cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2.5rem", maxWidth: 300, margin: "2.5rem auto 0" }}>
            {[
              { icon: "✅", text: "JWT Secured Authentication" },
              { icon: "📊", text: "Real-time Progress Tracking" },
              { icon: "📜", text: "PDF Certificate Generation" }
            ].map((f) => (
              <div key={f.text} style={{
                background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px",
                padding: "0.75rem 1rem", display: "flex", alignItems: "center",
                gap: "0.75rem", textAlign: "left"
              }}>
                <span style={{ fontSize: "1.1rem" }}>{f.icon}</span>
                <span style={{ fontSize: "0.825rem", color: "rgba(255,255,255,0.85)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card fade-in">
          {/* Logo */}
          <div className="auth-logo" style={{ marginBottom: "2rem" }}>
            <div className="auth-logo-icon">🎓</div>
            <span style={{ fontFamily: "var(--font-display)" }}>LMS<span style={{ color: "var(--accent)" }}>Portal</span></span>
          </div>

          <h2 className="auth-heading">Welcome back</h2>
          <p className="auth-subheading">Sign in to continue your learning journey</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "0.875rem", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--text-muted)",
                    fontSize: "1rem", padding: 0
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ width: "100%", marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner spinner-sm" style={{ borderTopColor: "white" }}></span>
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: "1.5rem", padding: "1rem",
            background: "var(--accent-light)", borderRadius: "var(--radius)",
            border: "1px solid var(--accent-border)"
          }}>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              💡 Quick Demo
            </p>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <div>Register as <strong>Student</strong> or <strong>Instructor</strong> to explore</div>
            </div>
          </div>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
