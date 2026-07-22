import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiPhone, FiDroplet } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getMyProfile } from "../../services/userService";

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

function DigitalID() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then((res) => setProfile(res.data.user))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const qrValue = JSON.stringify({
    type: "campusconnect-student-id",
    id: user?._id,
    name: user?.name,
    rollNumber: profile?.rollNumber,
  });

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Digital Student ID</h2>
        <p style={{ color: colors.textSecondary }}>Your official campus identification card.</p>
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading...</p>
      ) : (
        <div
          id="student-id-card"
          className="mx-auto p-4"
          style={{
            maxWidth: "380px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
            border: "1px solid #334155",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>CampusConnect</span>
            <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>STUDENT ID</span>
          </div>

          <div className="d-flex align-items-center mb-3">
            {profile?.profileImage ? (
              <img
                src={`${API_BASE}${profile.profileImage}`}
                alt={user?.name}
                style={{ width: "72px", height: "72px", borderRadius: "12px", objectFit: "cover", marginRight: "16px" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "12px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                }}
              >
                {user?.name?.[0]}
              </div>
            )}
            <div>
              <h5 style={{ color: "#fff", fontWeight: 700, marginBottom: "2px" }}>{user?.name}</h5>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: "2px" }}>
                {profile?.department || "—"}
              </p>
              <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginBottom: 0 }}>
                Semester {profile?.semester || "—"}
              </p>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-end">
            <div>
              <div className="mb-2">
                <p style={{ color: "#64748b", fontSize: "0.68rem", marginBottom: "1px" }}>ROLL NUMBER</p>
                <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.9rem", marginBottom: 0 }}>
                  {profile?.rollNumber || "—"}
                </p>
              </div>
              <div className="d-flex align-items-center mb-1" style={{ color: "#cbd5e1", fontSize: "0.78rem" }}>
                <FiDroplet size={13} className="me-2" /> Blood Group: {profile?.bloodGroup || "—"}
              </div>
              <div className="d-flex align-items-center" style={{ color: "#cbd5e1", fontSize: "0.78rem" }}>
                <FiPhone size={13} className="me-2" /> Emergency: {profile?.emergencyContact || "—"}
              </div>
            </div>

            <div className="p-2" style={{ backgroundColor: "#fff", borderRadius: "10px" }}>
              <QRCodeSVG value={qrValue} size={70} />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default DigitalID;