import { useCallback } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { calculateDistance } from '../utils/mapUtils';

export const useVehicleAssignment = () => {
  const { vehicles, destinations, originLocation, setVehicles } = useDeliveryStore();

  // Move these function declarations before they're used
  const calculateTotalDistance = useCallback((vehicle) => {
    const destination = destinations.find(d => d.id === vehicle.destinationId);
    if (!destination) return 0;

    const toDestination = calculateDistance(vehicle.location, destination.coordinates);
    const returnTrip = calculateDistance(destination.coordinates, originLocation);
    return toDestination + returnTrip;
  }, [destinations, originLocation]);

  const findBestDestination = useCallback((currentLocation, availableDestinations) => {
    if (availableDestinations.length === 0) return null;

    let bestDestination = null;
    let shortestDistance = Number.MAX_VALUE;

    availableDestinations.forEach(dest => {
      const distance = calculateDistance(currentLocation, dest.coordinates);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        bestDestination = dest;
      }
    });

    return bestDestination;
  }, []);

  // Optimize vehicle assignments using a modified nearest neighbor algorithm
  const optimizeAssignments = useCallback(() => {
    const unassignedDestinations = [...destinations];
    const availableVehicles = vehicles.filter(v => v.status === 'idle');

    // Sort vehicles by current workload (total assigned distance)
    const sortedVehicles = [...availableVehicles].sort((a, b) => {
      const aDistance = calculateTotalDistance(a);
      const bDistance = calculateTotalDistance(b);
      return aDistance - bDistance;
    });

    const newAssignments = sortedVehicles.map(vehicle => {
      if (unassignedDestinations.length === 0) return vehicle;

      // Find best destination based on distance and current vehicle location
      const bestDestination = findBestDestination(
        vehicle.location,
        unassignedDestinations
      );

      if (bestDestination) {
        const destIndex = unassignedDestinations.findIndex(
          d => d.id === bestDestination.id
        );
        unassignedDestinations.splice(destIndex, 1);

        return {
          ...vehicle,
          destinationId: bestDestination.id,
          status: 'enroute'
        };
      }

      return vehicle;
    });

    setVehicles(newAssignments);
    return newAssignments;
  }, [calculateTotalDistance, findBestDestination, vehicles, destinations, setVehicles]);

  return {
    optimizeAssignments,
    calculateTotalDistance
  };
}; 