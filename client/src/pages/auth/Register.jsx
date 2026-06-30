import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import PasswordField, { isPasswordValid } from "../../components/PasswordField";
import AuthLayout from "../../components/layout/AuthLayout";
import {
  getInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getLinkStyle,
  getAlertErrorStyle,
} from "../../styles/authStyles";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginContext } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isPasswordValid(formData.password)) {
      setError("Password does not meet the required criteria");
      return;
    }

    try {
      const response = await registerUser(formData);
      loginContext(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join CampusConnect to get started">
      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            style={getInputStyle(colors)}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            style={getInputStyle(colors)}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="mb-4">
          <label style={getLabelStyle(colors)} className="form-label d-block">
            Role
          </label>
          <select
            name="role"
            className="form-select"
            style={getInputStyle(colors)}
            value={formData.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn w-100 text-white mb-3"
          style={{
            ...primaryButtonStyle,
            opacity: isPasswordValid(formData.password) ? 1 : 0.6,
          }}
          disabled={!isPasswordValid(formData.password)}
        >
          Register
        </button>
      </form>

      <p className="text-center mb-0" style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
        Already have an account?{" "}
        <Link to="/login" style={getLinkStyle(colors)}>
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;