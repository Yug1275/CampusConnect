import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiUsers,
  FiUserCheck,
  FiGrid,
  FiAward,
  FiCalendar,
  FiBell,
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import { globalSearch } from "../../services/searchService";

const CATEGORY_META = {
  students: { label: "Students", icon: FiUsers, color: "#2563eb" },
  faculty: { label: "Faculty", icon: FiUserCheck, color: "#9333ea" },
  departments: { label: "Departments", icon: FiGrid, color: "#16a34a" },
  clubs: { label: "Clubs", icon: FiAward, color: "#f59e0b" },
  events: { label: "Events", icon: FiCalendar, color: "#dc2626" },
  announcements: { label: "Announcements", icon: FiBell, color: "#0891b2" },
};

function GlobalSearch() {
  const { theme } = useTheme();
  const colors = themeColors[theme];
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced search - waits 400ms after typing stops
  useEffect(() => {
    clearTimeout(debounceRef.current);

    if (query.trim().length < 2) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await globalSearch(query.trim());
        setResults(response.data.results);
        setIsOpen(true);
      } catch (err) {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

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

  const handleSelectResult = (result) => {
    setIsOpen(false);
    setQuery("");
    setResults(null);
    navigate(result.link);
  };

  const totalCount = results
    ? Object.values(results).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  return (
    <div className="position-relative d-none d-sm-block" ref={containerRef} style={{ width: "320px" }}>
      <div
        className="d-flex align-items-center px-3"
        style={{
          backgroundColor: theme === "dark" ? "#1e293b" : "#f1f5f9",
          borderRadius: "8px",
          height: "38px",
        }}
      >
        <FiSearch size={15} color={colors.textMuted} className="me-2 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results && setIsOpen(true)}
          placeholder="Search everything..."
          className="border-0 w-100"
          style={{
            backgroundColor: "transparent",
            color: colors.textPrimary,
            fontSize: "0.85rem",
            outline: "none",
          }}
        />
      </div>

      {isOpen && (
        <div
          className="position-absolute mt-2"
          style={{
            top: "100%",
            left: 0,
            width: "380px",
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
            borderRadius: "12px",
            boxShadow: "0 12px 32px rgba(0,0,0,0.25)",
            zIndex: 1000,
            maxHeight: "420px",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <p className="px-4 py-3 mb-0" style={{ color: colors.textSecondary, fontSize: "0.85rem" }}>
              Searching...
            </p>
          ) : totalCount === 0 ? (
            <p className="px-4 py-3 mb-0" style={{ color: colors.textMuted, fontSize: "0.85rem" }}>
              No results found for "{query}"
            </p>
          ) : (
            Object.entries(results)
              .filter(([, items]) => items.length > 0)
              .map(([category, items]) => {
                const meta = CATEGORY_META[category];
                const Icon = meta.icon;
                return (
                  <div key={category} className="px-2 py-2" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <div className="d-flex align-items-center px-2 mb-1">
                      <Icon size={13} color={meta.color} className="me-2" />
                      <span
                        style={{
                          color: colors.textMuted,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.4px",
                        }}
                      >
                        {meta.label} ({items.length})
                      </span>
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectResult(item)}
                        className="btn w-100 text-start border-0 bg-transparent px-2 py-2 rounded-2"
                        style={{ transition: "background-color 0.15s ease" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.pageBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.85rem" }}>
                          {item.title}
                        </p>
                        <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.76rem" }}>
                          {item.subtitle}
                        </p>
                      </button>
                    ))}
                  </div>
                );
              })
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;