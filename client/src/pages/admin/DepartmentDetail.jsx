import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiUsers, FiUserCheck, FiLayers, FiHash, FiCalendar } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import { getAlertErrorStyle } from "../../styles/authStyles";
import { getDepartmentStats } from "../../services/departmentService";

function DepartmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [department, setDepartment] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getDepartmentStats(id);
        setDepartment(response.data.department);
        setStats(response.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load department details");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <p style={{ color: colors.textSecondary }}>Loading department details...</p>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
        <Link
          to="/admin/departments"
          className="d-inline-flex align-items-center"
          style={{ color: colors.activeLinkColor, fontWeight: 600, fontSize: "0.9rem" }}
        >
          <FiArrowLeft size={16} className="me-1" /> Back to Departments
        </Link>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Back link */}
      <button
        onClick={() => navigate("/admin/departments")}
        className="btn d-flex align-items-center mb-4 px-0 border-0 bg-transparent"
        style={{ color: colors.textSecondary, fontWeight: 600, fontSize: "0.88rem" }}
      >
        <FiArrowLeft size={16} className="me-2" /> Back to Departments
      </button>

      {/* Department info header */}
      <div
        className="p-4 mb-4 d-flex flex-wrap justify-content-between align-items-start gap-3"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <h2 className="mb-0" style={{ fontWeight: 700, color: colors.textPrimary }}>
              {department.name}
            </h2>
            <span
              className="px-2 py-1"
              style={{
                backgroundColor: colors.activeLinkBg,
                color: colors.activeLinkColor,
                borderRadius: "6px",
                fontSize: "0.78rem",
                fontWeight: 700,
              }}
            >
              {department.code}
            </span>
          </div>
          <p className="mb-0" style={{ color: colors.textSecondary, fontSize: "0.92rem", maxWidth: "560px" }}>
            {department.description || "No description provided."}
          </p>
        </div>

        <div className="text-end">
          <div className="d-flex align-items-center justify-content-end mb-1" style={{ color: colors.textMuted, fontSize: "0.8rem" }}>
            <FiCalendar size={14} className="me-2" />
            Created {new Date(department.createdAt).toLocaleDateString()}
          </div>
          {department.headOfDepartment && (
            <div className="d-flex align-items-center justify-content-end" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              <FiUserCheck size={14} className="me-2" />
              Head: {department.headOfDepartment.name}
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiUsers size={20} />}
            label="Total Students"
            value={stats.studentCount}
            accentColor="#2563eb"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiUserCheck size={20} />}
            label="Total Faculty"
            value={stats.facultyCount}
            accentColor="#9333ea"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-4">
          <StatCard
            icon={<FiLayers size={20} />}
            label="Total Headcount"
            value={stats.totalHeadcount}
            accentColor="#16a34a"
          />
        </div>
      </div>

      {/* Quick links to filtered lists */}
      <div
        className="p-4 d-flex flex-wrap gap-3"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
        }}
      >
        <FiHash size={16} color={colors.textMuted} className="mt-1" />
        <div>
          <p className="mb-2" style={{ color: colors.textSecondary, fontSize: "0.88rem" }}>
            View all members of this department in their respective management pages.
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <Link
              to="/admin/students"
              className="btn px-3 py-2"
              style={{
                backgroundColor: colors.activeLinkBg,
                color: colors.activeLinkColor,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              View Students
            </Link>
            <Link
              to="/admin/faculty"
              className="btn px-3 py-2"
              style={{
                backgroundColor: colors.activeLinkBg,
                color: colors.activeLinkColor,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              View Faculty
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default DepartmentDetail;