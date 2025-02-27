import { useCallback, useEffect } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { deliveryApi } from '../services/deliveryApi';

const HISTORY_UPDATE_INTERVAL = 30000; // 30 seconds

export const useDeliveryHistory = () => {
  const { vehicles, addToHistory } = useDeliveryStore();

  // Save vehicle positions periodically
  useEffect(() => {
    const savePositions = async () => {
      try {
        await Promise.allSettled(
          vehicles.map(vehicle => 
            deliveryApi.saveDeliveryPath(vehicle.id, {
              location: vehicle.location,
              timestamp: Date.now(),
              status: vehicle.status
            })
          )
        );
      } catch (error) {
        console.warn('Error saving positions:', error);
        // Don't throw error to prevent app disruption
      }
    };

    const interval = setInterval(savePositions, HISTORY_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [vehicles]);

  // Load historical data for a specific time range
  const loadHistory = useCallback(async (startDate, endDate) => {
    try {
      const history = await deliveryApi.getDeliveryHistory({
        start: startDate,
        end: endDate
      });
      
      if (history && history.length > 0) {
        history.forEach(record => {
          addToHistory(record.vehicleId, {
            path: record.path,
            metrics: record.metrics
          });
        });
      }
      
      return history;
    } catch (error) {
      console.warn('Failed to load delivery history:', error);
      return [];
    }
  }, [addToHistory]);

  return { loadHistory };
}; 