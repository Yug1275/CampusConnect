import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FiCamera, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getAlertSuccessStyle, getAlertErrorStyle, primaryButtonStyle } from "../../styles/authStyles";
import { verifyEventTicket } from "../../services/eventService";

const SCANNER_ELEMENT_ID = "ticket-scanner-region";

function ScanEventTicket() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [scannerActive, setScannerActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState("");

  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastScanRef = useRef("");

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        // Already stopped - safe to ignore
      }
      scannerRef.current = null;
    }
  };

  const handleScanSuccess = async (decodedText) => {
    if (processing || decodedText === lastScanRef.current) return;
    lastScanRef.current = decodedText;

    let payload;
    try {
      payload = JSON.parse(decodedText.trim());
    } catch (err) {
      setResult({ success: false, message: "This QR code is not a valid event ticket" });
      await stopScanner();
      setScannerActive(false);
      return;
    }

    if (payload.type !== "campusconnect-event-ticket" || !payload.code) {
      setResult({ success: false, message: "This QR code is not a valid event ticket" });
      await stopScanner();
      setScannerActive(false);
      return;
    }

    setProcessing(true);
    await stopScanner();
    setScannerActive(false);

    try {
      const response = await verifyEventTicket(payload.code);
      if (isMountedRef.current) {
        setResult({ success: true, message: response.data.message });
      }
    } catch (err) {
      if (isMountedRef.current) {
        setResult({
          success: false,
          message: err.response?.data?.message || "Failed to verify ticket",
        });
      }
    } finally {
      if (isMountedRef.current) setProcessing(false);
    }
  };

  const startScanner = async () => {
    setCameraError("");
    setResult(null);
    lastScanRef.current = "";
    setScannerActive(true);

    setTimeout(async () => {
      try {
        await stopScanner();

        const element = document.getElementById(SCANNER_ELEMENT_ID);
        if (element) element.innerHTML = "";

        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => handleScanSuccess(decodedText),
          () => {}
        );
      } catch (err) {
        setCameraError(
          "Unable to access camera. Please grant camera permission and ensure no other app is using it."
        );
        setScannerActive(false);
      }
    }, 150);
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

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Scan Event Ticket</h2>
        <p style={{ color: colors.textSecondary }}>
          Scan a student's ticket QR to check them in at the event entrance.
        </p>
      </div>

      <div
        className="p-4 text-center"
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: "14px",
          border: `1px solid ${colors.border}`,
          boxShadow: colors.shadow,
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
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
              <FiRefreshCw size={16} className="me-2" /> Scan Next Ticket
            </button>
          </div>
        )}

        {processing && !result && (
          <p style={{ color: colors.textSecondary }}>Verifying ticket...</p>
        )}

        {cameraError && !result && (
          <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
            {cameraError}
          </div>
        )}

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
              Camera access is required to scan ticket QR codes.
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

        {scannerActive && !result && (
          <div>
            <div
              id={SCANNER_ELEMENT_ID}
              style={{
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                border: `1px solid ${colors.border}`,
              }}
            />
            <p className="mt-3 mb-0" style={{ color: colors.textMuted, fontSize: "0.82rem" }}>
              Point your camera at the student's ticket QR code.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default ScanEventTicket;