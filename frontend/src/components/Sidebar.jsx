import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = {
  common: [
    { to: "/dashboard", label: "Dashboard", icon: "⊞" },
    { to: "/courses", label: "Browse Courses", icon: "📚" },
    { to: "/my-courses", label: "My Courses", icon: "🎯" },
    { to: "/progress", label: "Progress", icon: "📈" },
  ],
  instructor: [
    { to: "/instructor", label: "Manage Courses", icon: "🛠" },
    { to: "/upload", label: "Upload Materials", icon: "📤" },
  ],
  account: [
    { to: "/profile", label: "Profile", icon: "👤" },
  ]
};

function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      {mobileOpen && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.4)", zIndex: 199,
            backdropFilter: "blur(2px)"
          }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-logo" style={{ cursor: "default" }}>
          <div className="sidebar-logo-icon">🎓</div>
          <div>
            <div className="sidebar-logo-text">LMS Portal</div>
            <div className="sidebar-logo-sub">Learning Management</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            {navItems.common.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {user?.role === "instructor" && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Instructor</div>
              {navItems.instructor.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                  onClick={onClose}
                >
                  <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}

          <div className="sidebar-section">
            <div className="sidebar-section-title">Account</div>
            {navItems.account.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
                onClick={onClose}
              >
                <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Dark mode toggle */}
            <button
              className="sidebar-link"
              style={{ width: "100%", border: "none", background: "none", textAlign: "left", cursor: "pointer" }}
              onClick={toggle}
            >
              <span style={{ fontSize: "1rem" }}>{dark ? "☀️" : "🌙"}</span>
              <span>{dark ? "Light Mode" : "Dark Mode"}</span>
            </button>

            <button
              className="sidebar-link"
              style={{ width: "100%", border: "none", background: "none", textAlign: "left", cursor: "pointer", color: "var(--danger)" }}
              onClick={handleLogout}
            >
              <span style={{ fontSize: "1rem" }}>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* User */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div style={{ overflow: "hidden" }}>
              <div className="sidebar-user-name">{user?.name}</div>
              <div className="sidebar-user-role">{user?.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
