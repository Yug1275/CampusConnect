import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand mb-0 h1">CampusConnect</span>

      <div className="d-flex align-items-center text-white">
        <span className="me-3">
          {user?.name}
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;