import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiClock, FiPhone } from "react-icons/fi";
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
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from "../../services/locationService";

const CATEGORIES = [
  "Library",
  "Auditorium",
  "Hostel",
  "Cafeteria",
  "Sports Ground",
  "Placement Cell",
  "Labs",
  "Parking",
  "Admin Block",
  "Other",
];

const categoryColors = {
  Library: "#2563eb",
  Auditorium: "#9333ea",
  Hostel: "#dc2626",
  Cafeteria: "#f59e0b",
  "Sports Ground": "#16a34a",
  "Placement Cell": "#0891b2",
  Labs: "#7c3aed",
  Parking: "#64748b",
  "Admin Block": "#be185d",
  Other: "#64748b",
};

function LocationManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [locations, setLocations] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "Library",
    latitude: "",
    longitude: "",
    description: "",
    imageUrl: "",
    openingTime: "",
    closingTime: "",
    contactInfo: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await getLocations(categoryFilter ? { category: categoryFilter } : {});
      setLocations(response.data.locations);
    } catch (err) {
      setError("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [categoryFilter]);

  const openCreateModal = () => {
    setEditingLocation(null);
    setFormData({
      name: "",
      category: "Library",
      latitude: "",
      longitude: "",
      description: "",
      imageUrl: "",
      openingTime: "",
      closingTime: "",
      contactInfo: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      category: location.category,
      latitude: location.latitude,
      longitude: location.longitude,
      description: location.description || "",
      imageUrl: location.imageUrl || "",
      openingTime: location.openingTime || "",
      closingTime: location.closingTime || "",
      contactInfo: location.contactInfo || "",
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
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    };

    try {
      if (editingLocation) {
        await updateLocation(editingLocation._id, payload);
        setMessage("Location updated successfully");
      } else {
        await createLocation(payload);
        setMessage("Location created successfully");
      }
      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteLocation(deleteTarget._id);
      setMessage("Location deleted successfully");
      setDeleteTarget(null);
      fetchLocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete location");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Location Management</h2>
          <p style={{ color: colors.textSecondary }}>Manage campus map locations and details.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> Add Location
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

      <div className="mb-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="form-select"
          style={{ ...getInputStyle(colors), maxWidth: "220px" }}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
            Loading locations...
          </p>
        ) : locations.length === 0 ? (
          <div className="p-5 text-center">
            <FiMapPin size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No locations yet. Click "Add Location" to create one.
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
                  {["Name", "Category", "Coordinates", "Timing", "Contact"].map((h) => (
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
                {locations.map((location) => (
                  <tr
                    key={location._id}
                    onMouseEnter={() => setHoveredRow(location._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === location._id ? colors.pageBg : "transparent",
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
                      {location.name}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <span
                        className="px-2 py-1"
                        style={{
                          backgroundColor: `${categoryColors[location.category]}15`,
                          color: categoryColors[location.category],
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                        }}
                      >
                        {location.category}
                      </span>
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.8rem", backgroundColor: "transparent" }}>
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {location.openingTime && location.closingTime
                        ? `${location.openingTime} - ${location.closingTime}`
                        : "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {location.contactInfo || "—"}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openEditModal(location)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(location)}
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
        title={editingLocation ? "Edit Location" : "Add Location"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Location Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Central Library"
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Category
            </label>
            <select
              name="category"
              className="form-select"
              style={getInputStyle(colors)}
              value={formData.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                <FiMapPin size={14} className="me-1" /> Latitude
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                className="form-control"
                style={getInputStyle(colors)}
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g. 23.1795"
                required
              />
            </div>
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                className="form-control"
                style={getInputStyle(colors)}
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g. 72.6413"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Description
            </label>
            <textarea
              name="description"
              className="form-control"
              style={{ ...getInputStyle(colors), resize: "vertical" }}
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the location"
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Image URL (optional)
            </label>
            <input
              type="text"
              name="imageUrl"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                <FiClock size={14} className="me-1" /> Opening Time
              </label>
              <input
                type="time"
                name="openingTime"
                className="form-control"
                style={getInputStyle(colors)}
                value={formData.openingTime}
                onChange={handleChange}
              />
            </div>
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Closing Time
              </label>
              <input
                type="time"
                name="closingTime"
                className="form-control"
                style={getInputStyle(colors)}
                value={formData.closingTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-4">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              <FiPhone size={14} className="me-1" /> Contact Info
            </label>
            <input
              type="text"
              name="contactInfo"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="e.g. library@campus.edu or extension 204"
            />
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingLocation ? "Update Location" : "Create Location"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Location?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default LocationManagement;