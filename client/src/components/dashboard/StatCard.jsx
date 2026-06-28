function StatCard({ icon, label, value, accentColor = "#2563eb" }) {
  return (
    <div
      className="p-4 d-flex flex-column"
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        minWidth: "0",
      }}
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span
          className="d-flex align-items-center justify-content-center"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          {icon}
        </span>
      </div>
      <span style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 500 }}>
        {label}
      </span>
      <span style={{ color: "#1e293b", fontSize: "1.6rem", fontWeight: 700 }}>
        {value}
      </span>
    </div>
  );
}

export default StatCard;