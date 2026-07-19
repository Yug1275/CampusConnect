import { useState, useEffect } from "react";
import { FiStar, FiCheck, FiClock, FiEyeOff, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getAlertErrorStyle } from "../../styles/authStyles";
import {
  getFeedbackForFaculty,
  getAllFeedback,
  updateFeedbackStatus,
} from "../../services/feedbackService";

function FeedbackReview() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const isAdmin = user?.role === "admin";

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = isAdmin ? await getAllFeedback() : await getFeedbackForFaculty();
      setFeedback(response.data.feedback);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [isAdmin]);

  const handleMarkReviewed = async (id) => {
    setUpdatingId(id);
    try {
      await updateFeedbackStatus(id, "reviewed");
      setFeedback((prev) => prev.map((f) => (f._id === id ? { ...f, status: "reviewed" } : f)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = filterStatus === "all" ? feedback : feedback.filter((f) => f.status === filterStatus);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>
          {isAdmin ? "All Feedback" : "Feedback For You"}
        </h2>
        <p style={{ color: colors.textSecondary }}>
          {isAdmin
            ? "Review all feedback submitted across the platform."
            : "Feedback submitted by students about you or your subjects."}
        </p>
      </div>

      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      <div
        className="d-inline-flex mb-4"
        style={{ backgroundColor: colors.cardBg, borderRadius: "10px", border: `1px solid ${colors.border}`, padding: "4px" }}
      >
        {["all", "new", "reviewed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="btn px-3 py-2 text-capitalize"
            style={{
              backgroundColor: filterStatus === s ? colors.activeLinkColor : "transparent",
              color: filterStatus === s ? "#fff" : colors.textSecondary,
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.82rem",
              border: "none",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading feedback...</p>
      ) : filtered.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
        >
          <p className="mb-0" style={{ color: colors.textMuted }}>No feedback to show.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((f) => (
            <div
              key={f._id}
              className="p-4"
              style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <span
                    className="px-2 py-1 text-capitalize"
                    style={{ backgroundColor: colors.activeLinkBg, color: colors.activeLinkColor, borderRadius: "6px", fontSize: "0.72rem", fontWeight: 600 }}
                  >
                    {f.targetType === "faculty" ? f.targetFaculty?.name || "Faculty" : f.targetType === "subject" ? f.targetSubject?.name || "Subject" : "General"}
                  </span>
                  {f.status === "reviewed" ? (
                    <span className="d-flex align-items-center px-2 py-1" style={{ backgroundColor: "#16a34a15", color: "#16a34a", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                      <FiCheck size={11} className="me-1" /> Reviewed
                    </span>
                  ) : (
                    <span className="d-flex align-items-center px-2 py-1" style={{ backgroundColor: "#f59e0b15", color: "#f59e0b", borderRadius: "6px", fontSize: "0.72rem", fontWeight: 700 }}>
                      <FiClock size={11} className="me-1" /> New
                    </span>
                  )}
                </div>
                {f.rating && <span style={{ color: "#f59e0b" }}>{"★".repeat(f.rating)}</span>}
              </div>

              <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }} className="mb-2">{f.message}</p>

              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center" style={{ fontSize: "0.78rem", color: colors.textMuted }}>
                  {f.isAnonymous ? (
                    <><FiEyeOff size={13} className="me-1" /> Anonymous{isAdmin && f.student?.name ? ` (${f.student.name})` : ""}</>
                  ) : (
                    <><FiUser size={13} className="me-1" /> {f.student?.name || "Unknown"}</>
                  )}
                  <span className="ms-2">· {new Date(f.createdAt).toLocaleDateString()}</span>
                </div>

                {f.status === "new" && (
                  <button
                    onClick={() => handleMarkReviewed(f._id)}
                    disabled={updatingId === f._id}
                    className="btn px-3 py-1"
                    style={{ backgroundColor: colors.activeLinkBg, color: colors.activeLinkColor, borderRadius: "8px", fontWeight: 600, fontSize: "0.78rem" }}
                  >
                    {updatingId === f._id ? "Updating..." : "Mark Reviewed"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default FeedbackReview;