import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiMapPin } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getLocations } from "../../services/locationService";

// Fix Leaflet's default marker icons - a well-known issue where bundlers
// (Vite/Webpack) don't correctly resolve the image paths Leaflet expects by default.
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

// Creates a custom colored circular marker icon per category, using a
// divIcon (plain HTML/CSS) instead of an image file - avoids managing
// ten separate marker image assets.
const createCategoryIcon = (category) => {
  const color = categoryColors[category] || categoryColors.Other;
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid #ffffff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
};

// Default fallback center if no locations exist yet (a neutral placeholder)
const DEFAULT_CENTER = [23.1795, 72.6413];

function CampusMap() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                icon={createCategoryIcon(location.category)}
              >
                <Popup>
                  <div style={{ minWidth: "160px" }}>
                    <strong>{location.name}</strong>
                    <br />
                    <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                      {location.category}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Category legend */}
      {!loading && locations.length > 0 && (
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
      )}
    </MainLayout>
  );
}

export default CampusMap;