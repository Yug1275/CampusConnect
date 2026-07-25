import { useEffect, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";
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
  FiBell,
  FiPieChart,
  FiMessageSquare,
  FiSearch,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function Sidebar() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { isMobileOpen, setIsMobileOpen } = useSidebar();
  const colors = themeColors[theme];
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      { to: "/admin/locations", label: "Locations", icon: <FiMapPin size={18} /> },
      { to: "/admin/analytics", label: "Analytics", icon: <FiPieChart size={18} /> }
    );
  }

  if (user?.role === "faculty" || user?.role === "admin") {
    navItems.push(
      { to: "/faculty/attendance", label: "Mark Attendance", icon: <FiCheckSquare size={18} /> },
      { to: "/events/manage", label: "Manage Events", icon: <FiCalendar size={18} /> },
      { to: "/events/scan-ticket", label: "Scan Event Ticket", icon: <FiTag size={18} /> },
      { to: "/announcements/manage", label: "Manage Announcements", icon: <FiBell size={18} /> },
      { to: "/feedback", label: "Feedback", icon: <FiMessageSquare size={18} /> },
    );
  }

  if (user?.role === "faculty") {
    navItems.push({ to: "/announcements", label: "Announcements Feed", icon: <FiBell size={18} /> });
  }

  if (user?.role === "student") {
    navItems.push(
      { to: "/student/attendance", label: "Attendance History", icon: <FiBarChart2 size={18} /> },
      { to: "/student/scan-attendance", label: "Scan Attendance", icon: <FiCamera size={18} /> },
      { to: "/student/events", label: "Events", icon: <FiCalendar size={18} /> },
      { to: "/student/clubs", label: "Clubs", icon: <FiAward size={18} /> },
      { to: "/announcements", label: "Announcements", icon: <FiBell size={18} /> },
      { to: "/student/feedback", label: "Submit Feedback", icon: <FiMessageSquare size={18} /> },
      { to: "/student/id-card", label: "Digital ID", icon: <FiCreditCard size={18} /> },
    );
  }

  navItems.push(
    { to: "/campus-map", label: "Campus Map", icon: <FiMap size={18} /> },
    { to: "/campus-navigation", label: "Navigation", icon: <FiNavigation size={18} /> },
    { to: "/lost-found/report", label: "Report Item", icon: <FiTag size={18} /> },
    { to: "/lost-found/browse", label: "Browse Lost & Found", icon: <FiSearch size={18} /> },
  );

  return (
    <>
      {/* Overlay - only visible on mobile when drawer is open */}
      {!isDesktop && isMobileOpen && (
        <div
          className="d-md-none"
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1900,
          }}
        />
      )}

      <aside
        className="flex-shrink-0 sidebar-scroll"
        style={{
          width: "240px",
          backgroundColor: colors.sidebarBg,
          borderRight: `1px solid ${colors.border}`,
          padding: "24px 16px",
          // Mobile: fixed off-canvas drawer; Desktop: normal in-flow flex item
          position: isDesktop ? "static" : "fixed",
          top: 0,
          left: 0,
          minHeight: isDesktop ? "calc(100vh - 70px)" : "100vh",
          height: isDesktop ? "100%" : "100vh",
          overflowY: "auto",
          zIndex: 2000,
          transform: isDesktop ? "none" : (isMobileOpen ? "translateX(0)" : "translateX(-100%)"),
          transition: "transform 0.25s ease",
          display: isDesktop ? "block" : "block",
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
    </>
  );
}

export default Sidebar;