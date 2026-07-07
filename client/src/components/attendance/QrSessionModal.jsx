import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FiRefreshCw, FiClock } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import Modal from "../ui/Modal";
import { primaryButtonStyle, getAlertErrorStyle } from "../../styles/authStyles";
import { generateQrSession, getActiveQrSession } from "../../services/attendanceSessionService";

// Encodes a simple payload the student's scan page (Task 8) can parse.
const buildQrValue = (sessionToken) =>
  JSON.stringify({ type: "campusconnect-attendance", token: sessionToken });

function QrSessionModal({ isOpen, onClose, subjectId, date, subjectLabel }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [session, setSession] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  const startCountdown = (expiresAt) => {
    clearInterval(timerRef.current);
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - new Date()) / 1000));
      setSecondsLeft(diff);
      if (diff <= 0) clearInterval(timerRef.current);
    };
    tick();
    timerRef.current = setInterval(tick, 1000);
  };

  const loadOrCreateSession = async () => {
    setLoading(true);
    setError("");
    try {
      const activeRes = await getActiveQrSession(subjectId, date);
      if (activeRes.data.session) {
        setSession(activeRes.data.session);
        startCountdown(activeRes.data.session.expiresAt);
      } else {
        const genRes = await generateQrSession(subjectId, date);
        setSession(genRes.data.session);
        startCountdown(genRes.data.session.expiresAt);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate QR session");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const genRes = await generateQrSession(subjectId, date);
      setSession(genRes.data.session);
      startCountdown(genRes.data.session.expiresAt);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to regenerate QR session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && subjectId && date) {
      loadOrCreateSession();
    }
    return () => clearInterval(timerRef.current);
  }, [isOpen, subjectId, date]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  const isExpired = session && secondsLeft <= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="QR Attendance Session">
      <div className="text-center">
        <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }} className="mb-3">
          {subjectLabel}
        </p>

        {error && (
          <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
            {error}
          </div>
        )}

        {loading && !session ? (
          <p style={{ color: colors.textSecondary }}>Generating session...</p>
        ) : session ? (
          <>
            <div
              className="d-inline-flex p-3 mb-3"
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                opacity: isExpired ? 0.3 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              <QRCodeSVG value={buildQrValue(session.sessionToken)} size={200} />
            </div>

            <div
              className="d-flex align-items-center justify-content-center gap-2 mb-3"
              style={{
                color: isExpired ? "#dc2626" : colors.textPrimary,
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              <FiClock size={18} />
              {isExpired ? "Expired" : `${minutes}:${seconds}`}
            </div>

            <p style={{ color: colors.textMuted, fontSize: "0.82rem" }} className="mb-4">
              Students can scan this code to mark themselves present. It expires 5 minutes after generation.
            </p>

            <button
              onClick={regenerate}
              disabled={loading}
              className="btn text-white d-inline-flex align-items-center px-4 py-2"
              style={{ ...primaryButtonStyle, opacity: loading ? 0.7 : 1 }}
            >
              <FiRefreshCw size={16} className="me-2" />
              {isExpired ? "Generate New Code" : "Regenerate"}
            </button>
          </>
        ) : null}
      </div>
    </Modal>
  );
}

export default QrSessionModal;