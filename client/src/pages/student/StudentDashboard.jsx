import CampusMapCard from "../../components/dashboard/CampusMapCard";
import { useState, useEffect } from "react";
import { FiCheckCircle, FiCalendar, FiBookOpen, FiAward, FiUsers } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import { getMyAttendanceSummary } from "../../services/attendanceService";
import { getMyRegistrations } from "../../services/eventService";
import { getMyClubs } from "../../services/clubService";

function StudentDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [upcomingEventsList, setUpcomingEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [clubCount, setClubCount] = useState(null);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await getMyAttendanceSummary();
        setAttendancePercentage(response.data.overall.percentage);
      } catch (err) {
        setAttendancePercentage(null);
      } finally {
        setLoadingAttendance(false);
      }
    };
    fetchAttendance();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getMyRegistrations();
        const now = new Date();
        const upcoming = response.data.registrations
          .filter((reg) => reg.event && new Date(reg.event.date) >= now)
          .sort((a, b) => new Date(a.event.date) - new Date(b.event.date))
          .slice(0, 5)
          .map((reg) => ({
            primary: reg.event.title,
            secondary: new Date(reg.event.date).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
            tag: "Registered",
          }));
        setUpcomingEventsList(upcoming);
      } catch (err) {
        setUpcomingEventsList([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await getMyClubs();
        setClubCount(response.data.count);
      } catch (err) {
        setClubCount(null);
      } finally {
        setLoadingClubs(false);
      }
    };
    fetchClubs();
  }, []);

  // Static placeholder - Today's Classes requires a Timetable module (not yet built)
  const todaysClasses = [
    { primary: "Data Structures", secondary: "9:00 AM - 10:00 AM, Room 204" },
    { primary: "Database Management Systems", secondary: "10:15 AM - 11:15 AM, Room 110" },
    { primary: "Computer Networks", secondary: "1:00 PM - 2:00 PM, Lab 3" },
  ];

  const recentAnnouncements = [
    { primary: "Mid-semester exam schedule released", secondary: "Posted by Admin · 2 days ago" },
    { primary: "Library hours extended for exam week", secondary: "Posted by Faculty · 4 days ago" },
  ];

  // Static placeholder - real Achievement Badges arrive in Phase 10
  const badges = ["High Attendance", "Top Performer", "Event Participant"];

  const attendanceDisplay = loadingAttendance
    ? "…"
    : attendancePercentage !== null
    ? `${attendancePercentage}%`
    : "—";
  const attendanceAccent =
    attendancePercentage !== null && attendancePercentage < 75 ? "#f59e0b" : "#16a34a";

  const eventsDisplay = loadingEvents ? "…" : upcomingEventsList.length;
  const clubsDisplay = loadingClubs ? "…" : clubCount !== null ? clubCount : "—";

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p style={{ color: colors.textSecondary }}>Here's your academic snapshot for today.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Wired to real data - Phase 5 */}
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Attendance"
            value={attendanceDisplay}
            accentColor={attendanceAccent}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Now wired to real data - registered upcoming events (Phase 6) */}
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Upcoming Events"
            value={eventsDisplay}
            accentColor="#2563eb"
          />
        </div>
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
          {/* Now wired to real data - club memberships (Phase 6) */}
          <StatCard
            icon={<FiUsers size={20} />}
            label="My Clubs"
            value={clubsDisplay}
            accentColor="#f59e0b"
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Today's Classes" items={todaysClasses} />
        </div>
        <div className="col-12 col-lg-6">
          <ListCard
            title="Upcoming Events"
            items={upcomingEventsList}
            emptyText="You haven't registered for any upcoming events."
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Recent Announcements" items={recentAnnouncements} />
        </div>

        <div className="col-12 col-lg-6">
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
              Achievement Badges
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-2 d-flex align-items-center"
                  style={{
                    backgroundColor: theme === "light" ? "#fffbeb" : "#3a2e0f",
                    color: theme === "light" ? "#92400e" : "#fcd34d",
                    border: `1px solid ${theme === "light" ? "#fde68a" : "#78350f"}`,
                    borderRadius: "20px",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                  }}
                >
                  <FiAward size={14} className="me-2" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <CampusMapCard />
    </MainLayout>
  );
}

export default StudentDashboard;