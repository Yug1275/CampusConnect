import { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiBookOpen,
  FiAward,
  FiStar,
  FiHeart,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import { getMyAttendanceSummary } from "../../services/attendanceService";
import { getMyRegistrations } from "../../services/eventService";
import { getAnnouncements } from "../../services/announcementService";
import { checkAndAwardBadges } from "../../services/badgeService";
import { getStudentDashboardOverview } from "../../services/dashboardService";

// Same relative-time formatter used in the Announcement Feed (Task 3)
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

const BADGE_ICONS = {
  high_attendance: FiCheckCircle,
  club_member: FiAward,
  event_participant: FiCalendar,
  top_performer: FiStar,
  volunteer: FiHeart,
};

const BADGE_COLORS = {
  high_attendance: "#16a34a",
  club_member: "#9333ea",
  event_participant: "#2563eb",
  top_performer: "#f59e0b",
  volunteer: "#dc2626",
};
function StudentDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [attendancePercentage, setAttendancePercentage] = useState(null);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [upcomingEventsList, setUpcomingEventsList] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(true);

  const [todaysClasses, setTodaysClasses] = useState([]);
  const [loadingTodaysClasses, setLoadingTodaysClasses] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await getMyAttendanceSummary();
        setAttendancePercentage(response.data.overall.percentage);
      } catch {
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
      } catch {
        setUpcomingEventsList([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        const recent = response.data.announcements.slice(0, 3).map((a) => ({
          primary: a.title,
          secondary: `Posted by ${a.createdBy?.name || "Unknown"} · ${timeAgo(a.createdAt)}`,
        }));
        setRecentAnnouncements(recent);
      } catch {
        setRecentAnnouncements([]);
      } finally {
        setLoadingAnnouncements(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Trigger badge eligibility check on dashboard load, then fetch the current list -
  // this is how badges get awarded "automatically" without a background job (Task 5)
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await checkAndAwardBadges();
        setBadges(response.data.badges);
      } catch {
        setBadges([]);
      } finally {
        setLoadingBadges(false);
      }
    };
    fetchBadges();
  }, []);

  useEffect(() => {
    const fetchDashboardOverview = async () => {
      try {
        const response = await getStudentDashboardOverview();
        setTodaysClasses(response.data.overview?.todaysClasses || []);
      } catch {
        setTodaysClasses([]);
      } finally {
        setLoadingTodaysClasses(false);
      }
    };
    fetchDashboardOverview();
  }, []);

  const attendanceDisplay = loadingAttendance
    ? "…"
    : attendancePercentage !== null
    ? `${attendancePercentage}%`
    : "—";
  const attendanceAccent =
    attendancePercentage !== null && attendancePercentage < 75 ? "#f59e0b" : "#16a34a";

  const eventsDisplay = loadingEvents ? "…" : upcomingEventsList.length;
  const badgesDisplay = loadingBadges ? "…" : badges.length;

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
          <StatCard icon={<FiCheckCircle size={20} />} label="Attendance" value={attendanceDisplay} accentColor={attendanceAccent} />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard icon={<FiCalendar size={20} />} label="Upcoming Events" value={eventsDisplay} accentColor="#2563eb" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiBookOpen size={20} />}
            label="Today's Classes"
            value={loadingTodaysClasses ? "..." : todaysClasses.length}
            accentColor="#9333ea"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          {/* Now wired to real data - Task 5/6's badge system */}
          <StatCard icon={<FiAward size={20} />} label="Badges Earned" value={badgesDisplay} accentColor="#f59e0b" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard
            title="Today's Classes"
            items={loadingTodaysClasses ? [] : todaysClasses}
            emptyText={
              loadingTodaysClasses
                ? "Loading today's classes..."
                : "No attendance sessions are open for your classes today."
            }
          />
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
          <ListCard
            title="Recent Announcements"
            items={loadingAnnouncements ? [] : recentAnnouncements}
            emptyText={loadingAnnouncements ? "Loading announcements..." : "No announcements right now."}
          />
        </div>

        <div className="col-12 col-lg-6">
          <div
            className="p-4 h-100"
            style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
          >
            <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1rem" }} className="mb-3">
              Achievement Badges
            </h6>
            {loadingBadges ? (
              <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }} className="mb-0">Checking eligibility...</p>
            ) : badges.length === 0 ? (
              <p style={{ color: colors.textMuted, fontSize: "0.85rem" }} className="mb-0">
                No badges earned yet. Keep attending classes, join clubs, and register for events!
              </p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {badges.map((badge) => {
                  const Icon = BADGE_ICONS[badge.type] || FiAward;
                  const color = BADGE_COLORS[badge.type] || "#64748b";
                  return (
                    <span
                      key={badge._id}
                      className="px-3 py-2 d-flex align-items-center"
                      style={{
                        backgroundColor: `${color}15`,
                        color,
                        border: `1px solid ${color}40`,
                        borderRadius: "20px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                      }}
                      title={`Earned ${new Date(badge.awardedAt).toLocaleDateString()}`}
                    >
                      <Icon size={14} className="me-2" />
                      {badge.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default StudentDashboard;