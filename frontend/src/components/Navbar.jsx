import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar({ onMenuClick }) {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <button
        className="btn btn-ghost btn-icon mobile-nav-toggle"
        onClick={onMenuClick}
        style={{ display: "flex" }}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      <div style={{ flex: 1 }} />

      <div className="navbar-right">
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          background: "var(--bg-input)", borderRadius: "var(--radius-full)",
          padding: "0.375rem 0.875rem 0.375rem 0.375rem",
          border: "1px solid var(--border)"
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "var(--accent)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontSize: "0.75rem", fontWeight: 700
          }}>
            {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "capitalize" }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
