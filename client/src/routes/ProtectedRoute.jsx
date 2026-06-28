import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Optionally restrict by role: <ProtectedRoute allowedRoles={["admin"]}>
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;