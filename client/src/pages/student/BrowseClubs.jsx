import { useState, useEffect } from "react";
import { FiAward } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import ClubCard from "../../components/clubs/ClubCard";
import { getAlertSuccessStyle, getAlertErrorStyle, getInputStyle } from "../../styles/authStyles";
import { getClubs, joinClub, leaveClub, getMyClubs } from "../../services/clubService";

const CATEGORIES = ["All", "Coding", "Robotics", "Photography", "Sports", "Music", "Other"];

function BrowseClubs() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [activeTab, setActiveTab] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchClubs = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "mine") {
        const response = await getMyClubs();
        const myClubs = response.data.memberships.map((m) => ({
          ...m.club,
          isMember: true,
        }));
        setClubs(myClubs);
      } else {
        const params = categoryFilter !== "All" ? { category: categoryFilter } : {};
        const response = await getClubs(params);
        setClubs(response.data.clubs);
      }
    } catch (err) {
      setError("Failed to load clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [activeTab, categoryFilter]);

  const handleJoin = async (clubId) => {
    setActionLoadingId(clubId);
    setError("");
    setMessage("");
    try {
      const response = await joinClub(clubId);
      setMessage(response.data.message);
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join club");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLeave = async (clubId) => {
    setActionLoadingId(clubId);
    setError("");
    setMessage("");
    try {
      await leaveClub(clubId);
      setMessage("Left the club successfully");
      fetchClubs();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to leave club");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Campus Clubs</h2>
        <p style={{ color: colors.textSecondary }}>
          Discover and join clubs that match your interests.
        </p>
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

      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <div
          className="d-inline-flex"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "10px",
            border: `1px solid ${colors.border}`,
            padding: "4px",
          }}
        >
          {[
            { key: "all", label: "All Clubs" },
            { key: "mine", label: "My Clubs" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="btn px-4 py-2"
              style={{
                backgroundColor: activeTab === tab.key ? colors.activeLinkColor : "transparent",
                color: activeTab === tab.key ? "#fff" : colors.textSecondary,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "all" && (
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ ...getInputStyle(colors), maxWidth: "200px" }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading clubs...</p>
      ) : clubs.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <FiAward size={32} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            {activeTab === "mine"
              ? "You haven't joined any clubs yet."
              : "No clubs found for this category."}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {clubs.map((club) => (
            <div key={club._id} className="col-12 col-sm-6 col-lg-4">
              <ClubCard
                club={club}
                onJoin={handleJoin}
                onLeave={handleLeave}
                actionLoading={actionLoadingId === club._id}
              />
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default BrowseClubs;