import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { deliveryApi } from '../services/deliveryApi';

export const useDeliveryAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    deliveryEfficiency: 0,
    averageDeliveryTime: 0,
    onTimeDeliveries: 0,
    delayedDeliveries: 0,
    fuelEfficiency: 0,
    trafficImpact: 0,
    totalVehicles: 0,
  });

  const [realtimeMetrics, setRealtimeMetrics] = useState({
    activeVehicles: 0,
    inTransitDeliveries: 0,
    completedDeliveries: 0,
    averageSpeed: 0,
  });

  const [historicalData, setHistoricalData] = useState({
    deliverySuccess: [],
    trends: [],
    vehicleUtilization: []
  });

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('deliveryUpdated', (data) => {
      setRealtimeMetrics(prev => ({
        ...prev,
        ...data.metrics
      }));
    });

    const fetchInitialAnalytics = async () => {
      try {
        const data = await deliveryApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchInitialAnalytics();

    const fetchHistoricalData = async () => {
      try {
        const [success, trends, utilization] = await Promise.all([
          deliveryApi.getDeliverySuccess(),
          deliveryApi.getDeliveryTrends(),
          deliveryApi.getVehicleUtilization()
        ]);

        setHistoricalData({
          deliverySuccess: success,
          trends,
          vehicleUtilization: utilization
        });
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      }
    };

    fetchHistoricalData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const generateReport = useCallback(async (startDate, endDate) => {
    try {
      const report = await deliveryApi.generateReport({
        startDate,
        endDate,
        metrics: ['efficiency', 'timing', 'fuel', 'traffic']
      });
      return report;
    } catch (error) {
      console.error('Failed to generate report:', error);
      return null;
    }
  }, []);

  return {
    analytics,
    realtimeMetrics,
    generateReport,
    historicalData
  };
}; 