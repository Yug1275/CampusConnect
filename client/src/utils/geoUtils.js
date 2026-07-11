// Haversine formula - calculates the great-circle distance between two
// lat/lng points on Earth's surface, in meters. This gives straight-line
// ("as the crow flies") distance, not a path-following walking route.
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // distance in meters
};

// Estimates walking time in minutes based on average walking speed (~5 km/h / 83.3 m/min)
export const estimateWalkingTime = (distanceInMeters) => {
  const AVERAGE_WALKING_SPEED_M_PER_MIN = 83.3;
  return Math.max(1, Math.round(distanceInMeters / AVERAGE_WALKING_SPEED_M_PER_MIN));
};

// Formats a distance in meters as a readable string (meters or km)
export const formatDistance = (distanceInMeters) => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }
  return `${(distanceInMeters / 1000).toFixed(2)} km`;
};