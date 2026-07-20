import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiSearch, FiTag } from "react-icons/fi";
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
import { reportItem, getMyItems, deleteItem } from "../../services/lostFoundService";

const statusColors = {
  open: { bg: "#2563eb15", color: "#2563eb", label: "Open" },
  claimed: { bg: "#f59e0b15", color: "#f59e0b", label: "Claim Pending" },
  verified: { bg: "#16a34a15", color: "#16a34a", label: "Resolved" },
};

function ReportLostFound() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "lost",
    itemName: "",
    description: "",
    location: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const response = await getMyItems();
      setMyItems(response.data.items);
    } catch (err) {
      setError("Failed to load your reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  const openModal = (type) => {
    setFormData({ type, itemName: "", description: "", location: "", imageUrl: "" });
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
      await reportItem(formData);
      setMessage(`${formData.type === "lost" ? "Lost" : "Found"} item reported successfully`);
      setIsModalOpen(false);
      fetchMyItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteItem(deleteTarget._id);
      setMessage("Report deleted successfully");
      setDeleteTarget(null);
      fetchMyItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete report");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Lost &amp; Found</h2>
          <p style={{ color: colors.textSecondary }}>Report a lost or found item on campus.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => openModal("lost")}
            className="btn d-flex align-items-center px-3 py-2"
            style={{ backgroundColor: "#dc262615", color: "#dc2626", border: "1px solid #dc262640", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem" }}
          >
            <FiSearch size={15} className="me-2" /> Report Lost
          </button>
          <button
            onClick={() => openModal("found")}
            className="btn text-white d-flex align-items-center px-3 py-2"
            style={primaryButtonStyle}
          >
            <FiPlus size={15} className="me-2" /> Report Found
          </button>
        </div>
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

      <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-3">My Reports</h6>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading...</p>
      ) : myItems.length === 0 ? (
        <div className="p-5 text-center" style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}>
          <FiTag size={30} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>You haven't reported any items yet.</p>
        </div>
      ) : (
        <div className="row g-3">
          {myItems.map((item) => {
            const st = statusColors[item.status];
            return (
              <div key={item._id} className="col-12 col-sm-6 col-lg-4">
                <div className="p-4 h-100" style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span
                      className="px-2 py-1 text-capitalize"
                      style={{ backgroundColor: item.type === "lost" ? "#dc262615" : "#16a34a15", color: item.type === "lost" ? "#dc2626" : "#16a34a", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}
                    >
                      {item.type}
                    </span>
                    <span className="px-2 py-1" style={{ backgroundColor: st.bg, color: st.color, borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                      {st.label}
                    </span>
                  </div>

                  <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-1">{item.itemName}</h6>
                  {item.description && <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }} className="mb-2">{item.description}</p>}
                  {item.location && <p style={{ color: colors.textMuted, fontSize: "0.78rem" }} className="mb-3">📍 {item.location}</p>}

                  {item.claimedBy && (
                    <p style={{ color: colors.textMuted, fontSize: "0.78rem" }} className="mb-3">
                      Claimed by: {item.claimedBy.name}
                    </p>
                  )}

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="btn w-100 py-2 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: "transparent", color: "#dc2626", border: "1px solid #dc2626", borderRadius: "8px", fontWeight: 600, fontSize: "0.82rem" }}
                  >
                    <FiTrash2 size={14} className="me-2" /> Delete Report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={formData.type === "lost" ? "Report Lost Item" : "Report Found Item"}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">Item Name</label>
            <input type="text" name="itemName" className="form-control" style={getInputStyle(colors)} value={formData.itemName} onChange={handleChange} placeholder="e.g. Blue backpack" required />
          </div>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">Description</label>
            <textarea name="description" className="form-control" style={{ ...getInputStyle(colors), resize: "vertical" }} rows={3} value={formData.description} onChange={handleChange} placeholder="Distinguishing details..." />
          </div>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">Location</label>
            <input type="text" name="location" className="form-control" style={getInputStyle(colors)} value={formData.location} onChange={handleChange} placeholder="e.g. Library, 2nd floor" />
          </div>
          <div className="mb-4">
            <label style={getLabelStyle(colors)} className="form-label d-block">Image URL (optional)</label>
            <input type="text" name="imageUrl" className="form-control" style={getInputStyle(colors)} value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>
          <button type="submit" className="btn text-white w-100" style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }} disabled={saving}>
            {saving ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Report?"
        message={`Are you sure you want to delete this report for "${deleteTarget?.itemName}"?`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default ReportLostFound;