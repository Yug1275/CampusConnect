import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from "react-icons/fi";
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
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subjectService";
import { getDepartments } from "../../services/departmentService";
import { getFaculty } from "../../services/facultyService";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function SubjectManagement() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);

  const [departmentFilter, setDepartmentFilter] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    department: "",
    semester: "",
    faculty: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await getSubjects(departmentFilter ? { department: departmentFilter } : {});
      setSubjects(response.data.subjects);
    } catch (err) {
      setError("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [deptRes, facultyRes] = await Promise.all([
        getDepartments(),
        getFaculty({ limit: 500 }),
      ]);
      setDepartments(deptRes.data.departments);
      setFacultyList(facultyRes.data.faculty);
    } catch (err) {
      // Non-blocking - dropdowns stay empty if this fails
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [departmentFilter]);

  const openCreateModal = () => {
    setEditingSubject(null);
    setFormData({ name: "", code: "", department: "", semester: "", faculty: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      department: subject.department?._id || "",
      semester: subject.semester,
      faculty: subject.faculty?._id || "",
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
      semester: Number(formData.semester),
      faculty: formData.faculty || null,
    };

    try {
      if (editingSubject) {
        await updateSubject(editingSubject._id, payload);
        setMessage("Subject updated successfully");
      } else {
        await createSubject(payload);
        setMessage("Subject created successfully");
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save subject");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      await deleteSubject(deleteTarget._id);
      setMessage("Subject deleted successfully");
      setDeleteTarget(null);
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete subject");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Subject Management</h2>
          <p style={{ color: colors.textSecondary }}>Create and manage subjects across departments.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="btn text-white d-flex align-items-center px-3 py-2"
          style={primaryButtonStyle}
        >
          <FiPlus size={18} className="me-2" /> Add Subject
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
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="form-select"
          style={{ ...getInputStyle(colors), maxWidth: "240px" }}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept._id}>
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
            Loading subjects...
          </p>
        ) : subjects.length === 0 ? (
          <div className="p-5 text-center">
            <FiBookOpen size={32} color={colors.textMuted} className="mb-2" />
            <p className="mb-0" style={{ color: colors.textMuted }}>
              No subjects found. Click "Add Subject" to create one.
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
                  {["Name", "Code", "Department", "Semester", "Faculty"].map((h) => (
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
                {subjects.map((subject) => (
                  <tr
                    key={subject._id}
                    onMouseEnter={() => setHoveredRow(subject._id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      borderBottom: `1px solid ${colors.border}`,
                      backgroundColor: hoveredRow === subject._id ? colors.pageBg : "transparent",
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
                      {subject.name}
                    </td>
                    <td style={{ backgroundColor: "transparent" }}>
                      <span
                        className="px-2 py-1"
                        style={{
                          backgroundColor: colors.activeLinkBg,
                          color: colors.activeLinkColor,
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        {subject.code}
                      </span>
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {subject.department?.name || "—"}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      Sem {subject.semester}
                    </td>
                    <td style={{ color: colors.textSecondary, fontSize: "0.85rem", backgroundColor: "transparent" }}>
                      {subject.faculty?.name || "Unassigned"}
                    </td>
                    <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                      <button
                        onClick={() => openEditModal(subject)}
                        className="btn btn-sm border-0 bg-transparent me-1"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(subject)}
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
        title={editingSubject ? "Edit Subject" : "Add Subject"}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Subject Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={getInputStyle(colors)}
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Data Structures"
              required
            />
          </div>

          <div className="mb-3">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Subject Code
            </label>
            <input
              type="text"
              name="code"
              className="form-control text-uppercase"
              style={getInputStyle(colors)}
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS201"
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-7">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Department
              </label>
              <select
                name="department"
                className="form-select"
                style={getInputStyle(colors)}
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-5">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                Semester
              </label>
              <select
                name="semester"
                className="form-select"
                style={getInputStyle(colors)}
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                {SEMESTERS.map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label style={getLabelStyle(colors)} className="form-label d-block">
              Assigned Faculty (optional)
            </label>
            <select
              name="faculty"
              className="form-select"
              style={getInputStyle(colors)}
              value={formData.faculty}
              onChange={handleChange}
            >
              <option value="">Unassigned</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn text-white w-100"
            style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
            disabled={saving}
          >
            {saving ? "Saving..." : editingSubject ? "Update Subject" : "Create Subject"}
          </button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Subject?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </MainLayout>
  );
}

export default SubjectManagement;