import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiUserCheck } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import Modal from "../../components/ui/Modal";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SearchBar from "../../components/ui/SearchBar";
import Pagination from "../../components/ui/Pagination";
import {
  getInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";
import {
  getFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from "../../services/facultyService";
import { getDepartments } from "../../services/departmentService";

function FacultyManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [facultyList, setFacultyList] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    qualification: "",
    subjects: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await getFaculty({
        search,
        department: departmentFilter,
        page,
        limit: 8,
      });
      setFacultyList(response.data.faculty);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to load faculty");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data.departments);
    } catch (err) {
      // Non-blocking - department dropdown just stays empty if this fails
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [search, departmentFilter, page]);

  const handleSearch = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleDepartmentFilterChange = (e) => {
    setPage(1);
    setDepartmentFilter(e.target.value);
  };

  const openCreateModal = () => {
    setEditingFaculty(null);
    setFormData({ name: "", email: "", department: "", qualification: "", subjects: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (faculty) => {
    setEditingFaculty(faculty);
    setFormData({
      name: faculty.name,
      email: faculty.email,
      department: faculty.department || "",
      qualification: faculty.qualification || "",
      subjects: (faculty.subjects || []).join(", "),
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

    const subjectsArray = formData.subjects
      ? formData.subjects.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      if (editingFaculty) {
        const payload = {
          name: formData.name,
          department: formData.department,
          qualification: formData.qualification,
          subjects: subjectsArray,
        };
        await updateFaculty(editingFaculty._id, payload);
        setMessage("Faculty updated successfully");
      } else {
        const payload = { ...formData, subjects: subjectsArray };
        await createFaculty(payload);
        setMessage("Faculty created successfully");
      }
      setIsModalOpen(false);
      fetchFaculty();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save faculty");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteFaculty(deleteTarget._id);
      setMessage("Faculty deleted successfully");
      setDeleteTarget(null);
      fetchFaculty();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete faculty");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Faculty Management</h2>
          <p style={{ color: colors.textSecondary }}>View, search, and manage faculty records.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> Add Faculty
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

      {/* Search + Filter bar */}
      <div className="d-flex flex-wrap gap-3 mb-3">
        <SearchBar placeholder="Search by name, email, or qualification..." onSearch={handleSearch} />

        <select
          value={departmentFilter}
          onChange={handleDepartmentFilterChange}
          className="form-select"
          style={{ ...getInputStyle(colors), maxWidth: "220px" }}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept.name}>
              {dept.name}
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
            Loading faculty...
          </p>
        ) : facultyList.length === 0 ? (
          <div className="p-5 text-center">
            <FiUserCheck size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No faculty found.
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
                  {["Name", "Email", "Department", "Qualification", "Subjects"].map((h) => (
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
                {facultyList.map((faculty) => (
                  <tr
                    key={faculty._id}
                    onMouseEnter={() => setHoveredRow(faculty._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === faculty._id ? colors.pageBg : "transparent",
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
                      {faculty.name}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {faculty.email}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {faculty.department || "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {faculty.qualification || "—"}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      {faculty.subjects && faculty.subjects.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {faculty.subjects.slice(0, 2).map((subject, i) => (
                            <span
                              key={i}
                              className="px-2 py-1"
                              style={{
                                backgroundColor: colors.activeLinkBg,
                                color: colors.activeLinkColor,
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                              }}
                            >
                              {subject}
                            </span>
                          ))}
                          {faculty.subjects.length > 2 && (
                            <span style={{ color: colors.textMuted, fontSize: "0.75rem" }}>
                              +{faculty.subjects.length - 2} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: colors.textMuted, fontSize: "0.85rem" }}>—</span>
                      )}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openEditModal(faculty)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(faculty)}
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

        <div style={{ borderTop: facultyList.length > 0 ? `1px solid ${colors.border}` : "none" }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFaculty ? "Edit Faculty" : "Add Faculty"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              style={{
                ...getInputStyle(colors),
                backgroundColor: editingFaculty ? colors.inputReadonlyBg : colors.inputBg,
              }}
              value={formData.email}
              onChange={handleChange}
              readOnly={!!editingFaculty}
              required
            />
            {editingFaculty && (
              <small style={{ color: colors.textMuted, fontSize: "0.75rem" }}>
                Email cannot be changed after creation
              </small>
            )}
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Department
            </label>
            <select
              name="department"
              className="form-select"
              style={getInputStyle(colors)}
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Qualification
            </label>
            <input
              type="text"
              name="qualification"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.qualification}
              onChange={handleChange}
              placeholder="e.g. M.Tech, Ph.D"
            />
          </div>

          <div className="mb-4">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Subjects (comma-separated)
            </label>
            <input
              type="text"
              name="subjects"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.subjects}
              onChange={handleChange}
              placeholder="e.g. Data Structures, Algorithms"
            />
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingFaculty ? "Update Faculty" : "Create Faculty"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Faculty?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default FacultyManagement;