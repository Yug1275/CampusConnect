import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import LineChartCard from "../../components/dashboard/LineChartCard";
import BarChartCard from "../../components/dashboard/BarChartCard";
import DoughnutChartCard from "../../components/dashboard/DoughnutChartCard";
import {
  getAttendanceTrend,
  getStudentsPerDepartment,
  getFacultyDistribution,
  getClubMembershipStats,
  getEventParticipationStats,
} from "../../services/analyticsService";

function Analytics() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [studentsPerDept, setStudentsPerDept] = useState([]);
  const [facultyDist, setFacultyDist] = useState([]);
  const [clubStats, setClubStats] = useState([]);
  const [eventStats, setEventStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendRes, studentsRes, facultyRes, clubRes, eventRes] = await Promise.all([
          getAttendanceTrend(),
          getStudentsPerDepartment(),
          getFacultyDistribution(),
          getClubMembershipStats(),
          getEventParticipationStats(),
        ]);
        setAttendanceTrend(trendRes.data.trend);
        setStudentsPerDept(studentsRes.data.data);
        setFacultyDist(facultyRes.data.data);
        setClubStats(clubRes.data.data);
        setEventStats(eventRes.data.data);
      } catch (err) {
        // Individual cards handle their own empty states; a total failure
        // just leaves all datasets empty, which each card already renders gracefully.
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Analytics</h2>
        <p style={{ color: colors.textSecondary }}>
          Campus-wide insights across attendance, departments, clubs, and events.
        </p>
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading analytics...</p>
      ) : (
        <>
          <div className="row g-3 mb-3">
            <div className="col-12">
              <LineChartCard
                title="Attendance Trend (Last 14 Days)"
                labels={attendanceTrend.map((t) => t.date)}
                values={attendanceTrend.map((t) => t.percentage)}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-lg-6">
              <BarChartCard
                title="Students per Department"
                labels={studentsPerDept.map((d) => d.department)}
                values={studentsPerDept.map((d) => d.count)}
                color="#2563eb"
                horizontal
              />
            </div>
            <div className="col-12 col-lg-6">
              <BarChartCard
                title="Faculty Distribution"
                labels={facultyDist.map((d) => d.department)}
                values={facultyDist.map((d) => d.count)}
                color="#9333ea"
                horizontal
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-lg-6">
              <DoughnutChartCard
                title="Club Membership"
                labels={clubStats.map((c) => c.club)}
                values={clubStats.map((c) => c.count)}
              />
            </div>
            <div className="col-12 col-lg-6">
              <BarChartCard
                title="Top Events by Participation"
                labels={eventStats.map((e) => e.event)}
                values={eventStats.map((e) => e.count)}
                color="#f59e0b"
              />
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default Analytics;