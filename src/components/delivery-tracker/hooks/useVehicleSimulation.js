import { useCallback, useEffect } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { calculateNewPosition, hasReachedDestination } from '../utils/mapUtils';

export const useVehicleSimulation = (onError) => {
  const { 
    vehicles,
    destinations,
    originLocation,
    isSimulationRunning,
    setVehicles
  } = useDeliveryStore();

  const updateVehicleStatus = useCallback((vehicle, destination) => {
    if (hasReachedDestination(vehicle.location, destination.coordinates)) {
      return 'arrived';
    }
    if (hasReachedDestination(vehicle.location, originLocation)) {
      return 'idle';
    }
    return vehicle.status === 'returning' ? 'returning' : 'enroute';
  }, [originLocation]);

  const simulateMovement = useCallback(() => {
    try {
      setVehicles(vehicles.map(vehicle => {
        const destination = destinations.find(d => d.id === vehicle.destinationId);
        if (!destination) return vehicle;

        let targetLocation = destination.coordinates;
        let newStatus = vehicle.status;

        if (hasReachedDestination(vehicle.location, destination.coordinates)) {
          targetLocation = originLocation;
          newStatus = 'returning';
        }

        if (newStatus === 'returning' && hasReachedDestination(vehicle.location, originLocation)) {
          return { ...vehicle, status: 'idle' };
        }

        const newLocation = calculateNewPosition(
          vehicle.location,
          targetLocation,
          0.0001
        );

        newStatus = updateVehicleStatus(
          { ...vehicle, location: newLocation },
          destination
        );

        return {
          ...vehicle,
          location: newLocation,
          status: newStatus
        };
      }));
    } catch (err) {
      onError?.(err);
    }
  }, [vehicles, destinations, originLocation, updateVehicleStatus, setVehicles, onError]);

  useEffect(() => {
    if (!isSimulationRunning) return;

    const interval = setInterval(simulateMovement, 30000);
    return () => clearInterval(interval);
  }, [isSimulationRunning, simulateMovement]);

  return { simulateMovement };
}; 