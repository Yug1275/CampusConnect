import { FiUsers, FiCheck, FiAward } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

const categoryColors = {
  Coding: "#2563eb",
  Robotics: "#9333ea",
  Photography: "#dc2626",
  Sports: "#16a34a",
  Music: "#f59e0b",
  Other: "#64748b",
};

function ClubCard({ club, onJoin, onLeave, actionLoading }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const accent = categoryColors[club.category] || categoryColors.Other;

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
      <div className="d-flex align-items-start justify-content-between mb-3">
        <span
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            backgroundColor: `${accent}15`,
            color: accent,
          }}
        >
          <FiAward size={20} />
        </span>

        {club.isMember && (
          <span
            className="px-2 py-1 d-flex align-items-center"
            style={{
              backgroundColor: "#16a34a15",
              color: "#16a34a",
              borderRadius: "6px",
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            <FiCheck size={12} className="me-1" /> Member
          </span>
        )}
      </div>

      <span
        className="d-inline-block mb-2 px-2 py-1"
        style={{
          backgroundColor: `${accent}15`,
          color: accent,
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 700,
          width: "fit-content",
        }}
      >
        {club.category}
      </span>

      <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.05rem" }} className="mb-2">
        {club.name}
      </h6>

      {club.description && (
        <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }} className="mb-3">
          {club.description.length > 100
            ? `${club.description.slice(0, 100)}...`
            : club.description}
        </p>
      )}

      <div className="mb-3 d-flex align-items-center" style={{ color: colors.textSecondary, fontSize: "0.82rem" }}>
        <FiUsers size={14} className="me-2 flex-shrink-0" />
        {club.memberCount} {club.memberCount === 1 ? "member" : "members"}
      </div>

      <div className="mt-auto">
        {club.isMember ? (
          <button
            onClick={() => onLeave(club._id)}
            disabled={actionLoading}
            className="btn w-100 py-2"
            style={{
              backgroundColor: "transparent",
              color: "#dc2626",
              border: "1px solid #dc2626",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              opacity: actionLoading ? 0.6 : 1,
            }}
          >
            {actionLoading ? "Leaving..." : "Leave Club"}
          </button>
        ) : (
          <button
            onClick={() => onJoin(club._id)}
            disabled={actionLoading}
            className="btn w-100 text-white py-2"
            style={{
              backgroundColor: accent,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              opacity: actionLoading ? 0.7 : 1,
              border: "none",
            }}
          >
            {actionLoading ? "Joining..." : "Join Club"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ClubCard;