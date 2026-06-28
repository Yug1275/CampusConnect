import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Welcome, {user?.name}</h2>
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>
      <p className="text-muted">Role: {user?.role}</p>
      <p>
        This is a placeholder dashboard. Full role-specific dashboards will be
        built in Phase 3.
      </p>
    </div>
  );
}

export default Dashboard;