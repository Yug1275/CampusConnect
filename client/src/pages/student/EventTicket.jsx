import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { FiArrowLeft, FiCalendar, FiMapPin, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getAlertErrorStyle } from "../../styles/authStyles";
import { getMyTicket } from "../../services/eventService";

const buildTicketQrValue = (ticketCode) =>
  JSON.stringify({ type: "campusconnect-event-ticket", code: ticketCode });

function EventTicket() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await getMyTicket(eventId);
        setTicket(response.data.ticket);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [eventId]);

  return (
    <MainLayout>
      <button
        onClick={() => navigate("/student/events")}
        className="btn d-flex align-items-center mb-4 px-0 border-0 bg-transparent"
        style={{ color: colors.textSecondary, fontWeight: 600, fontSize: "0.88rem" }}
      >
        <FiArrowLeft size={16} className="me-2" /> Back to Events
      </button>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading ticket...</p>
      ) : error ? (
        <div className="px-3 py-2" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      ) : !ticket.ticketCode ? (
        <div
          className="p-4 text-center mx-auto"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            maxWidth: "420px",
          }}
        >
          <div
            className="d-inline-flex align-items-center justify-content-center mb-3"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "#f59e0b15",
              color: "#f59e0b",
            }}
          >
            <FiAlertTriangle size={26} />
          </div>
          <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-2">
            Ticket Not Available
          </h6>
          <p style={{ color: colors.textSecondary, fontSize: "0.88rem" }} className="mb-3">
            This registration doesn't have a valid ticket code. Please cancel and
            re-register for this event to generate a new ticket.
          </p>
        </div>
      ) : (
        <div
          className="p-4 text-center mx-auto"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "16px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            maxWidth: "420px",
          }}
        >
          <h5 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-1">
            {ticket.event.title}
          </h5>
          <div className="d-flex align-items-center justify-content-center mb-1" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
            <FiCalendar size={14} className="me-2" />
            {new Date(ticket.event.date).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          {ticket.event.location && (
            <div className="d-flex align-items-center justify-content-center mb-4" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              <FiMapPin size={14} className="me-2" />
              {ticket.event.location}
            </div>
          )}

          <div
            className="d-inline-flex p-3 mb-3"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              opacity: ticket.checkedIn ? 0.4 : 1,
            }}
          >
            <QRCodeSVG value={buildTicketQrValue(ticket.ticketCode)} size={200} />
          </div>

          {ticket.checkedIn ? (
            <div
              className="d-flex align-items-center justify-content-center gap-2"
              style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.95rem" }}
            >
              <FiCheckCircle size={18} /> Checked In
            </div>
          ) : (
            <p style={{ color: colors.textMuted, fontSize: "0.82rem" }} className="mb-0">
              Show this QR code at the event entrance to check in.
            </p>
          )}
        </div>
      )}
    </MainLayout>
  );
}

export default EventTicket;