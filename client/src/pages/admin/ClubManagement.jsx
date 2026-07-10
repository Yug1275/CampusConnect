import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiAward } from "react-icons/fi";
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
import { getClubs, createClub, updateClub, deleteClub, getClubMembers } from "../../services/clubService";

const CATEGORIES = ["Coding", "Robotics", "Photography", "Sports", "Music", "Other"];

const categoryColors = {
  Coding: "#2563eb",
  Robotics: "#9333ea",
  Photography: "#dc2626",
  Sports: "#16a34a",
  Music: "#f59e0b",
  Other: "#64748b",
};

function ClubManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", category: "Coding" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Members modal state
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [membersClub, setMembersClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const response = await getClubs();
      setClubs(response.data.clubs);
    } catch (err) {
      setError("Failed to load clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const openCreateModal = () => {
    setEditingClub(null);
    setFormData({ name: "", description: "", category: "Coding" });
    setIsModalOpen(true);
  };

  const openEditModal = (club) => {
    setEditingClub(club);
    setFormData({ name: club.name, description: club.description || "", category: club.category });
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
      if (editingClub) {
        await updateClub(editingClub._id, formData);
        setMessage("Club updated successfully");
      } else {
        await createClub(formData);
        setMessage("Club created successfully");
      }
      setIsModalOpen(false);
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save club");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteClub(deleteTarget._id);
      setMessage("Club deleted successfully");
      setDeleteTarget(null);
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete club");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  const openMembersModal = async (club) => {
    setMembersClub(club);
    setMembersModalOpen(true);
    setLoadingMembers(true);
    try {
      const response = await getClubMembers(club._id);
      setMembers(response.data.members);
    } catch (err) {
      setMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Club Management</h2>
          <p style={{ color: colors.textSecondary }}>Create and manage campus clubs.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> Add Club
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
            Loading clubs...
          </p>
        ) : clubs.length === 0 ? (
          <div className="p-5 text-center">
            <FiAward size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No clubs yet. Click "Add Club" to create one.
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
                  {["Name", "Category", "Description", "Members"].map((h) => (
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
                {clubs.map((club) => (
                  <tr
                    key={club._id}
                    onMouseEnter={() => setHoveredRow(club._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === club._id ? colors.pageBg : "transparent",
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
                      {club.name}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <span
                        className="px-2 py-1"
                        style={{
                          backgroundColor: `${categoryColors[club.category]}15`,
                          color: categoryColors[club.category],
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {club.category}
                      </span>
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {club.description
                        ? club.description.length > 60
                          ? `${club.description.slice(0, 60)}...`
                          : club.description
                        : "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {club.memberCount}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openMembersModal(club)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="View Members"
                      >
                        <FiUsers size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(club)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(club)}
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
        title={editingClub ? "Edit Club" : "Add Club"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Club Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Coding Club"
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

          <div className="mb-4">
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
              placeholder="Brief description of the club"
            />
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingClub ? "Update Club" : "Create Club"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Club?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />

      {/* Members Modal */}
      <Modal
        isOpen={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        title={membersClub ? `Members — ${membersClub.name}` : "Members"}
      >
        {loadingMembers ? (
          <p style={{ color: colors.textSecondary }} className="mb-0">
            Loading members...
          </p>
        ) : members.length === 0 ? (
          <div className="text-center py-4">
            <FiUsers size={28} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No members yet.
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
                Total Members
              </span>
              <span style={{ color: colors.textPrimary, fontWeight: 700 }}>{members.length}</span>
            </div>

            <div style={{ maxHeight: "360px", overflowY: "auto" }}>
              {members.map((m) => (
                <div
                  key={m._id}
                  className="py-2"
                  style={{ borderBottom: `1px solid ${colors.border}` }}
                >
                  <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.88rem" }}>
                    {m.student?.name}
                  </p>
                  <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.76rem" }}>
                    {m.student?.email}
                    {m.student?.rollNumber ? ` · ${m.student.rollNumber}` : ""}
                    {m.student?.department ? ` · ${m.student.department}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </Modal>
    </MainLayout>
  );
}

export default ClubManagement;