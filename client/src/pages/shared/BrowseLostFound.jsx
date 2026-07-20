import { useState, useEffect } from "react";
import { FiTag, FiMapPin, FiUser, FiCheck } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import SearchBar from "../../components/ui/SearchBar";
import { getAlertSuccessStyle, getAlertErrorStyle } from "../../styles/authStyles";
import { getItems, claimItem } from "../../services/lostFoundService";

function BrowseLostFound() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [activeTab, setActiveTab] = useState("found");
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [claimTarget, setClaimTarget] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await getItems({ type: activeTab, status: "open" });
      setItems(response.data.items);
    } catch (err) {
      setError("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleClaimConfirm = async () => {
    setClaiming(true);
    setError("");
    try {
      await claimItem(claimTarget._id);
      setMessage(`Claim submitted for "${claimTarget.itemName}". An admin will verify it shortly.`);
      setClaimTarget(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit claim");
      setClaimTarget(null);
    } finally {
      setClaiming(false);
    }
  };

  const filteredItems = searchQuery
    ? items.filter(
        (i) =>
          i.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Browse Lost &amp; Found</h2>
        <p style={{ color: colors.textSecondary }}>
          Search reported items — claim anything that belongs to you.
        </p>
      </div>

      {message && (
        <div className="px-3 py-2 mb-3" style={getAlertSuccessStyle(colors)}>
          {message}
        </div>
      )}
      {error && (
        <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
          {error}
        </div>
      )}

      <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
        <div
          className="d-inline-flex"
          style={{ backgroundColor: colors.cardBg, borderRadius: "10px", border: `1px solid ${colors.border}`, padding: "4px" }}
        >
          {[
            { key: "found", label: "Found Items" },
            { key: "lost", label: "Lost Items" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="btn px-4 py-2"
              style={{
                backgroundColor: activeTab === tab.key ? colors.activeLinkColor : "transparent",
                color: activeTab === tab.key ? "#fff" : colors.textSecondary,
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "0.85rem",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <SearchBar placeholder="Search items..." onSearch={setSearchQuery} />
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading items...</p>
      ) : filteredItems.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
        >
          <FiTag size={30} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            {searchQuery ? `No items match "${searchQuery}"` : `No open ${activeTab} items right now.`}
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredItems.map((item) => {
            const isOwnReport = item.reportedBy?._id === user._id;
            return (
              <div key={item._id} className="col-12 col-sm-6 col-lg-4">
                <div
                  className="p-4 h-100 d-flex flex-column"
                  style={{ backgroundColor: colors.cardBg, borderRadius: "14px", border: `1px solid ${colors.border}`, boxShadow: colors.shadow }}
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.itemName}
                      style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", marginBottom: "12px" }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}

                  <span
                    className="px-2 py-1 mb-2 text-capitalize"
                    style={{
                      backgroundColor: item.type === "lost" ? "#dc262615" : "#16a34a15",
                      color: item.type === "lost" ? "#dc2626" : "#16a34a",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      width: "fit-content",
                    }}
                  >
                    {item.type}
                  </span>

                  <h6 style={{ color: colors.textPrimary, fontWeight: 700 }} className="mb-1">
                    {item.itemName}
                  </h6>

                  {item.description && (
                    <p style={{ color: colors.textSecondary, fontSize: "0.85rem" }} className="mb-2">
                      {item.description}
                    </p>
                  )}

                  {item.location && (
                    <div className="d-flex align-items-center mb-2" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
                      <FiMapPin size={13} className="me-2 flex-shrink-0" /> {item.location}
                    </div>
                  )}

                  <div className="d-flex align-items-center mb-3" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
                    <FiUser size={13} className="me-2 flex-shrink-0" />
                    Reported by {isOwnReport ? "you" : item.reportedBy?.name || "someone"}
                  </div>

                  <div className="mt-auto">
                    {item.type === "found" && !isOwnReport ? (
                      <button
                        onClick={() => setClaimTarget(item)}
                        className="btn w-100 text-white d-flex align-items-center justify-content-center py-2"
                        style={{ backgroundColor: "#2563eb", borderRadius: "8px", fontWeight: 600, fontSize: "0.85rem", border: "none" }}
                      >
                        <FiCheck size={15} className="me-2" /> This Is Mine
                      </button>
                    ) : (
                      <div
                        className="text-center py-2"
                        style={{ color: colors.textMuted, fontSize: "0.8rem", border: `1px dashed ${colors.border}`, borderRadius: "8px" }}
                      >
                        {isOwnReport ? "This is your report" : "Contact reporter if you have info"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!claimTarget}
        onCancel={() => setClaimTarget(null)}
        onConfirm={handleClaimConfirm}
        title="Claim This Item?"
        message={`Are you sure "${claimTarget?.itemName}" belongs to you? An admin will verify this claim before it's finalized.`}
        confirmLabel="Yes, Claim It"
        loading={claiming}
      />
    </MainLayout>
  );
}

export default BrowseLostFound;