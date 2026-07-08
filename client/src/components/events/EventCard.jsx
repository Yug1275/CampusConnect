import { FiCalendar, FiMapPin, FiUsers, FiCheck } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function EventCard({ event, onRegister, onCancel, actionLoading }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  const isFull = event.capacity && event.registeredCount >= event.capacity;

  const formattedDate = eventDate.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const capacityPercent = event.capacity
    ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100))
    : 0;

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
            backgroundColor: "#2563eb15",
            color: "#2563eb",
          }}
        >
          <FiCalendar size={20} />
        </span>

        {event.isRegistered && (
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
            <FiCheck size={12} className="me-1" /> Registered
          </span>
        )}
      </div>

      <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.05rem" }} className="mb-2">
        {event.title}
      </h6>

      {event.description && (
        <p
          style={{ color: colors.textSecondary, fontSize: "0.85rem" }}
          className="mb-3"
        >
          {event.description.length > 100
            ? `${event.description.slice(0, 100)}...`
            : event.description}
        </p>
      )}

      <div className="mb-2 d-flex align-items-center" style={{ color: colors.textSecondary, fontSize: "0.82rem" }}>
        <FiCalendar size={14} className="me-2 flex-shrink-0" />
        {formattedDate} at {formattedTime}
      </div>

      {event.location && (
        <div className="mb-2 d-flex align-items-center" style={{ color: colors.textSecondary, fontSize: "0.82rem" }}>
          <FiMapPin size={14} className="me-2 flex-shrink-0" />
          {event.location}
        </div>
      )}

      <div className="mb-3 d-flex align-items-center" style={{ color: colors.textSecondary, fontSize: "0.82rem" }}>
        <FiUsers size={14} className="me-2 flex-shrink-0" />
        {event.capacity ? `${event.registeredCount} / ${event.capacity} registered` : `${event.registeredCount} registered`}
      </div>

      {event.capacity && (
        <div
          className="mb-3"
          style={{
            height: "6px",
            borderRadius: "3px",
            backgroundColor: colors.border,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${capacityPercent}%`,
              backgroundColor: isFull ? "#dc2626" : "#2563eb",
              borderRadius: "3px",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}

      <div className="mt-auto">
        {isPast ? (
          <button
            disabled
            className="btn w-100 py-2"
            style={{
              backgroundColor: colors.pageBg,
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Event Ended
          </button>
        ) : event.isRegistered ? (
          <button
            onClick={() => onCancel(event._id)}
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
            {actionLoading ? "Cancelling..." : "Cancel Registration"}
          </button>
        ) : isFull ? (
          <button
            disabled
            className="btn w-100 py-2"
            style={{
              backgroundColor: colors.pageBg,
              color: colors.textMuted,
              border: `1px solid ${colors.border}`,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          >
            Fully Booked
          </button>
        ) : (
          <button
            onClick={() => onRegister(event._id)}
            disabled={actionLoading}
            className="btn w-100 text-white py-2"
            style={{
              backgroundColor: "#2563eb",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              opacity: actionLoading ? 0.7 : 1,
              border: "none",
            }}
          >
            {actionLoading ? "Registering..." : "Register"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;