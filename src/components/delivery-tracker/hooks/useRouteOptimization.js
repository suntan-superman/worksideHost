import { useState, useCallback } from 'react';
import { routeOptimizer } from '../services/routeOptimizationService';
import useDeliveryStore from '../stores/deliveryStore';

const defaultSettings = {
  timeWeight: 40,
  fuelWeight: 30,
  trafficWeight: 30,
  useRealTimeTraffic: true,
  considerWeather: true,
  useHistoricalData: true,
  dynamicReoptimization: false,
  balanceWorkload: true
};

export const useRouteOptimization = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { vehicles, destinations, updateRoutes } = useDeliveryStore();

  const updateSettings = useCallback(async (newSettings) => {
    setSettings(newSettings);
    await routeOptimizer.updateOptimizationSettings(newSettings);
  }, []);

  const applySettings = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const optimizedRoutes = await routeOptimizer.optimizeRoutes(
        vehicles,
        destinations,
        settings
      );
      updateRoutes(optimizedRoutes);
    } catch (error) {
      console.error('Failed to apply optimization settings:', error);
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, [vehicles, destinations, settings, updateRoutes]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return {
    settings,
    isOptimizing,
    updateSettings,
    applySettings,
    resetSettings
  };
}; 