import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function HomeNavbar() {
  const { theme, toggleTheme } = useTheme();
  const colors = themeColors[theme];

  return (
    <nav
      className="d-flex align-items-center justify-content-between gap-2 px-2 px-md-5 fade-in"
      style={{
        minHeight: "72px",
        backgroundColor: colors.pageBg,
        borderBottom: `1px solid ${colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="d-flex align-items-center" style={{ gap: "10px" }}>
        <img 
          src={theme === "dark" ? "/logo-dark.png" : "/logo-light.png"} 
          alt="CampusConnect Logo" 
          style={{ height: "36px", width: "auto" }} 
          onError={(e) => { e.target.src = "/logo.png" }}
        />
        <span className="d-none d-sm-inline" style={{ fontSize: "1.3rem", fontWeight: 700, color: colors.textPrimary, letterSpacing: "0.3px" }}>
          CampusConnect
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-end gap-2 gap-sm-3">
        <button
          onClick={toggleTheme}
          className="btn d-flex align-items-center justify-content-center border-0"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            color: colors.textSecondary,
          }}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <FiMoon size={16} /> : <FiSun size={16} />}
        </button>

        <Link
          to="/login"
          className="btn cta-btn px-2 px-sm-3 py-1 py-sm-2"
          style={{
            color: colors.textPrimary,
            backgroundColor: "transparent",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Login
        </Link>

        <Link
          to="/register"
          className="btn cta-btn text-white px-2 px-sm-3 py-1 py-sm-2"
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}

export default HomeNavbar;