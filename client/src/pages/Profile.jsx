import { useState, useEffect, useRef } from "react";
import { FiCamera, FiUser, FiMail, FiShield } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { themeColors } from "../styles/themeColors";
import MainLayout from "../components/layout/MainLayout";
import { getMyProfile, updateMyProfile, uploadProfilePicture } from "../services/userService";
import {
  getInputStyle,
  getReadonlyInputStyle,
  getLabelStyle,
  primaryButtonStyle,
  getAlertSuccessStyle,
  getAlertErrorStyle,
} from "../styles/authStyles";

const API_BASE = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

function Profile() {
  const { user, updateUserInContext } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    semester: "",
    rollNumber: "",
    qualification: "",
    subjects: "",
  });
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        const profile = response.data.user;
        setFormData({
          name: profile.name || "",
          department: profile.department || "",
          semester: profile.semester || "",
          rollNumber: profile.rollNumber || "",
          qualification: profile.qualification || "",
          subjects: (profile.subjects || []).join(", "),
        });
        setProfileImage(profile.profileImage || "");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const payload = {
        name: formData.name,
        department: formData.department,
        semester: formData.semester ? Number(formData.semester) : null,
        rollNumber: formData.rollNumber,
        qualification: formData.qualification,
        subjects: formData.subjects
          ? formData.subjects.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const response = await updateMyProfile(payload);
      setMessage("Profile updated successfully");
      updateUserInContext({ name: response.data.user.name });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const response = await uploadProfilePicture(file);
      setProfileImage(response.data.profileImage);
      updateUserInContext({ profileImage: response.data.profileImage });
      setMessage("Profile picture updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const initials = formData.name
    ? formData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (loading) {
    return (
      <MainLayout>
        <p style={{ color: colors.textSecondary }}>Loading profile...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>My Profile</h2>
        <p style={{ color: colors.textSecondary }}>Manage your personal information and photo.</p>
      </div>

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

      <div className="row g-4">
        {/* Avatar card */}
        <div className="col-12 col-md-4">
          <div
            className="p-4 d-flex flex-column align-items-center text-center"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <div
              onClick={handleImageClick}
              role="button"
              className="position-relative mb-3"
              style={{ width: "120px", height: "120px", cursor: "pointer" }}
            >
              {profileImage ? (
                <img
                  src={`${API_BASE}${profileImage}`}
                  alt="Profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: `3px solid ${colors.border}`,
                  }}
                />
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    backgroundColor: "#2563eb15",
                    color: "#2563eb",
                    fontSize: "2rem",
                    fontWeight: 700,
                    border: `3px solid ${colors.border}`,
                  }}
                >
                  {initials}
                </div>
              )}

              <div
                className="position-absolute d-flex align-items-center justify-content-center"
                style={{
                  bottom: 0,
                  right: 0,
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  border: `2px solid ${colors.cardBg}`,
                }}
              >
                <FiCamera size={16} color="#fff" />
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {uploading && (
              <p style={{ color: "#2563eb", fontSize: "0.82rem" }}>Uploading...</p>
            )}

            <h6 style={{ fontWeight: 700, color: colors.textPrimary }} className="mb-0">
              {formData.name}
            </h6>
            <span
              className="px-2 py-1 mt-2"
              style={{
                backgroundColor: colors.inputReadonlyBg,
                color: colors.textSecondary,
                fontSize: "0.75rem",
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "capitalize",
              }}
            >
              {user?.role}
            </span>
          </div>
        </div>

        {/* Editable form card */}
        <div className="col-12 col-md-8">
          <div
            className="p-4"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-2">
                <div className="col-12">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    <FiUser size={14} className="me-1" /> Full Name
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

                <div className="col-12 col-sm-6">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    <FiMail size={14} className="me-1" /> Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    style={getReadonlyInputStyle(colors)}
                    value={user?.email || ""}
                    readOnly
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    <FiShield size={14} className="me-1" /> Role
                  </label>
                  <input
                    type="text"
                    className="form-control text-capitalize"
                    style={getReadonlyInputStyle(colors)}
                    value={user?.role || ""}
                    readOnly
                  />
                </div>

                <div className="col-12 col-sm-6">
                  <label style={getLabelStyle(colors)} className="form-label d-block">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    className="form-control"
                    style={getInputStyle(colors)}
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                  />
                </div>

                {user?.role === "student" && (
                  <>
                    <div className="col-12 col-sm-3">
                      <label style={getLabelStyle(colors)} className="form-label d-block">
                        Semester
                      </label>
                      <input
                        type="number"
                        name="semester"
                        className="form-control"
                        style={getInputStyle(colors)}
                        value={formData.semester}
                        onChange={handleChange}
                        min="1"
                        max="8"
                      />
                    </div>
                    <div className="col-12 col-sm-3">
                      <label style={getLabelStyle(colors)} className="form-label d-block">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        name="rollNumber"
                        className="form-control"
                        style={getInputStyle(colors)}
                        value={formData.rollNumber}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {user?.role === "faculty" && (
                  <>
                    <div className="col-12 col-sm-6">
                      <label style={getLabelStyle(colors)} className="form-label d-block">
                        Qualification
                      </label>
                      <input
                        type="text"
                        name="qualification"
                        className="form-control"
                        style={getInputStyle(colors)}
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="e.g. M.Tech, Ph.D"
                      />
                    </div>
                    <div className="col-12">
                      <label style={getLabelStyle(colors)} className="form-label d-block">
                        Subjects (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="subjects"
                        className="form-control"
                        style={getInputStyle(colors)}
                        value={formData.subjects}
                        onChange={handleChange}
                        placeholder="e.g. Data Structures, Computer Networks"
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                type="submit"
                className="btn text-white mt-3"
                style={{ ...primaryButtonStyle, opacity: saving ? 0.7 : 1, padding: "10px 28px" }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Profile;