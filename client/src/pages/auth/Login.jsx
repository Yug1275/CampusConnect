import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLoginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import SimplePasswordField from "../../components/SimplePasswordField";
import AuthLayout from "../../components/layout/AuthLayout";
import {
  inputStyle,
  labelStyle,
  primaryButtonStyle,
  linkStyle,
  alertErrorStyle,
} from "../../styles/authStyles";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await loginUser(formData);
      loginContext(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const response = await googleLoginUser(credentialResponse.credential);
      loginContext(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to continue to your dashboard">
      {error && (
        <div className="px-3 py-2 mb-3" style={alertErrorStyle}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={labelStyle} className="form-label d-block">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            style={inputStyle}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <SimplePasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="text-end mb-3">
          <Link to="/forgot-password" style={{ ...linkStyle, fontSize: "0.85rem" }}>
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="btn w-100 text-white mb-3"
          style={primaryButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        >
          Login
        </button>
      </form>

      <div className="d-flex align-items-center my-4">
        <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
        <span className="px-3" style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          OR
        </span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#e2e8f0" }} />
      </div>

      <div className="d-flex justify-content-center mb-4">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google login failed")}
        />
      </div>

      <p className="text-center mb-0" style={{ color: "#64748b", fontSize: "0.9rem" }}>
        Don't have an account?{" "}
        <Link to="/register" style={linkStyle}>
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;