import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPasswordRequest } from "../../services/authService";
import AuthLayout from "../../components/layout/AuthLayout";
import {
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  linkStyle,
  alertSuccessStyle,
  alertErrorStyle,
} from "../../styles/authStyles";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPasswordRequest(email);
      setMessage(response.data.message || "OTP sent successfully to your email");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a 6-digit OTP"
    >
      {message && (
        <div className="px-3 py-2 mb-3" style={alertSuccessStyle}>
          {message}
        </div>
      )}
      {error && (
        <div className="px-3 py-2 mb-3" style={alertErrorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label style={labelStyle} className="form-label d-block">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            style={inputStyle}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="btn w-100 text-white mb-3"
          style={{ ...primaryButtonStyle, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p className="text-center mb-0" style={{ color: "#64748b", fontSize: "0.9rem" }}>
        Remembered your password?{" "}
        <Link to="/login" style={linkStyle}>
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPassword;