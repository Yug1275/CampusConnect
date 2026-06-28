import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div
      className="d-flex flex-column"
      style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}
    >
      <Navbar />

      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 p-md-5">{children}</main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout;