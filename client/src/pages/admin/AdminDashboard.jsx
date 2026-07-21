import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiUserCheck, FiGrid, FiCalendar, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import LineChartCard from "../../components/dashboard/LineChartCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import { getAdminSummary } from "../../services/adminService";
import { getEvents } from "../../services/eventService";
import { getAttendanceTrend, getStudentsPerDepartment } from "../../services/analyticsService";

function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const [upcomingEventCount, setUpcomingEventCount] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [studentsPerDept, setStudentsPerDept] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getAdminSummary();
        setSummary(response.data.summary);
      } catch (err) {
        setSummary(null);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents({ filter: "upcoming" });
        setUpcomingEventCount(response.data.count);
      } catch (err) {
        setUpcomingEventCount(null);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const [trendRes, deptRes] = await Promise.all([
          getAttendanceTrend(),
          getStudentsPerDepartment(),
        ]);
        setAttendanceTrend(trendRes.data.trend);
        setStudentsPerDept(deptRes.data.data);
      } catch (err) {
        setAttendanceTrend([]);
        setStudentsPerDept([]);
      } finally {
        setLoadingCharts(false);
      }
    };
    fetchCharts();
  }, []);

  const recentActivities = [
    { primary: "New student registered - Riya Shah", secondary: "5 minutes ago" },
    { primary: "Faculty added to Computer Science dept.", secondary: "1 hour ago" },
    { primary: "New event created: Annual Sports Meet", secondary: "3 hours ago" },
    { primary: "Announcement posted by Admin", secondary: "Yesterday" },
  ];

  const statValue = (value) => {
    if (loadingSummary) return "…";
    if (value === undefined || value === null) return "—";
    return value.toLocaleString();
  };

  const eventsDisplay = loadingEvents
    ? "…"
    : upcomingEventCount !== null
    ? upcomingEventCount
    : "—";

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p style={{ color: colors.textSecondary }}>Here's an overview of the entire campus.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiUsers size={20} />}
            label="Total Students"
            value={statValue(summary?.totalStudents)}
            accentColor="#2563eb"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiUserCheck size={20} />}
            label="Total Faculty"
            value={statValue(summary?.totalFaculty)}
            accentColor="#9333ea"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiGrid size={20} />}
            label="Departments"
            value={statValue(summary?.totalDepartments)}
            accentColor="#16a34a"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Active Events"
            value={eventsDisplay}
            accentColor="#f59e0b"
          />
        </div>
      </div>

      {/* Real charts - replaces ChartPlaceholder (static since Phase 3, Task 4) */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }}>
          Campus Insights
        </h6>
        <Link
          to="/admin/analytics"
          className="d-flex align-items-center"
          style={{ color: colors.activeLinkColor, fontWeight: 600, fontSize: "0.85rem", textDecoration: "none" }}
        >
          View Full Analytics <FiArrowRight size={14} className="ms-1" />
        </Link>
      </div>

      {loadingCharts ? (
        <p style={{ color: colors.textSecondary }} className="mb-4">
          Loading charts...
        </p>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-6">
            <LineChartCard
              title="Attendance Trend (Last 14 Days)"
              labels={attendanceTrend.map((t) => t.date)}
              values={attendanceTrend.map((t) => t.percentage)}
            />
          </div>
          <div className="col-12 col-lg-6">
            <BarChartCard
              title="Students per Department"
              labels={studentsPerDept.map((d) => d.department)}
              values={studentsPerDept.map((d) => d.count)}
              color="#2563eb"
              horizontal
            />
          </div>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12">
          <ListCard title="Recent Activities" items={recentActivities} />
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;