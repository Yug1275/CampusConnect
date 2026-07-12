import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiMapPin, FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import LocationDetailPanel from "../../components/map/LocationDetailPanel";
import SearchBar from "../../components/ui/SearchBar";
import { getLocations } from "../../services/locationService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const categoryColors = {
  Library: "#2563eb",
  Auditorium: "#9333ea",
  Hostel: "#dc2626",
  Cafeteria: "#f59e0b",
  "Sports Ground": "#16a34a",
  "Placement Cell": "#0891b2",
  Labs: "#7c3aed",
  Parking: "#64748b",
  "Admin Block": "#be185d",
  Other: "#64748b",
};

const createCategoryIcon = (category, isSelected) => {
  const color = categoryColors[category] || categoryColors.Other;
  const size = isSelected ? 34 : 26;
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        background-color: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const DEFAULT_CENTER = [23.1795, 72.6413];

// Flies the map to a specific location whenever `flyTarget` changes
function FlyToLocation({ flyTarget }) {
  const map = useMap();

  useEffect(() => {
    if (flyTarget) {
      map.flyTo([flyTarget.latitude, flyTarget.longitude], 18, { duration: 1 });
    }
  }, [flyTarget, map]);

  return null;
}

function CampusMap() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [flyTarget, setFlyTarget] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(response.data.locations);
      } catch (err) {
        setError("Failed to load campus locations");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const mapCenter =
    locations.length > 0
      ? [
          locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
          locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length,
        ]
      : DEFAULT_CENTER;

  const handleSetDestination = (location) => {
    sessionStorage.setItem("campusconnect-nav-destination", JSON.stringify(location));
    window.location.href = "/campus-navigation";
  };

  // Client-side filter - matches against name or category, case-insensitive
  const searchResults = searchQuery
    ? locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectSearchResult = (location) => {
    setSelectedLocation(location);
    setFlyTarget(location);
    setSearchQuery("");
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Campus Map</h2>
        <p style={{ color: colors.textSecondary }}>
          Explore campus locations, facilities, and buildings.
        </p>
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading map...</p>
      ) : error ? (
        <p style={{ color: "#dc2626" }}>{error}</p>
      ) : locations.length === 0 ? (
        <div
          className="p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <FiMapPin size={32} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            No campus locations have been added yet.
          </p>
        </div>
      ) : (
        <>
          {/* Search bar with live results dropdown */}
          <div className="position-relative mb-3" style={{ maxWidth: "420px" }}>
            <SearchBar
              placeholder="Search locations by name or category..."
              onSearch={setSearchQuery}
            />

            {searchQuery && (
              <div
                className="position-absolute w-100 mt-1"
                style={{
                  backgroundColor: colors.cardBg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: "10px",
                  boxShadow: colors.shadow,
                  zIndex: 500,
                  maxHeight: "260px",
                  overflowY: "auto",
                }}
              >
                {searchResults.length === 0 ? (
                  <p className="px-3 py-3 mb-0" style={{ color: colors.textMuted, fontSize: "0.85rem" }}>
                    No locations match "{searchQuery}"
                  </p>
                ) : (
                  searchResults.map((loc) => (
                    <button
                      key={loc._id}
                      onClick={() => handleSelectSearchResult(loc)}
                      className="btn w-100 text-start d-flex align-items-center px-3 py-2 border-0 bg-transparent"
                      style={{ borderBottom: `1px solid ${colors.border}` }}
                    >
                      <span
                        className="d-inline-block me-2 flex-shrink-0"
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: categoryColors[loc.category] || categoryColors.Other,
                        }}
                      />
                      <div>
                        <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 600, fontSize: "0.87rem" }}>
                          {loc.name}
                        </p>
                        <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.75rem" }}>
                          {loc.category}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="row g-3">
            <div className={selectedLocation ? "col-12 col-lg-8" : "col-12"}>
              <div
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: `1px solid ${colors.border}`,
                  boxShadow: colors.shadow,
                }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={16}
                  style={{ height: "600px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {locations.map((location) => (
                    <Marker
                      key={location._id}
                      position={[location.latitude, location.longitude]}
                      icon={createCategoryIcon(
                        location.category,
                        selectedLocation?._id === location._id
                      )}
                      eventHandlers={{
                        click: () => setSelectedLocation(location),
                      }}
                    >
                      <Popup>
                        <div style={{ minWidth: "140px" }}>
                          <strong>{location.name}</strong>
                          <br />
                          <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                            {location.category}
                          </span>
                          <br />
                          <button
                            onClick={() => setSelectedLocation(location)}
                            style={{
                              marginTop: "6px",
                              background: "none",
                              border: "none",
                              color: "#2563eb",
                              fontWeight: 600,
                              fontSize: "0.8rem",
                              cursor: "pointer",
                              padding: 0,
                            }}
                          >
                            View Details →
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  <FlyToLocation flyTarget={flyTarget} />
                </MapContainer>
              </div>

              {/* Category legend */}
              <div
                className="mt-3 p-3 d-flex flex-wrap gap-3"
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                }}
              >
                {Object.entries(categoryColors)
                  .filter(([cat]) => locations.some((loc) => loc.category === cat))
                  .map(([cat, color]) => (
                    <div key={cat} className="d-flex align-items-center" style={{ fontSize: "0.8rem" }}>
                      <span
                        className="d-inline-block me-2"
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: color,
                        }}
                      />
                      <span style={{ color: colors.textSecondary }}>{cat}</span>
                    </div>
                  ))}
              </div>
            </div>

            {selectedLocation && (
              <div className="col-12 col-lg-4" style={{ height: "600px" }}>
                <LocationDetailPanel
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                  onSetDestination={handleSetDestination}
                />
              </div>
            )}
          </div>
        </>
      )}
    </MainLayout>
  );
}

export default CampusMap;