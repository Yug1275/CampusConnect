import { NavLink } from "react-router-dom";
import { FiHome, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
    { to: "/profile", label: "My Profile", icon: <FiUser size={18} /> },
  ];

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        minHeight: "100%",
        padding: "24px 16px",
      }}
    >
      <p
        className="text-uppercase mb-3 px-2"
        style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px" }}
      >
        Menu
      </p>

      <ul className="nav flex-column" style={{ gap: "4px" }}>
        {navItems.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `d-flex align-items-center px-3 py-2 text-decoration-none rounded-2 ${
                  isActive ? "active-link" : "inactive-link"
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? "#2563eb" : "#475569",
                backgroundColor: isActive ? "#eff6ff" : "transparent",
                borderLeft: isActive ? "3px solid #2563eb" : "3px solid transparent",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.9rem",
                transition: "all 0.15s ease",
              })}
            >
              <span className="me-3 d-flex align-items-center">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;