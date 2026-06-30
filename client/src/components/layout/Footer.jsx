import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function Footer() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <footer
      className="text-center py-3"
      style={{
        backgroundColor: colors.footerBg,
        borderTop: `1px solid ${colors.border}`,
        color: colors.textMuted,
        fontSize: "0.82rem",
      }}
    >
      &copy; {new Date().getFullYear()} CampusConnect — One Platform for Students, Faculty &amp; Campus Life
    </footer>
  );
}

export default Footer;