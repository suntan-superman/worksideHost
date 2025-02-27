import { useMemo } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { calculateDistance } from '../utils/mapUtils';

const AVERAGE_SPEED_MPH = 35; // Average vehicle speed in miles per hour
const LOADING_TIME_MINS = 5; // Time to load/unload in minutes

export const useDeliveryEstimates = () => {
  const { vehicles, destinations, originLocation } = useDeliveryStore();

  const estimates = useMemo(() => {
    return vehicles.map(vehicle => {
      const destination = destinations.find(d => d.id === vehicle.destinationId);
      if (!destination) return null;

      const currentDistance = calculateDistance(vehicle.location, 
        vehicle.status === 'returning' ? originLocation : destination.coordinates
      );

      const totalDistance = calculateDistance(originLocation, destination.coordinates);
      const timeInHours = currentDistance / AVERAGE_SPEED_MPH;
      const estimatedMinutes = Math.round(timeInHours * 60) + LOADING_TIME_MINS;

      const progress = vehicle.status === 'returning'
        ? (1 - currentDistance / totalDistance) * 100
        : (1 - currentDistance / totalDistance) * 100;

      return {
        vehicleId: vehicle.id,
        estimatedMinutes,
        progress,
        destination: destination.name,
        status: vehicle.status,
        eta: new Date(Date.now() + estimatedMinutes * 60000).toLocaleTimeString()
      };
    }).filter(Boolean);
  }, [vehicles, destinations, originLocation]);

  return estimates;
}; 