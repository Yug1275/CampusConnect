import { useState, useEffect } from "react";
import { FiCalendar } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import EventCard from "../../components/events/EventCard";
import { getAlertSuccessStyle, getAlertErrorStyle } from "../../styles/authStyles";
import {
  getEvents,
  registerForEvent,
  cancelEventRegistration,
  getMyRegistrations,
} from "../../services/eventService";

const TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "mine", label: "My Registrations" },
];

function BrowseEvents() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "mine") {
        const response = await getMyRegistrations();
        // Registrations populate the event; unwrap into the same shape EventCard expects
        const registeredEvents = response.data.registrations.map((reg) => ({
          ...reg.event,
          isRegistered: true,
          registeredCount: reg.event.registeredCount ?? 0,
        }));
        setEvents(registeredEvents);
      } else {
        const response = await getEvents({ filter: activeTab });
        setEvents(response.data.events);
      }
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const handleRegister = async (eventId) => {
    setActionLoadingId(eventId);
    setError("");
    setMessage("");
    try {
      await registerForEvent(eventId);
      setMessage("Successfully registered for the event");
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (eventId) => {
    setActionLoadingId(eventId);
    setError("");
    setMessage("");
    try {
      await cancelEventRegistration(eventId);
      setMessage("Registration cancelled successfully");
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel registration");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Campus Events</h2>
        <p style={{ color: colors.textSecondary }}>
          Discover and register for upcoming events on campus.
        </p>
      </div>

      {message && (
        <div className="px-3 py-2 mb-3" style={getAlertSuccessStyle(colors)}>
          {message}
        </div>
      )}
      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        className="d-inline-flex mb-4"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "10px",
          border: `1px solid ${colors.border}`,
          padding: "4px",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="btn px-4 py-2"
            style={{
              backgroundColor: activeTab === tab.key ? colors.activeLinkColor : "transparent",
              color: activeTab === tab.key ? "#fff" : colors.textSecondary,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              border: "none",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading events...</p>
      ) : events.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <FiCalendar size={32} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            {activeTab === "mine"
              ? "You haven't registered for any events yet."
              : `No ${activeTab} events found.`}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {events.map((event) => (
            <div key={event._id} className="col-12 col-sm-6 col-lg-4">
              <EventCard
                event={event}
                onRegister={handleRegister}
                onCancel={handleCancel}
                actionLoading={actionLoadingId === event._id}
              />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default BrowseEvents;