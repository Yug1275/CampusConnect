import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function StatCard({ icon, label, value, accentColor = "#2563eb" }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div
      className="p-4 d-flex flex-column"
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        minWidth: "0",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          {icon}
        </span>
      </div>
      <span style={{ color: colors.textSecondary, fontSize: "0.85rem", fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ color: colors.textPrimary, fontSize: "1.6rem", fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
}

export default StatCard;