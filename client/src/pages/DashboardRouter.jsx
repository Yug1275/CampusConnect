import { useAuth } from "../context/AuthContext";
import StudentDashboard from "./student/StudentDashboard";
import FacultyDashboard from "./faculty/FacultyDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import MainLayout from "../components/layout/MainLayout";

// Renders the correct dashboard based on the logged-in user's role.
// ProtectedRoute (Phase 2) already guarantees `user` exists before this renders.
function DashboardRouter() {
  const { user } = useAuth();

  switch (user?.role) {
    case "student":
      return <StudentDashboard />;
    case "faculty":
      return <FacultyDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      // Defensive fallback - should not normally occur since role is
      // restricted to a fixed enum on the backend User model
      return (
        <MainLayout>
          <div
            className="p-4"
            style={{
              backgroundColor: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
            }}
          >
            <p className="mb-0" style={{ color: "#475569" }}>
              Unable to determine your dashboard. Please log out and log in
              again, or contact an administrator.
            </p>
          </div>
        </MainLayout>
      );
  }
}

export default DashboardRouter;