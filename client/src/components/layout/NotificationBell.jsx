import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiCheckSquare,
  FiCalendar,
  FiClipboard,
  FiInfo,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import {
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../services/notificationService";

const TYPE_META = {
  attendance: { icon: FiCheckSquare, color: "#16a34a" },
  event: { icon: FiCalendar, color: "#2563eb" },
  announcement: { icon: FiClipboard, color: "#0891b2" },
  general: { icon: FiInfo, color: "#64748b" },
};

const POLL_INTERVAL_MS = 60000; // 60 seconds

// Formats a date as a short relative string (reuses the same logic pattern as the Announcement feed, Task 3)
const timeAgo = (isoString) => {
  const diffMs = new Date() - new Date(isoString);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};

function NotificationBell() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      // Silent failure - badge just won't update this cycle
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getMyNotifications();
      setNotifications(response.data.notifications);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + periodic polling for the unread badge
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleOpen = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) fetchNotifications();
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        // Non-blocking - navigation still proceeds even if the read-mark fails
      }
    }
    setIsOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      // Silent failure - user can retry
    }
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <button
        onClick={handleToggleOpen}
        className="btn position-relative d-flex align-items-center justify-content-center border-0"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          backgroundColor: colors.navbarBorder,
          color: colors.textSecondary,
        }}
        title="Notifications"
      >
        <FiBell size={16} />
        {unreadCount > 0 && (
          <span
            className="position-absolute d-flex align-items-center justify-content-center"
            style={{
              top: "-2px",
              right: "-2px",
              minWidth: "16px",
              height: "16px",
              borderRadius: "8px",
              backgroundColor: "#dc2626",
              color: "#fff",
              fontSize: "0.62rem",
              fontWeight: 700,
              padding: "0 3px",
              border: "2px solid",
              borderColor: colors.navbarBg,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="mt-2 notification-dropdown"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
            zIndex: 1000,
            maxHeight: "440px",
            overflowY: "auto",
          }}
        >
          <div
            className="d-flex align-items-center justify-content-between px-3 py-3"
            style={{ borderBottom: `1px solid ${colors.border}` }}
          >
            <h6 className="mb-0" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "0.92rem" }}>
              Notifications
            </h6>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="btn d-flex align-items-center border-0 bg-transparent p-0"
                style={{ color: colors.activeLinkColor, fontSize: "0.76rem", fontWeight: 600 }}
              >
                <FiCheck size={13} className="me-1" /> Mark all read
              </button>
            )}
          </div>

          {loading ? (
            <p className="px-3 py-3 mb-0" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              Loading...
            </p>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4">
              <FiBell size={26} color={colors.textMuted} className="mb-2" />
              <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.85rem" }}>
                No notifications yet
              </p>
            </div>
          ) : (
            notifications.map((notification) => {
              const meta = TYPE_META[notification.type] || TYPE_META.general;
              const Icon = meta.icon;
              return (
                <button
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className="btn w-100 text-start d-flex align-items-start border-0 bg-transparent px-3 py-3"
                  style={{
                    borderBottom: `1px solid ${colors.border}`,
                    backgroundColor: notification.isRead ? "transparent" : colors.activeLinkBg,
                  }}
                >
                  <span
                    className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: `${meta.color}15`,
                      color: meta.color,
                    }}
                  >
                    <Icon size={15} />
                  </span>
                  <div className="flex-grow-1">
                    <p
                      className="mb-1"
                      style={{
                        color: colors.textPrimary,
                        fontWeight: notification.isRead ? 500 : 700,
                        fontSize: "0.85rem",
                      }}
                    >
                      {notification.title}
                    </p>
                    <p className="mb-1" style={{ color: colors.textSecondary, fontSize: "0.78rem" }}>
                      {notification.message}
                    </p>
                    <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.72rem" }}>
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <span
                      className="flex-shrink-0"
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#2563eb",
                        marginTop: "4px",
                      }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;