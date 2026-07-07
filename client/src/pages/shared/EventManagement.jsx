import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiMapPin, FiUsers } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  getInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";
import { getEvents, createEvent, updateEvent, deleteEvent } from "../../services/eventService";

// Converts an ISO date string to the format <input type="datetime-local"> expects
const toDatetimeLocalValue = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

function EventManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getEvents({ filter: activeTab });
      setEvents(response.data.events);
    } catch (err) {
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeTab]);

  const openCreateModal = () => {
    setEditingEvent(null);
    setFormData({ title: "", description: "", date: "", location: "", capacity: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      date: toDatetimeLocalValue(event.date),
      location: event.location || "",
      capacity: event.capacity || "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...formData,
      capacity: formData.capacity ? Number(formData.capacity) : null,
    };

    try {
      if (editingEvent) {
        await updateEvent(editingEvent._id, payload);
        setMessage("Event updated successfully");
      } else {
        await createEvent(payload);
        setMessage("Event created successfully");
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteEvent(deleteTarget._id);
      setMessage("Event deleted successfully");
      setDeleteTarget(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete event");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatEventDate = (isoString) =>
    new Date(isoString).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Event Management</h2>
          <p style={{ color: colors.textSecondary }}>Create and manage campus events.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> Add Event
        </button>
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

      {/* Upcoming / Past tabs */}
      <div className="d-inline-flex mb-3" style={{ backgroundColor: colors.cardBg, borderRadius: "10px", border: `1px solid ${colors.border}`, padding: "4px" }}>
        {["upcoming", "past"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="btn px-4 py-2 text-capitalize"
            style={{
              backgroundColor: activeTab === tab ? colors.activeLinkColor : "transparent",
              color: activeTab === tab ? "#fff" : colors.textSecondary,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.85rem",
              border: "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          overflow: "hidden",
        }}
      >
        {loading ? (
          <p className="p-4 mb-0" style={{ color: colors.textSecondary }}>
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <div className="p-5 text-center">
            <FiCalendar size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No {activeTab} events found.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table
              className="table mb-0 align-middle"
              style={{
                "--bs-table-bg": "transparent",
                "--bs-table-color": colors.textPrimary,
                "--bs-table-border-color": colors.border,
                marginBottom: 0,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                  {["Title", "Date & Time", "Location", "Capacity", "Organizer"].map((h) => (
                    <th
                      key={h}
                      style={{
                        color: colors.textSecondary,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        padding: "14px 20px",
                        backgroundColor: "transparent",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                  <th
                    style={{
                      color: colors.textSecondary,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      backgroundColor: "transparent",
                    }}
                    className="text-end pe-4"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event._id}
                    onMouseEnter={() => setHoveredRow(event._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === event._id ? colors.pageBg : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <td
                      style={{
                        color: colors.textPrimary,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        padding: "14px 20px",
                        backgroundColor: "transparent",
                      }}
                    >
                      {event.title}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {formatEventDate(event.date)}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {event.location || "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {event.capacity || "Unlimited"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {event.createdBy?.name || "—"}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openEditModal(event)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(event)}
                        className="btn btn-sm border-0 bg-transparent"
                        style={{ color: "#dc2626" }}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Add Event"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Sports Meet"
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Description
            </label>
            <textarea
              name="description"
              className="form-control"
              style={{ ...getInputStyle(colors), resize: "vertical" }}
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the event"
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              <FiCalendar size={14} className="me-1" /> Date & Time
            </label>
            <input
              type="datetime-local"
              name="date"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              <FiMapPin size={14} className="me-1" /> Location
            </label>
            <input
              type="text"
              name="location"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Main Auditorium"
            />
          </div>

          <div className="mb-4">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              <FiUsers size={14} className="me-1" /> Capacity (optional)
            </label>
            <input
              type="number"
              name="capacity"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.capacity}
              onChange={handleChange}
              placeholder="Leave blank for unlimited"
              min="1"
            />
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default EventManagement;