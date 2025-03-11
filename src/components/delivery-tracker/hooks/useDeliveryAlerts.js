import { useState, useCallback, useEffect } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { hasReachedDestination } from '../utils/mapUtils';

export const useDeliveryAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const { vehicles, destinations, originLocation } = useDeliveryStore();

  const checkDeliveryStatus = useCallback(() => {
    const newAlerts = [];

    for (const vehicle of vehicles) {
					const destination = destinations.find(
						(d) => d.id === vehicle.destinationId,
					);
					if (!destination) continue;

					// Check if vehicle has reached destination
					if (
						vehicle.status === "enroute" &&
						hasReachedDestination(vehicle.location, destination.coordinates)
					) {
						newAlerts.push({
							id: Date.now(),
							type: "success",
							message: `${vehicle.name} has arrived at ${destination.name}`,
							timestamp: new Date().toISOString(),
						});
					}

					// Check if vehicle has returned to origin
					if (
						vehicle.status === "returning" &&
						hasReachedDestination(vehicle.location, originLocation)
					) {
						newAlerts.push({
							id: Date.now(),
							type: "info",
							message: `${vehicle.name} has returned to distribution center`,
							timestamp: new Date().toISOString(),
						});
					}
				}

    if (newAlerts.length > 0) {
      setAlerts(current => [...newAlerts, ...current].slice(0, 10)); // Keep last 10 alerts
    }
  }, [vehicles, destinations, originLocation]);

  useEffect(() => {
    const interval = setInterval(checkDeliveryStatus, 5000);
    return () => clearInterval(interval);
  }, [checkDeliveryStatus]);

  const clearAlert = useCallback((alertId) => {
    setAlerts(current => current.filter(alert => alert.id !== alertId));
  }, []);

  return { alerts, clearAlert };
}; 