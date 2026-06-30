import { FiUsers, FiUserCheck, FiGrid, FiCalendar } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/dashboard/StatCard";
import ListCard from "../../components/dashboard/ListCard";
import ChartPlaceholder from "../../components/dashboard/ChartPlaceholder";

function AdminDashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const recentActivities = [
    { primary: "New student registered - Riya Shah", secondary: "5 minutes ago" },
    { primary: "Faculty added to Computer Science dept.", secondary: "1 hour ago" },
    { primary: "New event created: Annual Sports Meet", secondary: "3 hours ago" },
    { primary: "Announcement posted by Admin", secondary: "Yesterday" },
  ];

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
          <StatCard icon={<FiUsers size={20} />} label="Total Students" value="1,248" accentColor="#2563eb" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard icon={<FiUserCheck size={20} />} label="Total Faculty" value="86" accentColor="#9333ea" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard icon={<FiGrid size={20} />} label="Departments" value="12" accentColor="#16a34a" />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard icon={<FiCalendar size={20} />} label="Active Events" value="7" accentColor="#f59e0b" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-6">
          <ChartPlaceholder title="Attendance Analytics" />
        </div>
        <div className="col-12 col-lg-6">
          <ChartPlaceholder title="Students per Department" />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12">
          <ListCard title="Recent Activities" items={recentActivities} />
        </div>
      </div>
    </MainLayout>
  );
}

export default AdminDashboard;