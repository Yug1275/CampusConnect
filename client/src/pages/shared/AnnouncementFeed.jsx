import { useState, useEffect } from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import SearchBar from "../../components/ui/SearchBar";
import { getAlertErrorStyle } from "../../styles/authStyles";
import { getAnnouncements } from "../../services/announcementService";

// Formats a date as a relative "time ago" string (e.g. "2 days ago")
const timeAgo = (isoString) => {
  const now = new Date();
  const then = new Date(isoString);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  return then.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
};

function AnnouncementFeed() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        setAnnouncements(response.data.announcements);
      } catch (err) {
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = searchQuery
    ? announcements.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.body.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : announcements;

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Announcements</h2>
        <p style={{ color: colors.textSecondary }}>
          Stay updated with the latest campus announcements.
        </p>
      </div>

      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      <div className="mb-4" style={{ maxWidth: "420px" }}>
        <SearchBar placeholder="Search announcements..." onSearch={setSearchQuery} />
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading announcements...</p>
      ) : filteredAnnouncements.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <FiBell size={32} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            {searchQuery
              ? `No announcements match "${searchQuery}"`
              : "No announcements right now. Check back later."}
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredAnnouncements.map((a) => (
            <div
              key={a._id}
              className="p-4"
              style={{
                backgroundColor: colors.cardBg,
                borderRadius: "14px",
                border: `1px solid ${colors.border}`,
                boxShadow: colors.shadow,
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-2">
                <h6 style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.02rem" }} className="mb-0">
                  {a.title}
                </h6>
                <span style={{ color: colors.textMuted, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
                  {timeAgo(a.createdAt)}
                </span>
              </div>

              <p style={{ color: colors.textSecondary, fontSize: "0.9rem", whiteSpace: "pre-wrap" }} className="mb-3">
                {a.body}
              </p>

              <div className="d-flex align-items-center" style={{ fontSize: "0.8rem" }}>
                <span
                  className="d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    backgroundColor: colors.activeLinkBg,
                    color: colors.activeLinkColor,
                  }}
                >
                  <FiUser size={13} />
                </span>
                <span style={{ color: colors.textSecondary, fontWeight: 600 }}>
                  {a.createdBy?.name || "Unknown"}
                </span>
                <span
                  className="ms-2 px-2 py-1 text-capitalize"
                  style={{
                    backgroundColor: colors.pageBg,
                    color: colors.textMuted,
                    borderRadius: "6px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                  }}
                >
                  {a.createdBy?.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </MainLayout>
  );
}

export default AnnouncementFeed;