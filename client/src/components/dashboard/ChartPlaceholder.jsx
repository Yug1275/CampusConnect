import { FiBarChart2 } from "react-icons/fi";

// Static placeholder for chart panels - real Chart.js integration arrives in Phase 9 (Analytics)
function ChartPlaceholder({ title }) {
  return (
    <div
      className="p-4 h-100 d-flex flex-column"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <h6 style={{ color: "#1e293b", fontWeight: 700, fontSize: "1rem" }} className="mb-3">
        {title}
      </h6>

      <div
        className="d-flex flex-column align-items-center justify-content-center flex-grow-1"
        style={{
          backgroundColor: "#f8fafc",
          border: "1px dashed #cbd5e1",
          borderRadius: "10px",
          minHeight: "200px",
        }}
      >
        <FiBarChart2 size={32} color="#cbd5e1" />
        <p className="mb-0 mt-2" style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
          Chart will be available in Phase 9 (Analytics)
        </p>
      </div>
    </div>
  );
}

export default ChartPlaceholder;