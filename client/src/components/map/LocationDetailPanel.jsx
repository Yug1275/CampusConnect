import { FiMapPin, FiClock, FiPhone, FiX, FiNavigation } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

const categoryColors = {
  Library: "#2563eb",
  Auditorium: "#9333ea",
  Hostel: "#dc2626",
  Cafeteria: "#f59e0b",
  "Sports Ground": "#16a34a",
  "Placement Cell": "#0891b2",
  Labs: "#7c3aed",
  Parking: "#64748b",
  "Admin Block": "#be185d",
  Other: "#64748b",
};

// Computes whether a location is currently open, based on its
// openingTime/closingTime ("HH:MM" strings) compared to the current time.
const getOpenStatus = (openingTime, closingTime) => {
  if (!openingTime || !closingTime) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openH, openM] = openingTime.split(":").map(Number);
  const [closeH, closeM] = closingTime.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  // Handles same-day hours only (e.g. 08:00-22:00) - overnight spans
  // (e.g. 22:00-06:00) are an edge case not needed for typical campus hours
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
};

function LocationDetailPanel({ location, onClose, onSetDestination }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  if (!location) return null;

  const accent = categoryColors[location.category] || categoryColors.Other;
  const isOpen = getOpenStatus(location.openingTime, location.closingTime);

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        height: "100%",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span
          className="px-2 py-1"
          style={{
            backgroundColor: `${accent}15`,
            color: accent,
            borderRadius: "6px",
            fontSize: "0.76rem",
            fontWeight: 700,
          }}
        >
          {location.category}
        </span>
        <button
          onClick={onClose}
          className="btn d-flex align-items-center justify-content-center border-0 bg-transparent p-1"
          style={{ color: colors.textMuted }}
        >
          <FiX size={18} />
        </button>
      </div>

      {location.imageUrl && (
        <img
          src={location.imageUrl}
          alt={location.name}
          style={{
            width: "100%",
            height: "160px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}

      <h5 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-2">
        {location.name}
      </h5>

      {location.description && (
        <p style={{ color: colors.textSecondary, fontSize: "0.88rem" }} className="mb-3">
          {location.description}
        </p>
      )}

      {(location.openingTime || location.closingTime) && (
        <div className="d-flex align-items-center mb-2" style={{ fontSize: "0.85rem" }}>
          <FiClock size={15} color={colors.textMuted} className="me-2 flex-shrink-0" />
          <span style={{ color: colors.textSecondary }}>
            {location.openingTime} - {location.closingTime}
          </span>
          {isOpen !== null && (
            <span
              className="ms-2 px-2 py-1"
              style={{
                backgroundColor: isOpen ? "#16a34a15" : "#dc262615",
                color: isOpen ? "#16a34a" : "#dc2626",
                borderRadius: "6px",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {isOpen ? "Open Now" : "Closed"}
            </span>
          )}
        </div>
      )}

      {location.contactInfo && (
        <div className="d-flex align-items-center mb-3" style={{ fontSize: "0.85rem" }}>
          <FiPhone size={15} color={colors.textMuted} className="me-2 flex-shrink-0" />
          <span style={{ color: colors.textSecondary }}>{location.contactInfo}</span>
        </div>
      )}

      <div className="d-flex align-items-center mb-4" style={{ fontSize: "0.8rem" }}>
        <FiMapPin size={14} color={colors.textMuted} className="me-2 flex-shrink-0" />
        <span style={{ color: colors.textMuted }}>
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </span>
      </div>

      <button
        onClick={() => onSetDestination(location)}
        className="btn w-100 text-white d-flex align-items-center justify-content-center py-2"
        style={{
          backgroundColor: "#2563eb",
          borderRadius: "8px",
          fontWeight: 600,
          fontSize: "0.85rem",
          border: "none",
        }}
      >
        <FiNavigation size={15} className="me-2" /> Navigate Here
      </button>
    </div>
  );
}

export default LocationDetailPanel;