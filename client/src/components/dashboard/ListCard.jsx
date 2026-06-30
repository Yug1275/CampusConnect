import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function ListCard({ title, items, emptyText = "Nothing to show right now" }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div
      className="p-4 h-100"
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

      {items.length === 0 ? (
        <p style={{ color: colors.textMuted, fontSize: "0.88rem" }} className="mb-0">
          {emptyText}
        </p>
      ) : (
        <ul className="list-unstyled mb-0">
          {items.map((item, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center py-2"
              style={{
                borderBottom: index < items.length - 1 ? `1px solid ${colors.border}` : "none",
              }}
            >
              <div>
                <p className="mb-0" style={{ color: colors.textPrimary, fontSize: "0.9rem", fontWeight: 600 }}>
                  {item.primary}
                </p>
                {item.secondary && (
                  <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
                    {item.secondary}
                  </p>
                )}
              </div>
              {item.tag && (
                <span
                  className="px-2 py-1"
                  style={{
                    backgroundColor: colors.activeLinkBg,
                    color: colors.activeLinkColor,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                  }}
                >
                  {item.tag}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListCard;