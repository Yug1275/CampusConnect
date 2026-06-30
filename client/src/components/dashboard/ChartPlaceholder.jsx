import { FiBarChart2 } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function ChartPlaceholder({ title }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div
      className="p-4 h-100 d-flex flex-column"
      style={{
        backgroundColor: colors.cardBg,
        borderRadius: "14px",
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
      }}
    >
      <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-3">
        {title}
      </h6>

      <div
        className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{
          backgroundColor: colors.pageBg,
          border: `1px dashed ${colors.border}`,
          borderRadius: "10px",
          minHeight: "200px",
        }}
      >
        <FiBarChart2 size={32} color={colors.textMuted} />
        <p className="mb-0 mt-2" style={{ color: colors.textMuted, fontSize: "0.82rem" }}>
          Chart will be available in Phase 9 (Analytics)
        </p>
      </div>
    </div>
  );
}

export default ChartPlaceholder;