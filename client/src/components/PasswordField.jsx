import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { themeColors } from "../styles/themeColors";

function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  showRequirements = true,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const checks = {
    minLength: value.length >= 8,
    hasUppercase: /[A-Z]/.test(value),
    hasDigit: /[0-9]/.test(value),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const CheckItem = ({ passed, label }) => (
    <div className="d-flex align-items-center mb-2">
      <span
        className="d-flex align-items-center justify-content-center me-2"
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: passed ? "#22c55e" : "#475569",
          color: "#fff",
          fontSize: "0.7rem",
          flexShrink: 0,
        }}
      >
        {passed ? "✓" : "✕"}
      </span>
      <span style={{ color: passed ? "#fff" : "#94a3b8", fontWeight: passed ? 600 : 400 }}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="mb-3 position-relative" ref={containerRef}>
      <label className="form-label" style={{ color: colors.textSecondary, fontSize: "0.85rem", fontWeight: 600 }}>
        {label}
      </label>

      <div className="position-relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          className="form-control pe-5"
          style={{
            backgroundColor: colors.inputBg,
            borderColor: colors.inputBorder,
            color: colors.textPrimary,
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "0.92rem",
          }}
          value={value}
          onChange={onChange}
          onFocus={() => setShowPopover(true)}
          autoComplete="new-password"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="btn position-absolute top-0 end-0 h-100 border-0 bg-transparent"
          style={{ padding: "0 12px" }}
          tabIndex={-1}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke={colors.textMuted} strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      {/* Dark popover with arrow - stays dark slate in both themes for strong contrast/legibility */}
      {showRequirements && showPopover && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: "10px",
            backgroundColor: "#1e293b",
            borderRadius: "12px",
            padding: "16px 18px",
            width: "100%",
            zIndex: 20,
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "24px",
              width: 0,
              height: 0,
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderBottom: "8px solid #1e293b",
            }}
          />

          <p className="mb-2" style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
            Password Requirements
          </p>
          <CheckItem passed={checks.minLength} label="At least 8 characters" />
          <CheckItem passed={checks.hasUppercase} label="One uppercase letter" />
          <CheckItem passed={checks.hasDigit} label="One number" />
          <CheckItem passed={checks.hasSpecialChar} label="One special character" />
        </div>
      )}
    </div>
  );
}

export default PasswordField;

export const isPasswordValid = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
};