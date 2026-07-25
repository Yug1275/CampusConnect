import { FiLogOut, FiUser, FiSun, FiMoon, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import GlobalSearch from "./GlobalSearch";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];
  const { isMobileOpen, setIsMobileOpen } = useSidebar();

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-2 px-md-4"
      style={{
        height: "64px",
        backgroundColor: colors.navbarBg,
        borderBottom: `1px solid ${colors.navbarBorder}`,
      }}
    >
      <div className="d-flex align-items-center gap-2 gap-md-4">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="btn d-md-none d-flex align-items-center justify-content-center border-0 p-1 me-1"
          style={{ width: "36px", height: "36px", color: colors.textSecondary, backgroundColor: "transparent" }}
        >
          <FiMenu size={20} />
        </button>

        <Link to="/dashboard" className="d-flex align-items-center text-decoration-none" style={{ gap: "10px" }}>
          <img 
            src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"} 
            alt="CampusConnect Logo" 
            style={{ height: "32px", width: "auto" }} 
            onError={(e) => { e.target.src = "/logo.png" }} // Fallback if they haven't created the specific files yet
          />
          <span className="d-none d-sm-inline" style={{ fontSize: "1.25rem", fontWeight: 700, color: colors.textPrimary, letterSpacing: "0.3px" }}>
            CampusConnect
          </span>
        </Link>

        <GlobalSearch />
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        <NotificationBell />

        <button
          onClick={toggleTheme}
          className="btn d-flex align-items-center justify-content-center border-0"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: colors.navbarBorder,
            color: colors.textSecondary,
          }}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>

        <div
          className="d-none d-sm-flex align-items-center me-3 px-3 py-1"
          style={{ backgroundColor: colors.navbarBorder, borderRadius: "20px" }}
        >
          <FiUser size={16} color={colors.textSecondary} className="me-2" />
          <span style={{ color: colors.textPrimary, fontSize: "0.9rem" }}>{user?.name}</span>
          <span
            className="ms-2 px-2 py-0"
            style={{
              backgroundColor: colors.activeLinkBg,
              color: colors.activeLinkColor,
              fontSize: "0.7rem",
              borderRadius: "10px",
              textTransform: "capitalize",
            }}
          >
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="btn d-flex align-items-center border-0 p-1 p-sm-2"
          style={{ backgroundColor: "transparent", color: colors.textSecondary, fontSize: "0.9rem" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = colors.textPrimary)}
          onMouseLeave={(e) => (e.currentTarget.style.color = colors.textSecondary)}
        >
          <FiLogOut size={16} className="me-0 me-sm-1" />
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;