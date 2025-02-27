import { calculateDistance } from './mapUtils';

/**
 * Clusters vehicles that are within a certain distance of each other
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Array} Array of clusters, each containing one or more vehicles
 */
export const clusterVehicles = (vehicles) => {
  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return [];
  }

  // Filter and validate vehicles
  const validVehicles = vehicles.filter(vehicle => {
    if (!vehicle) return false;
    
    const isValid = 
      vehicle.id && 
      vehicle.location &&
      typeof vehicle.location.lat === 'number' && 
      typeof vehicle.location.lng === 'number' &&
      !isNaN(vehicle.location.lat) && 
      !isNaN(vehicle.location.lng);
    
    if (!isValid) {
      console.debug('Skipping invalid vehicle:', {
        id: vehicle.id,
        hasLocation: !!vehicle.location,
        coordinates: vehicle.location
      });
    }
    return isValid;
  });

  if (validVehicles.length === 0) {
    return [];
  }

  // Create single-vehicle clusters
  return validVehicles.map(vehicle => ({
    center: { ...vehicle.location },
    vehicles: [vehicle],
    count: 1
  }));
};

const calculateClusterCenter = (vehicles) => {
  // Filter out vehicles without valid locations first
  const validVehicles = vehicles.filter(v => 
    v?.location && 
    typeof v.location.lat === 'number' && 
    typeof v.location.lng === 'number' &&
    !isNaN(v.location.lat) && 
    !isNaN(v.location.lng)
  );
  
  if (validVehicles.length === 0) {
    console.warn('No valid vehicles for cluster center calculation', {
      originalVehicles: vehicles,
      validVehicles
    });
    return { lat: 35.48, lng: -118.9 }; // Return default center instead of 0,0
  }

  const sum = validVehicles.reduce((acc, vehicle) => ({
    lat: acc.lat + vehicle.location.lat,
    lng: acc.lng + vehicle.location.lng
  }), { lat: 0, lng: 0 });

  return {
    lat: sum.lat / validVehicles.length,
    lng: sum.lng / validVehicles.length
  };
};

/**
 * Creates a heatmap data layer from vehicle positions
 * @param {Array} vehicles - Array of vehicle objects
 * @returns {Array} Array of heatmap data points
 */
export const createHeatmapData = (vehicles) => {
  if (!vehicles || !Array.isArray(vehicles)) return [];
  
  return vehicles
    .filter(v => v?.location?.lat && v?.location?.lng)
    .map(vehicle => ({
      location: new google.maps.LatLng(
        Number(vehicle.location.lat),
        Number(vehicle.location.lng)
      ),
      weight: vehicle.status === 'idle' ? 0.3 : 1
    }));
}; 