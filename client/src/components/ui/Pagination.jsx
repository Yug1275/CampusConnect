import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function Pagination({ page, totalPages, onPageChange }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const btnBase = {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    fontSize: "0.85rem",
    fontWeight: 600,
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.cardBg,
    color: colors.textSecondary,
  };

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 py-3 flex-wrap">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn d-flex align-items-center justify-content-center"
        style={{ ...btnBase, opacity: page === 1 ? 0.5 : 1 }}
      >
        <FiChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className="btn d-flex align-items-center justify-content-center"
          style={{
            ...btnBase,
            backgroundColor: p === page ? colors.activeLinkColor : colors.cardBg,
            color: p === page ? "#fff" : colors.textSecondary,
            border: p === page ? "none" : `1px solid ${colors.border}`,
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="btn d-flex align-items-center justify-content-center"
        style={{ ...btnBase, opacity: page === totalPages ? 0.5 : 1 }}
      >
        <FiChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;