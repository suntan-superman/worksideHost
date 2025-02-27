import { useCallback, useMemo } from 'react';
import useDeliveryStore from '../stores/deliveryStore';

export const useDeliveryRoutes = () => {
  const { vehicles, destinations, originLocation } = useDeliveryStore();

  // Calculate optimal routes using a simple nearest neighbor algorithm
  const optimizeRoutes = useCallback(() => {
    const unassignedDestinations = [...destinations];
    const optimizedRoutes = vehicles.map(vehicle => {
      if (unassignedDestinations.length === 0) return vehicle;

      // Find nearest destination from current location
      const currentPos = vehicle.location;
      let nearestIdx = 0;
      let minDistance = Number.MAX_VALUE;

      unassignedDestinations.forEach((dest, idx) => {
        const distance = calculateDistance(currentPos, dest.coordinates);
        if (distance < minDistance) {
          minDistance = distance;
          nearestIdx = idx;
        }
      });

      const [nextDestination] = unassignedDestinations.splice(nearestIdx, 1);

      return {
        ...vehicle,
        destinationId: nextDestination.id,
        status: 'enroute'
      };
    });

    return optimizedRoutes;
  }, [vehicles, destinations]);

  // Calculate total distance for each route
  const routeDistances = useMemo(() => {
    return vehicles.map(vehicle => {
      const destination = destinations.find(d => d.id === vehicle.destinationId);
      if (!destination) return 0;

      const toDestination = calculateDistance(vehicle.location, destination.coordinates);
      const returnTrip = calculateDistance(destination.coordinates, originLocation);

      return {
        vehicleId: vehicle.id,
        totalDistance: toDestination + returnTrip,
        toDestination,
        returnTrip
      };
    });
  }, [vehicles, destinations, originLocation]);

  return {
    optimizeRoutes,
    routeDistances
  };
};

// Helper function to calculate distance between two points
const calculateDistance = (point1, point2) => {
  const R = 3959; // Earth's radius in miles
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}; 