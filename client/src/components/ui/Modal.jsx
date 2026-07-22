import { FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

// Generic centered modal - reused for all create/edit forms across the app
function Modal({ isOpen, onClose, title, children }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  if (!isOpen) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
      style={{ backgroundColor: "rgba(15, 23, 42, 0.55)", zIndex: 1000 }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="fade-in-up"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          width: "min(480px, calc(100vw - 24px))",
          margin: "0 12px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-between px-4 py-3"
          style={{ borderBottom: `1px solid ${colors.border}` }}
        >
          <h5 className="mb-0" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.05rem" }}>
            {title}
          </h5>
          <button
            onClick={onClose}
            className="btn d-flex align-items-center justify-content-center border-0 bg-transparent p-1"
            style={{ color: colors.textMuted }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;