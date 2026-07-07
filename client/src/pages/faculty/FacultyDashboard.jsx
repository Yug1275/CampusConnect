import { useState, useEffect } from "react";
import { FiBookOpen, FiCheckCircle, FiClipboard, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import { getFacultyAttendanceSummary } from "../../services/attendanceService";

function FacultyDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [attendanceAvg, setAttendanceAvg] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getFacultyAttendanceSummary();
        setAttendanceAvg(response.data.summary.averagePercentage);
      } catch (err) {
        setAttendanceAvg(null);
      } finally {
        setLoadingAttendance(false);
      }
    };
    fetchSummary();
  }, []);

  // Static placeholders - Today's Classes requires a Timetable module (not yet built),
  // Pending Tasks/Upcoming Events require modules from later phases.
  const todaysClasses = [
    { primary: "Data Structures - CSE 2A", secondary: "9:00 AM - 10:00 AM, Room 204" },
    { primary: "Database Management Systems - CSE 2B", secondary: "11:00 AM - 12:00 PM, Room 110" },
    { primary: "Computer Networks - CSE 3A", secondary: "2:00 PM - 3:00 PM, Lab 3" },
  ];

  const pendingTasks = [
    { primary: "Grade Database Assignment 3", secondary: "Due Oct 15", tag: "Pending" },
    { primary: "Upload lecture notes - Networks", secondary: "Due Oct 16", tag: "Pending" },
    { primary: "Review feedback submissions", secondary: "Due Oct 18", tag: "Pending" },
  ];

  const recentAnnouncements = [
    { primary: "Mid-semester exam schedule released", secondary: "Posted by Admin · 2 days ago" },
    { primary: "Faculty meeting rescheduled to Oct 14", secondary: "Posted by Admin · 3 days ago" },
  ];

  const upcomingEvents = [
    { primary: "Annual Sports Meet", secondary: "Oct 18, 8:00 AM", tag: "Organizing" },
    { primary: "Guest Lecture: AI in Industry", secondary: "Oct 22, 2:00 PM", tag: "Attending" },
  ];

  const attendanceDisplay = loadingAttendance
    ? "…"
    : attendanceAvg !== null
    ? `${attendanceAvg}% avg`
    : "—";

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p style={{ color: colors.textSecondary }}>Here's your teaching snapshot for today.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Static placeholder - requires a Timetable module (not yet built) */}
          <StatCard
            icon={<FiBookOpen size={20} />}
            label="Today's Classes"
            value={todaysClasses.length}
            accentColor="#9333ea"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Now wired to real data - average attendance across this faculty's subjects */}
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Attendance Summary"
            value={attendanceDisplay}
            accentColor="#16a34a"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Static placeholder - no Tasks module exists yet */}
          <StatCard
            icon={<FiClipboard size={20} />}
            label="Pending Tasks"
            value={pendingTasks.length}
            accentColor="#dc2626"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Static placeholder - Events module arrives in Phase 6 */}
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Upcoming Events"
            value={upcomingEvents.length}
            accentColor="#2563eb"
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Today's Classes" items={todaysClasses} />
        </div>
        <div className="col-12 col-lg-6">
          <ListCard title="Pending Tasks" items={pendingTasks} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Recent Announcements" items={recentAnnouncements} />
        </div>
        <div className="col-12 col-lg-6">
          <ListCard title="Upcoming Events" items={upcomingEvents} />
        </div>
      </div>
    </MainLayout>
  );
}

export default FacultyDashboard;