import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ChatWidget from "../chatbot/ChatWidget";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";

function MainLayout({ children }) {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh", backgroundColor: colors.pageBg }}>
      <Navbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 p-md-5">{children}</main>
      </div>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default MainLayout;