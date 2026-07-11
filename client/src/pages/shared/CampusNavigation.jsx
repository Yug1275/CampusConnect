import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FiNavigation, FiClock, FiMap, FiArrowRight } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { themeColors } from "../../styles/themeColors";
import MainLayout from "../../components/layout/MainLayout";
import { getInputStyle, getLabelStyle, primaryButtonStyle, getAlertErrorStyle } from "../../styles/authStyles";
import { getLocations } from "../../services/locationService";
import { calculateDistance, estimateWalkingTime, formatDistance } from "../../utils/geoUtils";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const startIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background-color:#16a34a;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const endIcon = L.divIcon({
  className: "custom-marker-icon",
  html: `<div style="background-color:#dc2626;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const DEFAULT_CENTER = [23.1795, 72.6413];

// Small helper component - re-centers/fits the map to show both points
// whenever the route changes, since MapContainer's center prop only applies on first render.
function FitBoundsToRoute({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (from && to) {
      const bounds = L.latLngBounds(
        [from.latitude, from.longitude],
        [to.latitude, to.longitude]
      );
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [from, to, map]);

  return null;
}

function CampusNavigation() {
  const { theme } = useTheme();
  const colors = themeColors[theme];

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [route, setRoute] = useState(null); // { from, to, distance, time }

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations();
        setLocations(response.data.locations);

        // Check for a destination set via Task 4's "Navigate Here" button
        const stored = sessionStorage.getItem("campusconnect-nav-destination");
        if (stored) {
          const destination = JSON.parse(stored);
          const match = response.data.locations.find((loc) => loc._id === destination._id);
          if (match) setToId(match._id);
          sessionStorage.removeItem("campusconnect-nav-destination");
        }
      } catch (err) {
        setError("Failed to load campus locations");
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const handleGetDirections = () => {
    if (!fromId || !toId) {
      setError("Please select both a starting point and a destination");
      return;
    }
    if (fromId === toId) {
      setError("Starting point and destination cannot be the same");
      return;
    }
    setError("");

    const from = locations.find((loc) => loc._id === fromId);
    const to = locations.find((loc) => loc._id === toId);

    const distance = calculateDistance(from.latitude, from.longitude, to.latitude, to.longitude);
    const time = estimateWalkingTime(distance);

    setRoute({ from, to, distance, time });
  };

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
        <h2 style={{ fontWeight: 700, color: colors.textPrimary }}>Campus Navigation</h2>
        <p style={{ color: colors.textSecondary }}>
          Get directions between two campus locations.
        </p>
      </div>

      {loading ? (
        <p style={{ color: colors.textSecondary }}>Loading locations...</p>
      ) : locations.length < 2 ? (
        <div
          className="p-5 text-center"
          style={{
            backgroundColor: colors.cardBg,
            borderRadius: "14px",
            border: `1px solid ${colors.border}`,
            boxShadow: colors.shadow,
          }}
        >
          <FiMap size={32} color={colors.textMuted} className="mb-2" />
          <p className="mb-0" style={{ color: colors.textMuted }}>
            At least two campus locations are needed to calculate directions.
          </p>
        </div>
      ) : (
        <>
          {/* From / To selectors */}
          <div
            className="p-4 mb-4 row g-3 align-items-end"
            style={{
              backgroundColor: colors.cardBg,
              borderRadius: "14px",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <div className="col-12 col-md-5">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                From
              </label>
              <select
                className="form-select"
                style={getInputStyle(colors)}
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
              >
                <option value="">Select starting point</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-1 text-center d-none d-md-block">
              <FiArrowRight size={20} color={colors.textMuted} />
            </div>

            <div className="col-12 col-md-5">
              <label style={getLabelStyle(colors)} className="form-label d-block">
                To
              </label>
              <select
                className="form-select"
                style={getInputStyle(colors)}
                value={toId}
                onChange={(e) => setToId(e.target.value)}
              >
                <option value="">Select destination</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-1">
              <button
                onClick={handleGetDirections}
                className="btn text-white w-100 d-flex align-items-center justify-content-center py-2"
                style={primaryButtonStyle}
                title="Get Directions"
              >
                <FiNavigation size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="px-3 py-2 mb-3" style={getAlertErrorStyle(colors)}>
              {error}
            </div>
          )}

          {/* Results summary */}
          {route && (
            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6">
                <div
                  className="p-3 d-flex align-items-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
                  }}
                >
                  <span
                    className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: "#2563eb15",
                      color: "#2563eb",
                    }}
                  >
                    <FiMap size={18} />
                  </span>
                  <div>
                    <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
                      Estimated Distance
                    </p>
                    <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.1rem" }}>
                      {formatDistance(route.distance)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div
                  className="p-3 d-flex align-items-center"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: "12px",
                    border: `1px solid ${colors.border}`,
                    boxShadow: colors.shadow,
                  }}
                >
                  <span
                    className="d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: "#16a34a15",
                      color: "#16a34a",
                    }}
                  >
                    <FiClock size={18} />
                  </span>
                  <div>
                    <p className="mb-0" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
                      Estimated Walking Time
                    </p>
                    <p className="mb-0" style={{ color: colors.textPrimary, fontWeight: 700, fontSize: "1.1rem" }}>
                      {route.time} min
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <div
            style={{
              borderRadius: "14px",
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              boxShadow: colors.shadow,
            }}
          >
            <MapContainer center={mapCenter} zoom={16} style={{ height: "550px", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {route && (
                <>
                  <Marker position={[route.from.latitude, route.from.longitude]} icon={startIcon} />
                  <Marker position={[route.to.latitude, route.to.longitude]} icon={endIcon} />
                  <Polyline
                    positions={[
                      [route.from.latitude, route.from.longitude],
                      [route.to.latitude, route.to.longitude],
                    ]}
                    pathOptions={{ color: "#2563eb", weight: 4, dashArray: "8, 8" }}
                  />
                  <FitBoundsToRoute from={route.from} to={route.to} />
                </>
              )}
            </MapContainer>
          </div>

          <p className="mt-3 mb-0" style={{ color: colors.textMuted, fontSize: "0.78rem" }}>
            Note: distance and time are estimated as a direct straight-line path between locations
            and may not reflect actual walkways or building layouts.
          </p>
        </>
      )}
    </MainLayout>
  );
}

export default CampusNavigation;