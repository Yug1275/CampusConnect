import { useState, useEffect } from "react";
import { FiUser, FiCheckCircle, FiClock, FiUsers } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import Modal from "../ui/Modal";
import { getEventRegistrations } from "../../services/eventService";

function EventRegistrationsModal({ isOpen, onClose, event }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !event) return;

    const fetchRegistrations = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getEventRegistrations(event._id);
        setRegistrations(response.data.registrations);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [isOpen, event]);

  const checkedInCount = registrations.filter((r) => r.checkedIn).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? `Registrations — ${event.title}` : "Registrations"}
    >
      {loading ? (
        <p style={{ color: colors.textSecondary }} className="mb-0">
          Loading registrations...
        </p>
      ) : error ? (
        <p style={{ color: "#dc2626" }} className="mb-0">
          {error}
        </p>
      ) : registrations.length === 0 ? (
        <div className="text-center py-4">
          <FiUsers size={28} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            No one has registered for this event yet.
          </p>
        </div>
      ) : (
        <>
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 mb-3"
            style={{
              backgroundColor: colors.pageBg,
              borderRadius: "8px",
              border: `1px solid ${colors.border}`,
            }}
          >
            <span style={{ color: colors.textSecondary, fontSize: "0.85rem", fontWeight: 600 }}>
              Total Registered
            </span>
            <span style={{ color: colors.textPrimary, fontWeight: 700 }}>
              {registrations.length}
            </span>
          </div>
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 mb-3"
            style={{
              backgroundColor: "#16a34a15",
              borderRadius: "8px",
              border: "1px solid #16a34a30",
            }}
          >
            <span style={{ color: "#16a34a", fontSize: "0.85rem", fontWeight: 600 }}>
              Checked In
            </span>
            <span style={{ color: "#16a34a", fontWeight: 700 }}>
              {checkedInCount} / {registrations.length}
            </span>
          </div>

          <div style={{ maxHeight: "360px", overflowY: "auto" }}>
            {registrations.map((reg) => (
              <div
                key={reg._id}
                className="d-flex align-items-center justify-content-between py-2"
                style={{ borderBottom: `1px solid ${colors.border}` }}
              >
                <div className="d-flex align-items-center">
                  <span
                    className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "#2563eb15",
                      color: "#2563eb",
                    }}
                  >
                    <FiUser size={16} />
                  </span>
                  <div>
                    <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.88rem" }}>
                      {reg.student?.name || "Unknown"}
                    </p>
                    <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.76rem" }}>
                      {reg.student?.email}
                      {reg.student?.rollNumber ? ` · ${reg.student.rollNumber}` : ""}
                    </p>
                  </div>
                </div>

                {reg.checkedIn ? (
                  <span
                    className="d-flex align-items-center px-2 py-1"
                    style={{
                      backgroundColor: "#16a34a15",
                      color: "#16a34a",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                    }}
                  >
                    <FiCheckCircle size={12} className="me-1" /> Checked In
                  </span>
                ) : (
                  <span
                    className="d-flex align-items-center px-2 py-1"
                    style={{
                      backgroundColor: colors.pageBg,
                      color: colors.textMuted,
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <FiClock size={12} className="me-1" /> Not Checked In
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}

export default EventRegistrationsModal;