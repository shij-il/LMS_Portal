import { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("profile");

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", form);
      updateUser(res.data);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const tabs = ["profile", "security", "preferences"];

  return (
    <Layout>
      <div className="fade-in">
        <div className="page-header">
          <h1 className="page-title">👤 Profile Settings</h1>
          <p className="page-subtitle">Manage your account and preferences</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem" }}>
          {/* Profile Card */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="card card-body" style={{ textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem", fontWeight: 800, color: "white",
                margin: "0 auto 1rem", fontFamily: "var(--font-display)"
              }}>
                {initials}
              </div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.25rem" }}>{user?.name}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{user?.email}</p>
              <span className="badge badge-primary" style={{ fontSize: "0.75rem", textTransform: "capitalize" }}>
                {user?.role === "instructor" ? "👨‍🏫" : "🎓"} {user?.role}
              </span>

              {user?.bio && (
                <p style={{ marginTop: "1rem", fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {user.bio}
                </p>
              )}
            </div>

            {/* Tab Nav */}
            <div className="card" style={{ overflow: "hidden" }}>
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    width: "100%", padding: "0.875rem 1.25rem",
                    background: tab === t ? "var(--accent-light)" : "transparent",
                    border: "none", borderLeft: tab === t ? "3px solid var(--accent)" : "3px solid transparent",
                    cursor: "pointer", textAlign: "left", fontSize: "0.875rem", fontWeight: 600,
                    color: tab === t ? "var(--accent)" : "var(--text-secondary)",
                    transition: "all var(--transition)", textTransform: "capitalize",
                    display: "flex", alignItems: "center", gap: "0.75rem"
                  }}
                >
                  <span>{t === "profile" ? "👤" : t === "security" ? "🔒" : "⚙️"}</span>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div>
            {tab === "profile" && (
              <div className="card card-body slide-up">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Profile Information</h3>
                <form onSubmit={handleSave}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-control"
                      value={user?.email}
                      disabled
                      style={{ opacity: 0.6 }}
                    />
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Tell students about yourself..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input
                      className="form-control"
                      value={user?.role}
                      disabled
                      style={{ opacity: 0.6, textTransform: "capitalize" }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Saving..." : "💾 Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {tab === "security" && (
              <div className="card card-body slide-up">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Security Settings</h3>
                <div className="alert alert-info" style={{ marginBottom: "1.5rem" }}>
                  ℹ️ Password change feature coming soon. Contact admin to reset your password.
                </div>

                <div style={{ padding: "1.25rem", background: "var(--bg-input)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "0.5rem" }}>Account Info</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <div><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                    <div><strong>Role:</strong> {user?.role}</div>
                    <div><strong>JWT Auth:</strong> <span className="badge badge-success">✅ Active</span></div>
                  </div>
                </div>
              </div>
            )}

            {tab === "preferences" && (
              <div className="card card-body slide-up">
                <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.5rem" }}>Preferences</h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "var(--bg-input)", borderRadius: "var(--radius)", marginBottom: "1rem" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Dark Mode</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Switch between light and dark theme</div>
                  </div>
                  <button
                    className={`btn btn-sm ${dark ? "btn-warning" : "btn-secondary"}`}
                    onClick={toggle}
                  >
                    {dark ? "☀️ Light" : "🌙 Dark"}
                  </button>
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-input)", borderRadius: "var(--radius)", marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>Notifications</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Toast notifications are enabled for all actions</div>
                </div>

                <div style={{ padding: "1rem", background: "var(--bg-input)", borderRadius: "var(--radius)" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>Language</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>English (US)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
