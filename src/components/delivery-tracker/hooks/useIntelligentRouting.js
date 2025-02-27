import { useState, useCallback } from 'react';
import { routeOptimizer } from '../services/routeOptimizationService';
import useDeliveryStore from '../stores/deliveryStore';

export const useIntelligentRouting = () => {
  const [optimizationStatus, setOptimizationStatus] = useState({
    isOptimizing: false,
    progress: 0,
    error: null
  });

  const { vehicles, destinations, updateRoutes } = useDeliveryStore();

  const optimizeRoutes = useCallback(async (constraints = {}) => {
    setOptimizationStatus({ isOptimizing: true, progress: 0, error: null });

    try {
      const optimizedRoutes = await routeOptimizer.optimizeRoutes(
        vehicles,
        destinations,
        constraints
      );

      updateRoutes(optimizedRoutes);

      setOptimizationStatus(prev => ({
        ...prev,
        isOptimizing: false,
        progress: 100
      }));

      return optimizedRoutes;
    } catch (error) {
      setOptimizationStatus({
        isOptimizing: false,
        progress: 0,
        error: 'Route optimization failed'
      });
      throw error;
    }
  }, [vehicles, destinations, updateRoutes]);

  const cancelOptimization = useCallback(() => {
    // Implementation for canceling ongoing optimization
    setOptimizationStatus({
      isOptimizing: false,
      progress: 0,
      error: null
    });
  }, []);

  return {
    optimizationStatus,
    optimizeRoutes,
    cancelOptimization
  };
}; 