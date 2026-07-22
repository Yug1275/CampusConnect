import { useState, useEffect } from "react";
import { FiStar, FiSend, FiEyeOff, FiMessageSquare } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import {
  getInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";
import { submitFeedback, getMyFeedback } from "../../services/feedbackService";
import { getFaculty } from "../../services/facultyService";
import { getSubjects } from "../../services/subjectService";

function SubmitFeedback() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [facultyList, setFacultyList] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [formData, setFormData] = useState({
    targetType: "general",
    targetFaculty: "",
    targetSubject: "",
    rating: 0,
    message: "",
    isAnonymous: false,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await getMyFeedback();
      setMyFeedback(response.data.feedback);
    } catch (err) {
      setMyFeedback([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    getFaculty({ limit: 500 })
      .then((res) => setFacultyList(res.data.faculty))
      .catch(() => {});
    getSubjects()
      .then((res) => setSubjects(res.data.subjects))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const payload = {
      targetType: formData.targetType,
      targetFaculty: formData.targetType === "faculty" ? formData.targetFaculty : undefined,
      targetSubject: formData.targetType === "subject" ? formData.targetSubject : undefined,
      rating: formData.rating || undefined,
      message: formData.message,
      isAnonymous: formData.isAnonymous,
    };

    try {
      await submitFeedback(payload);
      setMessage("Feedback submitted successfully. Thank you!");
      setFormData({
        targetType: "general",
        targetFaculty: "",
        targetSubject: "",
        rating: 0,
        message: "",
        isAnonymous: false,
      });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Submit Feedback</h2>
        <p style={{ color: colors.textSecondary }}>
          Share your thoughts on campus life, faculty, or subjects.
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

      <div className="row g-3">
        {/* Submission form */}
        <div className="col-12 col-lg-7">
          <div
            className="p-3 p-sm-4"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label style={getLabelStyle(colors)} className="form-label d-block">
                  Feedback About
                </label>
                <select
                  name="targetType"
                  className="form-select"
                  style={getInputStyle(colors)}
                  value={formData.targetType}
                  onChange={handleChange}
                >
                  <option value="general">General / Campus</option>
                  <option value="faculty">A Specific Faculty Member</option>
                  <option value="subject">A Specific Subject</option>
                </select>
              </div>

              {formData.targetType === "faculty" && (
                <div className="mb-3">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    Select Faculty
                  </label>
                  <select
                    name="targetFaculty"
                    className="form-select"
                    style={getInputStyle(colors)}
                    value={formData.targetFaculty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select faculty member</option>
                    {facultyList.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.targetType === "subject" && (
                <div className="mb-3">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    Select Subject
                  </label>
                  <select
                    name="targetSubject"
                    className="form-select"
                    style={getInputStyle(colors)}
                    value={formData.targetSubject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select subject</option>
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-3">
                <label style={getLabelStyle(colors)} className="form-label d-block">
                  Rating (optional)
                </label>
                <div className="d-flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: formData.rating === star ? 0 : star })}
                      className="btn border-0 bg-transparent p-1"
                    >
                      <FiStar
                        size={24}
                        color={star <= formData.rating ? "#f59e0b" : colors.border}
                        fill={star <= formData.rating ? "#f59e0b" : "none"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label style={getLabelStyle(colors)} className="form-label d-block">
                  Message
                </label>
                <textarea
                  name="message"
                  className="form-control"
                  style={{ ...getInputStyle(colors), resize: "vertical" }}
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share your feedback..."
                  required
                />
              </div>

              <div className="mb-4 d-flex align-items-center">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="me-2"
                />
                <label htmlFor="isAnonymous" style={{ color: colors.textSecondary, fontSize: "0.88rem" }} className="mb-0">
                  <FiEyeOff size={13} className="me-1" /> Submit anonymously (faculty won't see your name)
                </label>
              </div>

              <button
                type="submit"
                className="btn text-white w-100 d-flex align-items-center justify-content-center py-2"
                style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                <FiSend size={15} className="me-2" /> {saving ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
          </div>
        </div>

        {/* History */}
        <div className="col-12 col-lg-5">
          <div
            className="p-3 p-sm-4"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
              maxHeight: "520px",
              overflowY: "auto",
            }}
          >
            <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-3">
              My Submitted Feedback
            </h6>

            {loadingHistory ? (
              <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>Loading...</p>
            ) : myFeedback.length === 0 ? (
              <div className="text-center py-4">
                <FiMessageSquare size={26} color={colors.textMuted} className="mb-2" />
                <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.85rem" }}>
                  You haven't submitted any feedback yet.
                </p>
              </div>
            ) : (
              myFeedback.map((f) => (
                <div key={f._id} className="py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <span
                      className="px-2 py-1"
                      style={{
                        backgroundColor: colors.activeLinkBg,
                        color: colors.activeLinkColor,
                        borderRadius: "6px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {f.targetType === "faculty"
                        ? f.targetFaculty?.name || "Faculty"
                        : f.targetType === "subject"
                        ? f.targetSubject?.name || "Subject"
                        : "General"}
                    </span>
                    {f.rating && (
                      <span style={{ color: "#f59e0b", fontSize: "0.8rem" }}>
                        {"★".repeat(f.rating)}
                      </span>
                    )}
                  </div>
                  <p className="mb-1" style={{ color: colors.textSecondary, fontSize: "0.83rem" }}>
                    {f.message}
                  </p>
                  <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.72rem" }}>
                    {new Date(f.createdAt).toLocaleDateString()} · {f.status === "reviewed" ? "Reviewed" : "Pending"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default SubmitFeedback;