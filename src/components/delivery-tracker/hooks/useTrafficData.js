import { useState, useEffect, useCallback } from 'react';
import { calculateDistance } from '../utils/mapUtils';

const TRAFFIC_UPDATE_INTERVAL = 60000; // 1 minute

export const useTrafficData = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated traffic data calculation
  const calculateTrafficDelay = useCallback((start, end) => {
    const distance = calculateDistance(start, end);
    const baseDelay = Math.random() * distance * 2; // Random delay based on distance
    const timeOfDay = new Date().getHours();
    
    // Simulate rush hour traffic (7-9 AM and 4-6 PM)
    const isRushHour = (timeOfDay >= 7 && timeOfDay <= 9) || 
                      (timeOfDay >= 16 && timeOfDay <= 18);
    
    return isRushHour ? baseDelay * 1.5 : baseDelay;
  }, []);

  const fetchTrafficData = useCallback(async () => {
    setIsLoading(true);
    try {
      // In a real application, this would fetch from a traffic API
      // For now, we'll create a traffic data object with simulated delays
      const data = {
        timestamp: Date.now(),
        getDelay: calculateTrafficDelay,
        getSpeed: (location) => {
          const baseSpeed = 35; // Base speed in mph
          const variation = Math.random() * 10 - 5; // Random variation ±5 mph
          return Math.max(15, baseSpeed + variation); // Minimum speed 15 mph
        }
      };
      
      setTrafficData(data);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [calculateTrafficDelay]);

  useEffect(() => {
    fetchTrafficData();
    const interval = setInterval(fetchTrafficData, TRAFFIC_UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchTrafficData]);

  return { trafficData, isLoading };
}; 