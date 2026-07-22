import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FiPhone, FiDroplet, FiDownload } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { primaryButtonStyle } from "../../styles/authStyles";
import { getMyProfile } from "../../services/userService";

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

function DigitalID() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const isDarkTheme = theme === "dark";
  const cardBackground = isDarkTheme ? "linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #111827 100%)" : colors.cardBg;
  const cardTitleColor = colors.textPrimary;
  const cardSubtitleColor = colors.textSecondary;
  const cardTextColor = colors.textPrimary;
  const cardMutedColor = colors.textSecondary;
  const idBorderColor = isDarkTheme ? "#334155" : colors.border;
  const cardShadow = isDarkTheme ? "0 16px 40px rgba(0,0,0,0.3)" : colors.shadow;
  const idBadgeBg = isDarkTheme ? "#1e3a5f" : colors.activeLinkBg;
  const idBadgeColor = isDarkTheme ? "#93c5fd" : colors.activeLinkColor;
  const qrPanelBg = isDarkTheme ? "#f8fafc" : colors.pageBg;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const cardRef = useRef(null);

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

  const waitForImages = async () => {
    const images = Array.from(cardRef.current?.querySelectorAll("img") || []);

    await Promise.all(
      images.map(
        (image) =>
          new Promise((resolve) => {
            if (image.complete) {
              resolve();
              return;
            }

            image.onload = () => resolve();
            image.onerror = () => resolve();
          })
      )
    );
  };

  const handleDownloadPDF = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      await waitForImages();

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: theme === "dark" ? "#0f172a" : "#ffffff",
        scale: 3,
        useCORS: true,
        allowTaint: false,
        scrollX: 0,
        scrollY: 0,
      });
      const imgData = canvas.toDataURL("image/png");

      // Card is roughly credit-card proportioned - build a matching PDF page
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [100, 130],
      });

      const imgWidth = 90;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 5, 10, imgWidth, imgHeight);
      pdf.save(`${user?.name?.replace(/\s+/g, "_") || "student"}_ID_Card.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Digital Student ID</h2>
        <p style={{ color: colors.textSecondary }}>Your official campus identification card.</p>
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading...</p>
      ) : (
        <>
          <div
            ref={cardRef}
            id="student-id-card"
            className="mx-auto p-4"
            style={{
              maxWidth: "380px",
              borderRadius: "18px",
              background: cardBackground,
              boxShadow: cardShadow,
              border: `1px solid ${idBorderColor}`,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span style={{ color: cardTitleColor, fontWeight: 700, fontSize: "1.1rem" }}>CampusConnect</span>
              <span
                className="px-2 py-1"
                style={{
                  color: idBadgeColor,
                  backgroundColor: idBadgeBg,
                  borderRadius: "999px",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                }}
              >
                STUDENT ID
              </span>
            </div>

            <div className="d-flex align-items-center mb-3">
              {profile?.profileImage ? (
                <img
                  src={`${API_BASE}${profile.profileImage}`}
                  alt={user?.name}
                  crossOrigin="anonymous"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    objectFit: "cover",
                    marginRight: "16px",
                    border: `1px solid ${idBorderColor}`,
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "12px",
                    backgroundColor: isDarkTheme ? "#2563eb" : colors.activeLinkBg,
                    color: isDarkTheme ? "#fff" : colors.activeLinkColor,
                    fontSize: "1.6rem",
                    fontWeight: 700,
                  }}
                >
                  {user?.name?.[0]}
                </div>
              )}
              <div>
                <h5 style={{ color: cardTitleColor, fontWeight: 700, marginBottom: "2px" }}>{user?.name}</h5>
                <p style={{ color: cardSubtitleColor, fontSize: "0.82rem", marginBottom: "2px" }}>
                  {profile?.department || "—"}
                </p>
                <p style={{ color: cardSubtitleColor, fontSize: "0.82rem", marginBottom: 0 }}>
                  Semester {profile?.semester || "—"}
                </p>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-end">
              <div>
                <div className="mb-2">
                  <p style={{ color: cardMutedColor, fontSize: "0.68rem", marginBottom: "1px" }}>ROLL NUMBER</p>
                  <p style={{ color: cardTextColor, fontWeight: 700, fontSize: "0.9rem", marginBottom: 0 }}>
                    {profile?.rollNumber || "—"}
                  </p>
                </div>
                <div className="d-flex align-items-center mb-1" style={{ color: cardTextColor, fontSize: "0.78rem" }}>
                  <FiDroplet size={13} className="me-2" /> Blood Group: {profile?.bloodGroup || "—"}
                </div>
                <div className="d-flex align-items-center" style={{ color: cardTextColor, fontSize: "0.78rem" }}>
                  <FiPhone size={13} className="me-2" /> Emergency: {profile?.emergencyContact || "—"}
                </div>
              </div>

              <div className="p-2" style={{ backgroundColor: qrPanelBg, borderRadius: "10px", border: `1px solid ${idBorderColor}` }}>
                <QRCodeSVG value={qrValue} size={70} />
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="btn text-white d-inline-flex align-items-center px-4 py-2"
              style={{ ...primaryButtonStyle, opacity: downloading ? 0.7 : 1 }}
            >
              <FiDownload size={16} className="me-2" />
              {downloading ? "Generating PDF..." : "Download as PDF"}
            </button>
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default DigitalID;