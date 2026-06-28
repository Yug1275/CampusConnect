import { FiCheckCircle, FiCalendar, FiBookOpen, FiAward } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";

function StudentDashboard() {
  const { user } = useAuth();

  // Placeholder data - will be replaced with real API data in later phases
  const upcomingEvents = [
    { primary: "Coding Club Hackathon", secondary: "Oct 12, 10:00 AM", tag: "Registered" },
    { primary: "Annual Sports Meet", secondary: "Oct 18, 8:00 AM", tag: "Open" },
    { primary: "Guest Lecture: AI in Industry", secondary: "Oct 22, 2:00 PM", tag: "Open" },
  ];

  const todaysClasses = [
    { primary: "Data Structures", secondary: "9:00 AM - 10:00 AM, Room 204" },
    { primary: "Database Management Systems", secondary: "10:15 AM - 11:15 AM, Room 110" },
    { primary: "Computer Networks", secondary: "1:00 PM - 2:00 PM, Lab 3" },
  ];

  const recentAnnouncements = [
    { primary: "Mid-semester exam schedule released", secondary: "Posted by Admin · 2 days ago" },
    { primary: "Library hours extended for exam week", secondary: "Posted by Faculty · 4 days ago" },
  ];

  const badges = ["High Attendance", "Top Performer", "Event Participant"];

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: "#1e293b" }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p style={{ color: "#64748b" }}>Here's your academic snapshot for today.</p>
      </div>

      {/* Stat cards grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiCheckCircle size={20} />}
            label="Attendance"
            value="92%"
            accentColor="#16a34a"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiCalendar size={20} />}
            label="Upcoming Events"
            value={upcomingEvents.length}
            accentColor="#2563eb"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiBookOpen size={20} />}
            label="Today's Classes"
            value={todaysClasses.length}
            accentColor="#9333ea"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            icon={<FiAward size={20} />}
            label="Badges Earned"
            value={badges.length}
            accentColor="#f59e0b"
          />
        </div>
      </div>

      {/* List cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Today's Classes" items={todaysClasses} />
        </div>
        <div className="col-12 col-lg-6">
          <ListCard title="Upcoming Events" items={upcomingEvents} />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ListCard title="Recent Announcements" items={recentAnnouncements} />
        </div>

        {/* Achievement badges */}
        <div className="col-12 col-lg-6">
          <div
            className="p-4 h-100"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <h6 style={{ color: "#1e293b", fontWeight: 700, fontSize: "1rem" }} className="mb-3">
              Achievement Badges
            </h6>
            <div className="d-flex flex-wrap gap-2">
              {badges.map((badge, index) => (
                <span
                  key={index}
                  className="px-3 py-2 d-flex align-items-center"
                  style={{
                    backgroundColor: "#fffbeb",
                    color: "#92400e",
                    border: "1px solid #fde68a",
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
    </MainLayout>
  );
}

export default StudentDashboard;