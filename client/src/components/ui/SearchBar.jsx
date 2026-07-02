import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

// Debounced search input - waits 400ms after typing stops before firing onSearch,
// avoiding an API call on every single keystroke.
function SearchBar({ placeholder = "Search...", onSearch }) {
  const [value, setValue] = useState("");
  const { theme } = useTheme();
  const colors = themeColors[theme];

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 400);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div
      className="d-flex align-items-center px-3"
      style={{
        backgroundColor: colors.inputBg,
        border: `1px solid ${colors.inputBorder}`,
        borderRadius: "8px",
        height: "42px",
        minWidth: "240px",
      }}
    >
      <FiSearch size={16} color={colors.textMuted} className="me-2 flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="border-0 w-100"
        style={{
          backgroundColor: "transparent",
          color: colors.textPrimary,
          fontSize: "0.88rem",
          outline: "none",
        }}
      />
    </div>
  );
}

export default SearchBar;