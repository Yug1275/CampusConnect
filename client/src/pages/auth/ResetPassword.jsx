import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import OtpInput from "../../components/OtpInput";
import PasswordField, { isPasswordValid } from "../../components/PasswordField";
import AuthLayout from "../../components/layout/AuthLayout";
import {
  getInputStyle,
  getReadonlyInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getLinkStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (otpValue) => {
    setFormData({ ...formData, otp: otpValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!isPasswordValid(formData.newPassword)) {
      setError("New password does not meet the required criteria");
      return;
    }

    try {
      const response = await resetPasswordRequest(formData);
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter the OTP sent to your email">
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

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            style={emailFromState ? getReadonlyInputStyle(colors) : getInputStyle(colors)}
            value={formData.email}
            onChange={handleChange}
            readOnly={!!emailFromState}
            required
          />
        </div>

        <div className="mb-3">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Enter OTP
          </label>
          <OtpInput value={formData.otp} onChange={handleOtpChange} />
        </div>

        <PasswordField
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="btn w-100 text-white mb-3"
          style={{
            ...primaryButtonStyle,
            opacity: isPasswordValid(formData.newPassword) ? 1 : 0.6,
          }}
          disabled={!isPasswordValid(formData.newPassword)}
        >
          Reset Password
        </button>
      </form>

      <p className="text-center mb-0">
        <Link to="/login" style={getLinkStyle(colors)}>
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPassword;