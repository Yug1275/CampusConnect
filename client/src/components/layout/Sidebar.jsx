import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiCheckSquare,
  FiBarChart2,
  FiCamera,
  FiCalendar,
  FiTag,
  FiAward,
  FiMapPin,
  FiMap,
  FiNavigation,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function Sidebar() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FiHome size={18} /> },
    { to: "/profile", label: "My Profile", icon: <FiUser size={18} /> },
  ];

  if (user?.role === "admin") {
    navItems.push(
      { to: "/admin/departments", label: "Departments", icon: <FiGrid size={18} /> },
      { to: "/admin/students", label: "Students", icon: <FiUsers size={18} /> },
      { to: "/admin/faculty", label: "Faculty", icon: <FiUserCheck size={18} /> },
      { to: "/admin/subjects", label: "Subjects", icon: <FiBookOpen size={18} /> },
      { to: "/admin/clubs", label: "Clubs", icon: <FiAward size={18} /> },
      { to: "/admin/locations", label: "Locations", icon: <FiMapPin size={18} /> }
    );
  }

  if (user?.role === "faculty" || user?.role === "admin") {
    navItems.push(
      { to: "/faculty/attendance", label: "Mark Attendance", icon: <FiCheckSquare size={18} /> },
      { to: "/events/manage", label: "Manage Events", icon: <FiCalendar size={18} /> },
      { to: "/events/scan-ticket", label: "Scan Event Ticket", icon: <FiTag size={18} /> }
    );
  }

  if (user?.role === "student") {
    navItems.push(
      { to: "/student/attendance", label: "Attendance History", icon: <FiBarChart2 size={18} /> },
      { to: "/student/scan-attendance", label: "Scan Attendance", icon: <FiCamera size={18} /> },
      { to: "/student/events", label: "Events", icon: <FiCalendar size={18} /> },
      { to: "/student/clubs", label: "Clubs", icon: <FiAward size={18} /> }
    );
  }

  navItems.push(
    { to: "/campus-map", label: "Campus Map", icon: <FiMap size={18} /> },
    { to: "/campus-navigation", label: "Navigation", icon: <FiNavigation size={18} /> }
  );

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: colors.sidebarBg,
        borderRight: `1px solid ${colors.border}`,
        minHeight: "100%",
        padding: "24px 16px",
      }}
    >
      <p
        className="text-uppercase mb-3 px-2"
        style={{ fontSize: "0.72rem", color: colors.textMuted, fontWeight: 600, letterSpacing: "0.5px" }}
      >
        Menu
      </p>

      <ul className="nav flex-column" style={{ gap: "4px" }}>
        {navItems.map((item) => (
          <li key={item.to} className="nav-item">
            <NavLink
              to={item.to}
              className="d-flex align-items-center px-3 py-2 text-decoration-none rounded-2"
              style={({ isActive }) => ({
                color: isActive ? colors.activeLinkColor : colors.textSecondary,
                backgroundColor: isActive ? colors.activeLinkBg : "transparent",
                borderLeft: isActive ? `3px solid ${colors.activeLinkColor}` : "3px solid transparent",
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