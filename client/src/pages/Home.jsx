import { useEffect, useState } from "react";
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
    <div className="container mt-5">
      <h1>CampusConnect</h1>
      <p>One Platform for Students, Faculty &amp; Campus Life</p>

      <div className="mt-4">
        <h5>Backend Connection Status</h5>
        {error && <p className="text-danger">{error}</p>}
        {!error && !status && <p className="text-muted">Checking connection...</p>}
        {status && (
          <div className="text-success">
            <p>{status.message}</p>
            <small>Last checked: {status.timestamp}</small>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;