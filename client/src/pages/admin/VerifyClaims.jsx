import { useState, useEffect } from "react";
import { FiCheckCircle, FiUser, FiTag } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getAlertSuccessStyle, getAlertErrorStyle, primaryButtonStyle } from "../../styles/authStyles";
import { getItems, verifyClaim } from "../../services/lostFoundService";

function VerifyClaims() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await getItems({ status: "claimed" });
      setClaims(response.data.items);
    } catch (err) {
      setError("Failed to load pending claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleVerify = async (id) => {
    setVerifyingId(id);
    setError("");
    try {
      await verifyClaim(id);
      setMessage("Claim verified successfully");
      fetchClaims();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to verify claim");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Verify Claims</h2>
        <p style={{ color: colors.textSecondary }}>
          Confirm that claimed items have been correctly returned to their owners.
        </p>
      </div>

      {message && (
        <div className="px-3 py-2 mb-3" style={getAlertSuccessStyle(colors)}>
          {message}
        </div>
      )}
      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading pending claims...</p>
      ) : claims.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
        >
          <FiCheckCircle size={30} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>No pending claims to verify.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {claims.map((item) => (
            <div
              key={item._id}
              className="p-4 d-flex flex-wrap justify-content-between align-items-center gap-3"
              style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
            >
              <div className="d-flex align-items-center">
                <span
                  className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                  style={{ width: "44px", height: "44px", borderRadius: "10px", backgroundColor: "#f59e0b15", color: "#f59e0b" }}
                >
                  <FiTag size={20} />
                </span>
                <div>
                  <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-1">
                    {item.itemName}
                  </h6>
                  <div className="d-flex flex-wrap gap-3" style={{ fontSize: "0.8rem", color: colors.textSecondary }}>
                    <span className="d-flex align-items-center">
                      <FiUser size={13} className="me-1" /> Found by: {item.reportedBy?.name}
                    </span>
                    <span className="d-flex align-items-center">
                      <FiUser size={13} className="me-1" /> Claimed by: {item.claimedBy?.name}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleVerify(item._id)}
                disabled={verifyingId === item._id}
                className="btn text-white d-flex align-items-center px-4 py-2"
                style={{ ...primaryButtonStyle, opacity: verifyingId === item._id ? 0.7 : 1 }}
              >
                <FiCheckCircle size={15} className="me-2" />
                {verifyingId === item._id ? "Verifying..." : "Verify Claim"}
              </button>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default VerifyClaims;