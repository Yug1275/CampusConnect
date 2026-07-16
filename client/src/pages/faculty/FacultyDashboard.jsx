import { useState, useEffect } from "react";
import { FiBookOpen, FiCheckCircle, FiClipboard, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import { getFacultyAttendanceSummary } from "../../services/attendanceService";
import { getEvents } from "../../services/eventService";
import { getAnnouncements } from "../../services/announcementService";

const timeAgo = (isoString) => {
  const diffMs = new Date() - new Date(isoString);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return new Date(isoString).toLocaleDateString(undefined, { day: "2-digit", month: "short" });
};

function FacultyDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [attendanceAvg, setAttendanceAvg] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [myUpcomingEvents, setMyUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents({ filter: "upcoming" });
        const mine = response.data.events
          .filter((ev) => ev.createdBy?._id === user._id)
          .slice(0, 5)
          .map((ev) => ({
            primary: ev.title,
            secondary: new Date(ev.date).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
            tag: "Organizing",
          }));
        setMyUpcomingEvents(mine);
      } catch (err) {
        setMyUpcomingEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    if (user?._id) fetchEvents();
  }, [user]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        const recent = response.data.announcements.slice(0, 3).map((a) => ({
          primary: a.title,
          secondary: `Posted by ${a.createdBy?.name || "Unknown"} · ${timeAgo(a.createdAt)}`,
        }));
        setRecentAnnouncements(recent);
      } catch (err) {
        setRecentAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Static placeholders - Today's Classes requires a Timetable module (not yet built),
  // Pending Tasks requires a Tasks module from a later phase.
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

  const attendanceDisplay = loadingAttendance
    ? "…"
    : attendanceAvg !== null
    ? `${attendanceAvg}% avg`
    : "—";

  const eventsDisplay = loadingEvents ? "…" : myUpcomingEvents.length;

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
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Upcoming Events"
            value={eventsDisplay}
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
          {/* Now wired to real data - Task 1's relevance-filtered announcements */}
          <ListCard
            title="Recent Announcements"
            items={loadingAnnouncements ? [] : recentAnnouncements}
            emptyText={loadingAnnouncements ? "Loading announcements..." : "No announcements right now."}
          />
        </div>
        <div className="col-12 col-lg-6">
          <ListCard
            title="Upcoming Events"
            items={myUpcomingEvents}
            emptyText="You haven't organized any upcoming events."
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default FacultyDashboard;