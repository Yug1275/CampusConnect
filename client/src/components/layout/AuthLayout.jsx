import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function AuthLayout({ title, subtitle, children }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div className="d-flex position-relative" style={{ minHeight: "100vh", backgroundColor: colors.pageBg }}>
      {/* Back to home button */}
      <Link
        to="/"
        className="d-flex align-items-center justify-content-center position-absolute"
        style={{
          top: "16px",
          left: "16px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          color: colors.textPrimary,
          zIndex: 10,
          transition: "transform 0.2s ease",
        }}
        title="Back to Home"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(-3px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
      >
        <FiArrowLeft size={18} />
      </Link>

      {/* Left branding panel - always dark, regardless of site theme */}
      <div
        className="d-none d-lg-flex flex-column justify-content-between p-5"
        style={{
          width: "42%",
          backgroundColor: "#1e293b",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(37,99,235,0.25), transparent 50%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.15), transparent 50%)",
        }}
      >
        <div>
          <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff" }}>
            CampusConnect
          </span>
        </div>

        <div>
          <h1 style={{ color: "#fff", fontWeight: 700, fontSize: "2.2rem", lineHeight: 1.3 }}>
            One Platform for<br />Students, Faculty<br />&amp; Campus Life
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", maxWidth: "380px" }}>
            Manage attendance, events, clubs, and campus life — all in one
            place, built for the modern university.
          </p>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.82rem" }}>
          &copy; {new Date().getFullYear()} CampusConnect
        </p>
      </div>

      {/* Right form panel */}
      <div
        className="d-flex flex-column justify-content-center align-items-center flex-grow-1 p-3 p-md-4"
        style={{ backgroundColor: colors.pageBg }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          <div className="d-lg-none text-center mb-4">
            <span style={{ fontSize: "1.3rem", fontWeight: 700, color: colors.textPrimary }}>
              CampusConnect
            </span>
          </div>

          <div
            className="p-4 p-md-5 fade-in-up"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "16px",
              border: `1px solid ${colors.border}`,
              boxShadow: theme === "light" ? "0 4px 16px rgba(15, 23, 42, 0.06)" : colors.shadow,
            }}
          >
            <h2 style={{ fontWeight: 700, color: colors.textPrimary, fontSize: "1.5rem" }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }} className="mb-4">
                {subtitle}
              </p>
            )}
            {!subtitle && <div className="mb-4" />}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;