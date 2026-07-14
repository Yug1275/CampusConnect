import { FiLogOut, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import GlobalSearch from "./GlobalSearch";

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        height: "64px",
        backgroundColor: colors.navbarBg,
        borderBottom: `1px solid ${colors.navbarBorder}`,
      }}
    >
      <div className="d-flex align-items-center" style={{ gap: "24px" }}>
        <span style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", letterSpacing: "0.3px" }}>
          CampusConnect
        </span>

        <GlobalSearch />
      </div>

      <div className="d-flex align-items-center">
        <button
          onClick={toggleTheme}
          className="btn d-flex align-items-center justify-content-center border-0 me-3"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: colors.navbarBorder,
            color: "#cbd5e1",
          }}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>

        <div
          className="d-flex align-items-center me-3 px-3 py-1"
          style={{ backgroundColor: colors.navbarBorder, borderRadius: "20px" }}
        >
          <FiUser size={16} color="#cbd5e1" className="me-2" />
          <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>{user?.name}</span>
          <span
            className="ms-2 px-2 py-0"
            style={{
              backgroundColor: "#475569",
              color: "#cbd5e1",
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
          className="btn d-flex align-items-center border-0"
          style={{ backgroundColor: "transparent", color: "#cbd5e1", fontSize: "0.9rem" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
        >
          <FiLogOut size={16} className="me-1" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;