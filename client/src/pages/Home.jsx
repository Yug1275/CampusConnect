import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiCalendar,
  FiMap,
  FiBarChart2,
  FiBell,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { themeColors } from "../styles/themeColors";
import HomeNavbar from "../components/layout/HomeNavbar";

function Home() {
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const colors = themeColors[theme];

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get("/health");
        setStatus(response.data);
      } catch (err) {
        setError("Unable to connect to the backend server.");
      }
    };
    checkHealth();
  }, []);

  const features = [
    {
      icon: <FiUsers size={22} />,
      title: "Student & Faculty Management",
      desc: "Centralized profiles, departments, and records — all in one organized system.",
      color: "#2563eb",
    },
    {
      icon: <FiCalendar size={22} />,
      title: "Events & Clubs",
      desc: "Discover, register, and manage campus events and club memberships effortlessly.",
      color: "#9333ea",
    },
    {
      icon: <FiMap size={22} />,
      title: "Campus Navigation",
      desc: "Interactive maps to find your way between classes, labs, and campus landmarks.",
      color: "#16a34a",
    },
    {
      icon: <FiBarChart2 size={22} />,
      title: "Attendance & Analytics",
      desc: "Real-time attendance tracking with insightful charts for students and faculty.",
      color: "#f59e0b",
    },
    {
      icon: <FiBell size={22} />,
      title: "Smart Notifications",
      desc: "Stay updated with announcements, reminders, and important campus alerts.",
      color: "#dc2626",
    },
    {
      icon: <FiAward size={22} />,
      title: "Achievements & Badges",
      desc: "Earn recognition for attendance, participation, and academic excellence.",
      color: "#0891b2",
    },
  ];

  return (
    <div style={{ backgroundColor: colors.pageBg, minHeight: "100vh" }}>
      <HomeNavbar />

      {/* Hero Section */}
      <section
        className="position-relative overflow-hidden d-flex flex-column align-items-center justify-content-center text-center px-3"
        style={{ minHeight: "calc(100vh - 72px)" }}
      >
        {/* Animated background blobs */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "clamp(220px, 55vw, 350px)",
            height: "clamp(220px, 55vw, 350px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.25), transparent 70%)",
            animation: "floatBlob 10s ease-in-out infinite",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "-80px",
            width: "clamp(240px, 60vw, 400px)",
            height: "clamp(240px, 60vw, 400px)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(147,51,234,0.2), transparent 70%)",
            animation: "floatBlob 12s ease-in-out infinite reverse",
            zIndex: 0,
          }}
        />

        <div className="position-relative px-2 px-sm-0" style={{ zIndex: 1, maxWidth: "720px" }}>
          <span
            className="d-inline-block px-3 py-1 mb-4 fade-in-up"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "#2563eb",
            }}
          >
            One Platform for the Entire University
          </span>

          <h1
            className="fade-in-up delay-1"
            style={{
              fontWeight: 800,
              fontSize: "clamp(2.2rem, 8vw, 3rem)",
              color: colors.textPrimary,
              lineHeight: 1.2,
            }}
          >
            Welcome to <span style={{ color: "#2563eb" }}>CampusConnect</span>
          </h1>

          <p
            className="fade-in-up delay-2 mt-3 mb-5"
            style={{ color: colors.textSecondary, fontSize: "clamp(0.98rem, 3.5vw, 1.1rem)" }}
          >
            Manage attendance, events, clubs, announcements, and campus life —
            all in one seamless platform built for students, faculty, and admins.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap fade-in-up delay-3">
            <Link
              to="/register"
              className="btn cta-btn text-white d-flex align-items-center px-4 py-2"
              style={{
                backgroundColor: "#2563eb",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
                boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
              }}
            >
              Get Started <FiArrowRight className="ms-2" />
            </Link>
            <Link
              to="/login"
              className="btn cta-btn px-4 py-2"
              style={{
                backgroundColor: colors.cardBg,
                color: colors.textPrimary,
                border: `1px solid ${colors.border}`,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Login
            </Link>
          </div>

          {/* Server status pill */}
          <div
            className="d-inline-flex align-items-center px-3 py-2 mt-5 fade-in-up delay-4"
            style={{
              backgroundColor: colors.cardBg,
              border: `1px solid ${colors.border}`,
              borderRadius: "20px",
              fontSize: "0.82rem",
            }}
          >
            {error && (
              <span style={{ color: "#dc2626" }}>
                <span style={{ animation: "pulseSoft 1.5s ease-in-out infinite" }}>●</span> {error}
              </span>
            )}
            {!error && !status && (
              <span style={{ color: colors.textMuted }}>
                <span style={{ animation: "pulseSoft 1.5s ease-in-out infinite" }}>●</span> Checking server status...
              </span>
            )}
            {status && (
              <span style={{ color: "#16a34a" }}>● {status.message}</span>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 px-md-5 py-5" style={{ maxWidth: "1140px", margin: "0 auto" }}>
        <div className="text-center mb-5 fade-in-up px-2 px-md-0">
          <h2 style={{ fontWeight: 700, color: colors.textPrimary, fontSize: "clamp(1.5rem, 5vw, 2rem)" }}>
            Everything Your Campus Needs
          </h2>
          <p style={{ color: colors.textSecondary }}>
            Built for students, faculty, and administrators — all in one place.
          </p>
        </div>

        <div className="row g-4">
          {features.map((feature, index) => (
            <div className="col-12 col-sm-6 col-lg-4" key={index}>
              <div
                className={`p-4 h-100 hover-lift fade-in-up delay-${Math.min(index + 1, 5)}`}
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "14px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <span
                  className="d-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    backgroundColor: `${feature.color}15`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </span>
                <h6 style={{ fontWeight: 700, color: colors.textPrimary }}>{feature.title}</h6>
                <p className="mb-0" style={{ color: colors.textSecondary, fontSize: "0.9rem" }}>
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-5">
        <div
          className="mx-auto p-4 p-md-5 text-center fade-in-up"
          style={{
            maxWidth: "900px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1e293b, #2563eb)",
          }}
        >
          <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(1.25rem, 4.5vw, 1.6rem)" }}>
            Ready to get started?
          </h3>
          <p style={{ color: "#cbd5e1" }} className="mb-4">
            Join CampusConnect today and experience campus life, simplified.
          </p>
          <Link
            to="/register"
            className="btn cta-btn d-inline-flex align-items-center px-4 py-2"
            style={{
              backgroundColor: "#fff",
              color: "#1e293b",
              borderRadius: "8px",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Create Your Account <FiArrowRight className="ms-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-4"
        style={{
          borderTop: `1px solid ${colors.border}`,
          color: colors.textMuted,
          fontSize: "0.82rem",
        }}
      >
        &copy; {new Date().getFullYear()} CampusConnect — One Platform for Students, Faculty &amp; Campus Life
      </footer>
    </div>
  );
}

export default Home;