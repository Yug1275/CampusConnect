import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiBell } from "react-icons/fi";
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
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../services/announcementService";
import { getDepartments } from "../../services/departmentService";

const ROLE_LABELS = {
  all: "Everyone",
  student: "Students Only",
  faculty: "Faculty Only",
};

function AnnouncementManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [announcements, setAnnouncements] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    targetRole: "all",
    targetDepartment: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await getAllAnnouncements();
      setAnnouncements(response.data.announcements);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data.departments);
    } catch (err) {
      // Non-blocking - department dropdown stays with just "All Departments"
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchDepartments();
  }, []);

  const openCreateModal = () => {
    setEditingAnnouncement(null);
    setFormData({ title: "", body: "", targetRole: "all", targetDepartment: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      body: announcement.body,
      targetRole: announcement.targetRole,
      targetDepartment: announcement.targetDepartment || "",
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

    try {
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, formData);
        setMessage("Announcement updated successfully");
      } else {
        await createAnnouncement(formData);
        setMessage("Announcement posted successfully");
      }
      setIsModalOpen(false);
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteAnnouncement(deleteTarget._id);
      setMessage("Announcement deleted successfully");
      setDeleteTarget(null);
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete announcement");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (isoString) =>
    new Date(isoString).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Announcement Management</h2>
          <p style={{ color: colors.textSecondary }}>Post and manage campus announcements.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> New Announcement
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
            Loading announcements...
          </p>
        ) : announcements.length === 0 ? (
          <div className="p-5 text-center">
            <FiBell size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No announcements yet. Click "New Announcement" to post one.
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
                  {["Title", "Target", "Department", "Posted By", "Date"].map((h) => (
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
                {announcements.map((a) => (
                  <tr
                    key={a._id}
                    onMouseEnter={() => setHoveredRow(a._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === a._id ? colors.pageBg : "transparent",
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
                      {a.title}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <span
                        className="px-2 py-1"
                        style={{
                          backgroundColor: colors.activeLinkBg,
                          color: colors.activeLinkColor,
                          borderRadius: "6px",
                          fontSize: "0.76rem",
                          fontWeight: 600,
                        }}
                      >
                        {ROLE_LABELS[a.targetRole]}
                      </span>
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {a.targetDepartment || "All Departments"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {a.createdBy?.name || "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {formatDate(a.createdAt)}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openEditModal(a)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(a)}
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
        title={editingAnnouncement ? "Edit Announcement" : "New Announcement"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Mid-Semester Exam Schedule"
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Body
            </label>
            <textarea
              name="body"
              className="form-control"
              style={{ ...getInputStyle(colors), resize: "vertical" }}
              rows={4}
              value={formData.body}
              onChange={handleChange}
              placeholder="Write the announcement details..."
              required
            />
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Target Audience
              </label>
              <select
                name="targetRole"
                className="form-select"
                style={getInputStyle(colors)}
                value={formData.targetRole}
                onChange={handleChange}
              >
                <option value="all">Everyone</option>
                <option value="student">Students Only</option>
                <option value="faculty">Faculty Only</option>
              </select>
            </div>
            <div className="col-6">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Department
              </label>
              <select
                name="targetDepartment"
                className="form-select"
                style={getInputStyle(colors)}
                value={formData.targetDepartment}
                onChange={handleChange}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingAnnouncement ? "Update Announcement" : "Post Announcement"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Announcement?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default AnnouncementManagement;