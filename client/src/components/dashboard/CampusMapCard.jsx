import { Link } from "react-router-dom";
import { FiMap, FiNavigation, FiMapPin } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function CampusMapCard() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div
      className="p-4 d-flex flex-wrap align-items-center justify-content-between gap-3"
      style={{
        borderRadius: "14px",
        background:
          theme === "light"
            ? "linear-gradient(135deg, #eff6ff, #f8fafc)"
            : "linear-gradient(135deg, #1e293b, #0f172a)",
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
      }}
    >
      <div className="d-flex align-items-center">
        <span
          className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            backgroundColor: "#2563eb15",
            color: "#2563eb",
          }}
        >
          <FiMapPin size={24} />
        </span>
        <div>
          <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-1">
            Explore Campus
          </h6>
          <p className="mb-0" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
            Find buildings, facilities, and get directions around campus.
          </p>
        </div>
      </div>

      <div className="d-flex gap-2">
        <Link
          to="/campus-map"
          className="btn d-flex align-items-center px-3 py-2"
          style={{
            backgroundColor: colors.cardBg,
            color: colors.textPrimary,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          <FiMap size={15} className="me-2" /> View Map
        </Link>
        <Link
          to="/campus-navigation"
          className="btn d-flex align-items-center text-white px-3 py-2"
          style={{
            backgroundColor: "#2563eb",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.85rem",
            textDecoration: "none",
            border: "none",
          }}
        >
          <FiNavigation size={15} className="me-2" /> Get Directions
        </Link>
      </div>
    </div>
  );
}

export default CampusMapCard;