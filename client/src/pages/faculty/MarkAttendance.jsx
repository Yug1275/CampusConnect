import { useState, useEffect } from "react";
import { FiCheck, FiX, FiUsers, FiCalendar, FiGrid } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import QrSessionModal from "../../components/attendance/QrSessionModal";
import {
  getInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";
import { getSubjects } from "../../services/subjectService";
import {
  getStudentsForSubject,
  getAttendanceForSubjectByDate,
  markAttendance,
} from "../../services/attendanceService";

const todayISO = () => new Date().toISOString().split("T")[0];

function MarkAttendance() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const [students, setStudents] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await getSubjects({ faculty: user._id });
        setSubjects(response.data.subjects);
      } catch (err) {
        setError("Failed to load your subjects");
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [user]);

  useEffect(() => {
    if (!selectedSubject || !selectedDate) {
      setStudents([]);
      setStatusMap({});
      return;
    }

    const fetchRoster = async () => {
      setLoadingRoster(true);
      setError("");
      setMessage("");
      try {
        const [rosterRes, existingRes] = await Promise.all([
          getStudentsForSubject(selectedSubject),
          getAttendanceForSubjectByDate(selectedSubject, selectedDate),
        ]);

        const rosterStudents = rosterRes.data.students;
        setStudents(rosterStudents);

        const existingMap = {};
        existingRes.data.records.forEach((rec) => {
          existingMap[rec.student] = rec.status;
        });

        const initialStatus = {};
        rosterStudents.forEach((s) => {
          initialStatus[s._id] = existingMap[s._id] || "present";
        });
        setStatusMap(initialStatus);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load student roster");
      } finally {
        setLoadingRoster(false);
      }
    };

    fetchRoster();
  }, [selectedSubject, selectedDate]);

  const toggleStatus = (studentId, status) => {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const all = {};
    students.forEach((s) => {
      all[s._id] = "present";
    });
    setStatusMap(all);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    const records = students.map((s) => ({
      student: s._id,
      status: statusMap[s._id] || "present",
    }));

    try {
      await markAttendance({ subject: selectedSubject, date: selectedDate, records });
      setMessage("Attendance marked successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(statusMap).filter((s) => s === "present").length;
  const absentCount = students.length - presentCount;

  const selectedSubjectObj = subjects.find((s) => s._id === selectedSubject);
  const subjectLabel = selectedSubjectObj
    ? `${selectedSubjectObj.name} (${selectedSubjectObj.code}) — ${new Date(selectedDate).toLocaleDateString()}`
    : "";

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Mark Attendance</h2>
        <p style={{ color: colors.textSecondary }}>
          Select a subject and date to mark student attendance.
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

      {/* Subject + Date selectors */}
      <div
        className="p-4 mb-4 row g-3 align-items-end"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
        }}
      >
        <div className="col-12 col-md-5">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Subject
          </label>
          <select
            className="form-select"
            style={getInputStyle(colors)}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={loadingSubjects}
          >
            <option value="">
              {loadingSubjects ? "Loading subjects..." : "Select a subject"}
            </option>
            {subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.name} ({subj.code}) — Sem {subj.semester}
              </option>
            ))}
          </select>
          {!loadingSubjects && subjects.length === 0 && (
            <small style={{ color: colors.textMuted }}>
              No subjects are currently assigned to you.
            </small>
          )}
        </div>

        <div className="col-12 col-md-4">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            <FiCalendar size={14} className="me-1" /> Date
          </label>
          <input
            type="date"
            className="form-control"
            style={getInputStyle(colors)}
            value={selectedDate}
            max={todayISO()}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-3">
          <button
            onClick={() => setIsQrModalOpen(true)}
            disabled={!selectedSubject}
            className="btn w-100 d-flex align-items-center justify-content-center px-3 py-2"
            style={{
              backgroundColor: colors.activeLinkBg,
              color: colors.activeLinkColor,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.88rem",
              opacity: !selectedSubject ? 0.5 : 1,
              border: "none",
            }}
          >
            <FiGrid size={16} className="me-2" /> Generate QR
          </button>
        </div>
      </div>

      {/* Roster */}
      {selectedSubject && (
        <div
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
            overflow: "hidden",
          }}
        >
          <div
            className="d-flex flex-wrap justify-content-between align-items-center px-4 py-3"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <div className="d-flex align-items-center gap-2">
              <FiUsers size={16} color={colors.textSecondary} />
              <span style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "0.95rem" }}>
                {students.length} Students
              </span>
              {students.length > 0 && (
                <span style={{ color: colors.textMuted, fontSize: "0.82rem" }}>
                  ({presentCount} present, {absentCount} absent)
                </span>
              )}
            </div>

            {students.length > 0 && (
              <button
                onClick={markAllPresent}
                className="btn px-3 py-1"
                style={{
                  backgroundColor: colors.activeLinkBg,
                  color: colors.activeLinkColor,
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                }}
              >
                Mark All Present
              </button>
            )}
          </div>

          {loadingRoster ? (
            <p className="p-4 mb-0" style={{ color: colors.textSecondary }}>
              Loading roster...
            </p>
          ) : students.length === 0 ? (
            <div className="p-5 text-center">
              <p className="mb-0" style={{ color: colors.textMuted }}>
                No students found for this subject's department and semester.
              </p>
            </div>
          ) : (
            <>
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
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, padding: "14px 20px", backgroundColor: "transparent" }}>
                        Roll No.
                      </th>
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, backgroundColor: "transparent" }}>
                        Name
                      </th>
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, backgroundColor: "transparent" }} className="text-end pe-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const status = statusMap[student._id] || "present";
                      return (
                        <tr key={student._id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                          <td style={{ color: colors.textSecondary, fontSize: "0.85rem", padding: "12px 20px", backgroundColor: "transparent" }}>
                            {student.rollNumber || "—"}
                          </td>
                          <td style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.9rem", backgroundColor: "transparent" }}>
                            {student.name}
                          </td>
                          <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                            <div className="d-inline-flex" style={{ gap: "6px" }}>
                              <button
                                onClick={() => toggleStatus(student._id, "present")}
                                className="btn d-flex align-items-center px-3 py-1"
                                style={{
                                  backgroundColor: status === "present" ? "#16a34a" : "transparent",
                                  color: status === "present" ? "#fff" : colors.textMuted,
                                  border: `1px solid ${status === "present" ? "#16a34a" : colors.border}`,
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  fontSize: "0.8rem",
                                }}
                              >
                                <FiCheck size={14} className="me-1" /> Present
                              </button>
                              <button
                                onClick={() => toggleStatus(student._id, "absent")}
                                className="btn d-flex align-items-center px-3 py-1"
                                style={{
                                  backgroundColor: status === "absent" ? "#dc2626" : "transparent",
                                  color: status === "absent" ? "#fff" : colors.textMuted,
                                  border: `1px solid ${status === "absent" ? "#dc2626" : colors.border}`,
                                  borderRadius: "8px",
                                  fontWeight: 600,
                                  fontSize: "0.8rem",
                                }}
                              >
                                <FiX size={14} className="me-1" /> Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4" style={{ borderTop: `1px solid ${colors.border}` }}>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="btn text-white px-4 py-2"
                  style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving..." : "Submit Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <QrSessionModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        subjectId={selectedSubject}
        date={selectedDate}
        subjectLabel={subjectLabel}
      />
    </MainLayout>
  );
}

export default MarkAttendance;