function ListCard({ title, items, emptyText = "Nothing to show right now" }) {
  return (
    <div
      className="p-4 h-100"
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

      {items.length === 0 ? (
        <p style={{ color: "#94a3b8", fontSize: "0.88rem" }} className="mb-0">
          {emptyText}
        </p>
      ) : (
        <ul className="list-unstyled mb-0">
          {items.map((item, index) => (
            <li
              key={index}
              className="d-flex justify-content-between align-items-center py-2"
              style={{
                borderBottom: index < items.length - 1 ? "1px solid #f1f5f9" : "none",
              }}
            >
              <div>
                <p className="mb-0" style={{ color: "#334155", fontSize: "0.9rem", fontWeight: 600 }}>
                  {item.primary}
                </p>
                {item.secondary && (
                  <p className="mb-0" style={{ color: "#94a3b8", fontSize: "0.78rem" }}>
                    {item.secondary}
                  </p>
                )}
              </div>
              {item.tag && (
                <span
                  className="px-2 py-1"
                  style={{
                    backgroundColor: "#eff6ff",
                    color: "#2563eb",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    borderRadius: "6px",
                  }}
                >
                  {item.tag}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListCard;