import { FiAlertTriangle } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

// Generic delete/action confirmation dialog - reused across all management pages
function ConfirmDialog({ isOpen, onCancel, onConfirm, title, message, confirmLabel = "Delete", loading = false }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", zIndex: 1100 }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-4 text-center fade-in-up"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          width: "100%",
          maxWidth: "380px",
          margin: "0 16px",
        }}
      >
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#fef2f2",
            color: "#dc2626",
          }}
        >
          <FiAlertTriangle size={22} />
        </div>

        <h6 style={{ color: colors.textPrimary, fontWeight: 700 }}>{title}</h6>
        <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }} className="mb-4">
          {message}
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            onClick={onCancel}
            className="btn px-4 py-2"
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${colors.border}`,
              color: colors.textPrimary,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.88rem",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn px-4 py-2 text-white"
            style={{
              backgroundColor: "#dc2626",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.88rem",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;