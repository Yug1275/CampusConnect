import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get("/health");
        setStatus(response.data);
      } catch (err) {
        setError("Unable to connect to the backend server.");
      }
    };

    checkHealth();
  }, []);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center text-center px-3"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      <h1 style={{ fontWeight: 700, color: "#1e293b", fontSize: "2.4rem" }}>
        CampusConnect
      </h1>
      <p style={{ color: "#64748b", fontSize: "1.05rem" }} className="mb-4">
        One Platform for Students, Faculty &amp; Campus Life
      </p>

      <div className="d-flex gap-3 mb-5">
        <Link
          to="/login"
          className="btn text-white px-4 py-2"
          style={{ backgroundColor: "#2563eb", borderRadius: "8px", fontWeight: 600 }}
        >
          Login
        </Link>
        <Link
          to="/register"
          className="btn px-4 py-2"
          style={{
            backgroundColor: "#fff",
            color: "#2563eb",
            border: "1px solid #2563eb",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Register
        </Link>
      </div>

      <div
        className="px-4 py-2 rounded-pill d-inline-flex align-items-center"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #e2e8f0",
          fontSize: "0.85rem",
        }}
      >
        {error && (
          <span style={{ color: "#dc2626" }}>● {error}</span>
        )}
        {!error && !status && <span style={{ color: "#94a3b8" }}>● Checking server status...</span>}
        {status && <span style={{ color: "#16a34a" }}>● {status.message}</span>}
      </div>
    </div>
  );
}

export default Home;