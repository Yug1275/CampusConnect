import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

function Dashboard() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <h2>Welcome, {user?.name}</h2>
      <p className="text-muted">Role: {user?.role}</p>
      <p>
        This is a placeholder dashboard. Role-specific dashboards will be built
        in the next tasks of this phase.
      </p>
    </MainLayout>
  );
}

export default Dashboard;