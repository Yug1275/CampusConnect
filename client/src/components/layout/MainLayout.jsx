import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-4">{children}</div>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;