import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div className="auth-visual">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>✨</div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "2.2rem",
            fontWeight: 800, color: "white", marginBottom: "1rem", lineHeight: 1.2
          }}>
            Start Your Learning Journey Today
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1rem", maxWidth: 340, margin: "0 auto 2.5rem" }}>
            Choose your role, access courses, track progress, and earn certificates.
          </p>

          {/* Role cards */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", maxWidth: 360, margin: "0 auto" }}>
            {[
              {
                role: "Student", icon: "🎓",
                perks: ["Browse all courses", "Track your progress", "Earn certificates"]
              },
              {
                role: "Instructor", icon: "👨‍🏫",
                perks: ["Create courses", "Upload materials", "Monitor students"]
              }
            ].map((r) => (
              <div key={r.role} style={{
                flex: 1, background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "16px", padding: "1.25rem", textAlign: "center"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{r.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: "0.75rem", fontSize: "0.95rem" }}>{r.role}</div>
                <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
                  {r.perks.map((p) => (
                    <li key={p} style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.3rem" }}>
                      ✓ {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card fade-in">
          <div className="auth-logo" style={{ marginBottom: "2rem" }}>
            <div className="auth-logo-icon">🎓</div>
            <span style={{ fontFamily: "var(--font-display)" }}>LMS<span style={{ color: "var(--accent)" }}>Portal</span></span>
          </div>

          <h2 className="auth-heading">Create your account</h2>
          <p className="auth-subheading">Join our learning community today</p>

          {/* Role Toggle */}
          <div style={{
            display: "flex", background: "var(--bg-input)",
            borderRadius: "var(--radius)", padding: "4px",
            marginBottom: "1.5rem", border: "1px solid var(--border)"
          }}>
            {["student", "instructor"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                style={{
                  flex: 1, padding: "0.5rem", border: "none", cursor: "pointer",
                  borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600,
                  textTransform: "capitalize", transition: "all 0.2s",
                  background: form.role === r ? "var(--accent)" : "transparent",
                  color: form.role === r ? "white" : "var(--text-muted)",
                  boxShadow: form.role === r ? "var(--shadow-accent)" : "none"
                }}
              >
                {r === "student" ? "🎓" : "👨‍🏫"} {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: "3rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: "0.875rem", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1rem", padding: 0
                  }}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: "0.5rem", display: "flex", gap: "4px" }}>
                  {[1,2,3,4].map((i) => (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 2,
                      background: form.password.length >= i * 3
                        ? i <= 1 ? "var(--danger)"
                          : i <= 2 ? "var(--warning)"
                          : "var(--success)"
                        : "var(--border)"
                    }} />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span className="spinner spinner-sm" style={{ borderTopColor: "white" }}></span>
                  Creating account...
                </span>
              ) : `Create ${form.role} account →`}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
