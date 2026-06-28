import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  const linkClass = ({ isActive }) =>
    `nav-link text-white ${isActive ? "bg-primary rounded" : ""}`;

  return (
    <div className="bg-secondary p-3" style={{ width: "220px", minHeight: "100%" }}>
      <ul className="nav flex-column">
        <li className="nav-item mb-1">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
        </li>

        {/* Role-specific links - placeholders for Phase 4 onward */}
        {user?.role === "student" && (
          <li className="nav-item mb-1">
            <NavLink to="/profile" className={linkClass}>
              My Profile
            </NavLink>
          </li>
        )}

        {user?.role === "faculty" && (
          <li className="nav-item mb-1">
            <NavLink to="/profile" className={linkClass}>
              My Profile
            </NavLink>
          </li>
        )}

        {user?.role === "admin" && (
          <li className="nav-item mb-1">
            <NavLink to="/profile" className={linkClass}>
              My Profile
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;