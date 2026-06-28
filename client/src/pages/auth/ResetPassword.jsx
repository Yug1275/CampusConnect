import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../services/authService";
import OtpInput from "../../components/OtpInput";
import PasswordField, { isPasswordValid } from "../../components/PasswordField";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Reset Password</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            readOnly={!!emailFromState}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Enter OTP</label>
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
          className="btn btn-primary w-100 mb-3"
          disabled={!isPasswordValid(formData.newPassword)}
        >
          Reset Password
        </button>
      </form>

      <p className="text-center">
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;