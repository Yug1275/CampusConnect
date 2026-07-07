import { useState, useEffect } from "react";
import { FiCheckCircle, FiCalendar, FiFilter } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import AttendanceBarChart from "../../components/dashboard/AttendanceBarChart";
import { getInputStyle, getAlertErrorStyle } from "../../styles/authStyles";
import { getMyAttendance, getMyAttendanceSummary } from "../../services/attendanceService";

function AttendanceHistory() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      const response = await getMyAttendanceSummary();
      setSummary(response.data);
    } catch (err) {
      setError("Failed to load attendance summary");
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await getMyAttendance(subjectFilter ? { subject: subjectFilter } : {});
      setRecords(response.data.records);
    } catch (err) {
      setError("Failed to load attendance records");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchSummary(), fetchRecords()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!loading) fetchRecords();
  }, [subjectFilter]);

  if (loading) {
    return (
      <MainLayout>
        <p style={{ color: colors.textSecondary }}>Loading attendance data...</p>
      </MainLayout>
    );
  }

  const perSubject = summary?.perSubject || [];
  const overall = summary?.overall || { totalClasses: 0, totalPresent: 0, percentage: 0 };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Attendance History</h2>
        <p style={{ color: colors.textSecondary }}>
          Track your attendance across all subjects.
        </p>
      </div>

      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      {/* Overall stats */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Overall Attendance"
            value={`${overall.percentage}%`}
            accentColor={overall.percentage >= 75 ? "#16a34a" : "#f59e0b"}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Total Classes Held"
            value={overall.totalClasses}
            accentColor="#2563eb"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Classes Attended"
            value={overall.totalPresent}
            accentColor="#9333ea"
          />
        </div>
      </div>

      {perSubject.length === 0 ? (
        <div
          className="p-5 text-center mb-4"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <p className="mb-0" style={{ color: colors.textMuted }}>
            No attendance has been recorded yet.
          </p>
        </div>
      ) : (
        <>
          {/* Chart + per-subject progress bars */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-7">
              <div
                className="p-4 h-100"
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "14px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-3">
                  Attendance by Subject
                </h6>
                <AttendanceBarChart perSubject={perSubject} />
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div
                className="p-4 h-100"
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "14px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-3">
                  Subject Breakdown
                </h6>
                {perSubject.map((subject) => (
                  <div key={subject.subjectId} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ color: colors.textPrimary, fontSize: "0.85rem", fontWeight: 600 }}>
                        {subject.subjectName}
                      </span>
                      <span
                        style={{
                          color: subject.percentage >= 75 ? "#16a34a" : "#f59e0b",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                        }}
                      >
                        {subject.percentage}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        backgroundColor: colors.border,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${subject.percentage}%`,
                          backgroundColor: subject.percentage >= 75 ? "#16a34a" : "#f59e0b",
                          borderRadius: "4px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filterable records table */}
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
              <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-0">
                Detailed Records
              </h6>

              <div className="d-flex align-items-center gap-2">
                <FiFilter size={14} color={colors.textMuted} />
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="form-select"
                  style={{ ...getInputStyle(colors), maxWidth: "200px" }}
                >
                  <option value="">All Subjects</option>
                  {perSubject.map((s) => (
                    <option key={s.subjectId} value={s.subjectId}>
                      {s.subjectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {records.length === 0 ? (
              <p className="p-4 mb-0" style={{ color: colors.textMuted }}>
                No records found for this filter.
              </p>
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
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, padding: "14px 20px", backgroundColor: "transparent" }}>
                        Date
                      </th>
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, backgroundColor: "transparent" }}>
                        Subject
                      </th>
                      <th style={{ color: colors.textSecondary, fontSize: "0.82rem", fontWeight: 600, backgroundColor: "transparent" }} className="text-end pe-4">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record._id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                        <td style={{ color: colors.textSecondary, fontSize: "0.85rem", padding: "12px 20px", backgroundColor: "transparent" }}>
                          {new Date(record.date).toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.9rem", backgroundColor: "transparent" }}>
                          {record.subject?.name} <span style={{ color: colors.textMuted, fontWeight: 400 }}>({record.subject?.code})</span>
                        </td>
                        <td className="text-end pe-4" style={{ backgroundColor: "transparent" }}>
                          <span
                            className="px-2 py-1"
                            style={{
                              backgroundColor: record.status === "present" ? "#16a34a15" : "#dc262615",
                              color: record.status === "present" ? "#16a34a" : "#dc2626",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              textTransform: "capitalize",
                            }}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default AttendanceHistory;