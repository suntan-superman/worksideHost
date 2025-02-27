import { useState, useCallback } from 'react';
import useDeliveryStore from '../stores/deliveryStore';

export const useDeliveryTimeWindows = () => {
  const [timeWindows, setTimeWindows] = useState(new Map());
  const { destinations } = useDeliveryStore();

  const addTimeWindow = useCallback((destinationId, window) => {
    setTimeWindows(current => new Map(current).set(destinationId, window));
  }, []);

  const removeTimeWindow = useCallback((destinationId) => {
    setTimeWindows(current => {
      const newWindows = new Map(current);
      newWindows.delete(destinationId);
      return newWindows;
    });
  }, []);

  const isDeliveryInWindow = useCallback((destinationId) => {
    const window = timeWindows.get(destinationId);
    if (!window) return true; // No time window constraint

    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;
    return currentHour >= window.start && currentHour <= window.end;
  }, [timeWindows]);

  return {
    timeWindows,
    addTimeWindow,
    removeTimeWindow,
    isDeliveryInWindow
  };
}; 