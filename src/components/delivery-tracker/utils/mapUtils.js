/* eslint-disable */
import { createMarkerIcon } from '../constants/markers';

/**
 * Calculate new position between two points with some randomization
 * @param {Object} current - Current coordinates
 * @param {Object} target - Target coordinates
 * @param {number} speed - Movement speed (0-1)
 * @returns {Object} New coordinates
 */
export const calculateNewPosition = (current, target, speed = 0.1) => {
  const dx = target.lng - current.lng;
  const dy = target.lat - current.lat;
  
  const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
  const step = Math.min(speed, distanceToTarget);
  
  const randomFactor = 0.2;
  const randomAngle = (Math.random() - 0.5) * Math.PI * randomFactor;
  
  const newLng = current.lng + (dx / distanceToTarget) * step * Math.cos(randomAngle);
  const newLat = current.lat + (dy / distanceToTarget) * step * Math.sin(randomAngle);
  
  return {
    lat: newLat,
    lng: newLng,
  };
};

/**
 * Check if vehicle has reached destination
 * @param {Object} current - Current coordinates
 * @param {Object} target - Target coordinates
 * @param {number} threshold - Distance threshold in miles
 * @returns {boolean} True if destination reached
 */
export const hasReachedDestination = (current, target, threshold = 0.1) => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((target.lat - current.lat) * Math.PI) / 180;
  const dLon = ((target.lng - current.lng) * Math.PI) / 180;
  const lat1 = (current.lat * Math.PI) / 180;
  const lat2 = (target.lat * Math.PI) / 180;

  const a = (Math.sin(dLat / 2)) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    (Math.sin(dLon / 2)) ** 2;
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceToTarget = R * c;
  
  return distanceToTarget <= threshold;
};

/**
 * Calculate speed between two points over a duration
 * @param {Object} start - Starting coordinates {lat, lng}
 * @param {Object} end - Ending coordinates {lat, lng}
 * @param {number} duration - Duration in milliseconds
 * @returns {number} Speed in km/h
 */
export const calculateSpeed = (start, end, durationMs) => {
  const distanceKm = calculateDistance(start, end);
  const hours = durationMs / (1000 * 60 * 60);
  return distanceKm / hours;
};

/**
 * Calculate distance between two points in kilometers
 * @param {Object} point1 - First point coordinates {lat, lng}
 * @param {Object} point2 - Second point coordinates {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
  const R = 3963; // Earth's radius in miles
  const lat1 = (point1.lat * Math.PI) / 180;
  const lat2 = (point2.lat * Math.PI) / 180;
  const deltaLat = ((point2.lat - point1.lat) * Math.PI) / 180;
  const deltaLng = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a = (Math.sin(deltaLat / 2)) ** 2
    + Math.cos(lat1) * Math.cos(lat2)
    * (Math.sin(deltaLng / 2)) ** 2;
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
const toRad = (degrees) => {
  return degrees * Math.PI / 180;
};

export const calculateRouteDistance = (points) => {
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    totalDistance += calculateDistance(points[i], points[i + 1]);
  }
  return totalDistance;
};

export const formatDistance = (distanceValue) => (
  distanceValue < 1
    ? `${Math.round(distanceValue * 1000)}m`
    : `${distanceValue.toFixed(1)}km`
);

export const validateDestination = (destination) => {
  if (!destination) return false;
  if (!destination.coordinates) return false;
  if (typeof destination.coordinates.lat !== 'number') return false;
  if (typeof destination.coordinates.lng !== 'number') return false;
  if (!destination.id) return false;
  return true;
};

export const getMarkerIcon = (type) => ({
  path: createMarkerIcon(type).path,
  fillColor: type === 'origin' 
    ? '#1976d2' 
    : (type === 'destination' ? '#f44336' : '#4caf50'),
  fillOpacity: 1,
  strokeWeight: 1,
  strokeColor: '#ffffff',
  scale: 1.5,
  anchor: new google.maps.Point(12, 24),
});

export const interpolatePosition = (start, end, progress) => ({
  lat: start.lat + ((end.lat - start.lat) * progress),
  lng: start.lng + ((end.lng - start.lng) * progress),
});

const calculateBearing = (start, end) => {
  const lat1 = start.lat;
  const lng1 = start.lng;
  const lat2 = end.lat;
  const lng2 = end.lng;
  // ... rest of function
};

const calculateIntermediatePoint = (start, end, fraction) => {
  const lat1 = (start.lat * (Math.PI / 180));
  const lon1 = (start.lng * (Math.PI / 180));
  const lat2 = (end.lat * (Math.PI / 180));
  const lon2 = (end.lng * (Math.PI / 180));

  const d = 2 * Math.asin(
    Math.sqrt(
      (Math.sin((lat2 - lat1) / 2)) ** 2
      + (Math.cos(lat1) * Math.cos(lat2)
      * (Math.sin((lon2 - lon1) / 2)) ** 2),
    )
  );

  const A = Math.sin((1 - fraction) * d) / Math.sin(d);
  const B = Math.sin(fraction * d) / Math.sin(d);

  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);

  const lat = Math.atan2(z, Math.sqrt(x ** 2 + y ** 2));
  const lon = Math.atan2(y, x);

  return {
    lat: (lat * (180 / Math.PI)),
    lng: (lon * (180 / Math.PI)),
  };
};

const createPath = (start, end, numPoints) => ({
  type: 'LineString',
  coordinates: Array.from({ length: numPoints }, (_, i) => {
    const fraction = i / (numPoints - 1);
    return calculateIntermediatePoint(start, end, fraction);
  }),
});

const getMapBounds = (points) => {
  const bounds = new google.maps.LatLngBounds();
  for (const point of points) {
    bounds.extend(point);
  }
  return bounds;
};

export {
  calculateBearing,
  calculateIntermediatePoint,
  createPath,
  getMapBounds,
};
