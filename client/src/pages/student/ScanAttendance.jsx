import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FiCamera, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getAlertSuccessStyle, getAlertErrorStyle, primaryButtonStyle } from "../../styles/authStyles";
import { scanQrAttendance } from "../../services/attendanceSessionService";

const SCANNER_ELEMENT_ID = "qr-scanner-region";

function ScanAttendance() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 576);

  const [scannerActive, setScannerActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null); // { success: bool, message: string }
  const [cameraError, setCameraError] = useState("");

  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        // Scanner may already be stopped - safe to ignore
      }
      scannerRef.current = null;
    }
  };

  const handleScanSuccess = async (decodedText) => {
    // Prevent multiple submissions while one scan is being processed
    if (processing) return;

    let payload;
    try {
      payload = JSON.parse(decodedText);
    } catch (err) {
      setResult({ success: false, message: "This QR code is not a valid CampusConnect attendance code" });
      return;
    }

    if (payload.type !== "campusconnect-attendance" || !payload.token) {
      setResult({ success: false, message: "This QR code is not a valid CampusConnect attendance code" });
      return;
    }

    setProcessing(true);
    await stopScanner();
    setScannerActive(false);

    try {
      const response = await scanQrAttendance(payload.token);
      if (isMountedRef.current) {
        setResult({ success: true, message: response.data.message });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setResult({
          success: false,
          message: err.response?.data?.message || "Failed to mark attendance",
        });
      }
    } finally {
      if (isMountedRef.current) setProcessing(false);
    }
  };

  const startScanner = async () => {
    setCameraError("");
    setResult(null);
    setScannerActive(true);

    // Wait a tick so the DOM element exists before Html5Qrcode attaches to it
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => handleScanSuccess(decodedText),
          () => {
            // Per-frame "no QR found" callback - intentionally silent, fires constantly
          }
        );
      } catch (err) {
        setCameraError(
          "Unable to access camera. Please grant camera permission and ensure no other app is using it."
        );
        setScannerActive(false);
      }
    }, 100);
  };

  const resetAndRescan = () => {
    setResult(null);
    startScanner();
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopScanner();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Scan Attendance</h2>
        <p style={{ color: colors.textSecondary }}>
          Scan the QR code displayed by your faculty to mark yourself present.
        </p>
      </div>

      <div
        className="p-3 p-sm-4 text-center"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          width: "100%",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        {/* Result state */}
        {result && (
          <div className="mb-3">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: result.success ? "#16a34a15" : "#dc262615",
                color: result.success ? "#16a34a" : "#dc2626",
              }}
            >
              {result.success ? <FiCheckCircle size={30} /> : <FiXCircle size={30} />}
            </div>
            <div
              className="px-3 py-2 mb-3"
              style={result.success ? getAlertSuccessStyle(colors) : getAlertErrorStyle(colors)}
            >
              {result.message}
            </div>
            <button
              onClick={resetAndRescan}
              className="btn text-white d-inline-flex align-items-center px-4 py-2"
              style={primaryButtonStyle}
            >
              <FiRefreshCw size={16} className="me-2" /> Scan Another Code
            </button>
          </div>
        )}

        {/* Processing state */}
        {processing && !result && (
          <p style={{ color: colors.textSecondary }}>Verifying scan...</p>
        )}

        {/* Camera error */}
        {cameraError && !result && (
          <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
            {cameraError}
          </div>
        )}

        {/* Initial state - before scanner starts */}
        {!scannerActive && !result && !processing && (
          <div className="py-4">
            <div
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: colors.activeLinkBg,
                color: colors.activeLinkColor,
              }}
            >
              <FiCamera size={28} />
            </div>
            <p style={{ color: colors.textSecondary, fontSize: "0.9rem" }} className="mb-4">
              Camera access is required to scan the attendance QR code.
            </p>
            <button
              onClick={startScanner}
              className="btn text-white d-inline-flex align-items-center px-4 py-2"
              style={primaryButtonStyle}
            >
              <FiCamera size={16} className="me-2" /> Start Scanning
            </button>
          </div>
        )}

        {/* Live scanner region */}
        {scannerActive && !result && (
          <div>
            <div
              id={SCANNER_ELEMENT_ID}
              style={{
                width: "100%",
                minHeight: isMobile ? "260px" : "320px",
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
              }}
            />
            <p className="mt-3 mb-0" style={{ color: colors.textMuted, fontSize: "0.82rem" }}>
              Point your camera at the QR code shown by your faculty.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ScanAttendance;