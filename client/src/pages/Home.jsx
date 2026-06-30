import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { themeColors } from "../styles/themeColors";

function Home() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const colors = themeColors[theme];

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get("/health");
        setStatus(response.data);
      } catch (err) {
        setError("Unable to connect to the backend server.");
      }
    };

    checkHealth();
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-3"
      style={{ minHeight: "100vh", backgroundColor: colors.pageBg }}
    >
      <h1 style={{ fontWeight: 700, color: colors.textPrimary, fontSize: "2.4rem" }}>
        CampusConnect
      </h1>
      <p style={{ color: colors.textSecondary, fontSize: "1.05rem" }} className="mb-4">
        One Platform for Students, Faculty &amp; Campus Life
      </p>

      <div className="d-flex gap-3 mb-5">
        <Link
          to="/login"
          className="btn text-white px-4 py-2"
          style={{ backgroundColor: "#2563eb", borderRadius: "8px", fontWeight: 600 }}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn px-4 py-2"
          style={{
            backgroundColor: colors.cardBg,
            color: "#2563eb",
            border: "1px solid #2563eb",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Register
        </Link>
      </div>

      <div
        className="px-4 py-2 rounded-pill d-inline-flex align-items-center"
        style={{
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.border}`,
          fontSize: "0.85rem",
        }}
      >
        {error && <span style={{ color: "#dc2626" }}>● {error}</span>}
        {!error && !status && <span style={{ color: colors.textMuted }}>● Checking server status...</span>}
        {status && <span style={{ color: "#16a34a" }}>● {status.message}</span>}
      </div>
    </div>
  );
}

export default Home;