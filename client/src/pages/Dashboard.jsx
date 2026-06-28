import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

function Dashboard() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: "#1e293b" }}>
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p style={{ color: "#64748b" }}>
          Here's what's happening with your account today.
        </p>
      </div>

      <div
        className="p-4"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <p className="mb-0" style={{ color: "#475569" }}>
          This is a placeholder dashboard. Role-specific dashboards with
          stats and widgets will be built in the next tasks of this phase.
        </p>
      </div>
    </MainLayout>
  );
}

export default Dashboard;