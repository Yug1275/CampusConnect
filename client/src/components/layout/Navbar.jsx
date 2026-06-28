import { FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        height: "64px",
        backgroundColor: "#1e293b",
        borderBottom: "1px solid #334155",
      }}
    >
      <div className="d-flex align-items-center">
        <span
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "0.3px",
          }}
        >
          CampusConnect
        </span>
      </div>

      <div className="d-flex align-items-center">
        <div
          className="d-flex align-items-center me-3 px-3 py-1"
          style={{
            backgroundColor: "#334155",
            borderRadius: "20px",
          }}
        >
          <FiUser size={16} color="#cbd5e1" className="me-2" />
          <span style={{ color: "#e2e8f0", fontSize: "0.9rem" }}>
            {user?.name}
          </span>
          <span
            className="ms-2 px-2 py-0"
            style={{
              backgroundColor: "#475569",
              color: "#cbd5e1",
              fontSize: "0.7rem",
              borderRadius: "10px",
              textTransform: "capitalize",
            }}
          >
            {user?.role}
          </span>
        </div>

        <button
          onClick={logout}
          className="btn d-flex align-items-center border-0"
          style={{
            backgroundColor: "transparent",
            color: "#cbd5e1",
            fontSize: "0.9rem",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
        >
          <FiLogOut size={16} className="me-1" />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;