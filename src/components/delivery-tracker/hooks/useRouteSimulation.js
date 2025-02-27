import { useState, useCallback, useEffect } from 'react';
import { routeSimulationService } from '../services/routeSimulationService';

export const useRouteSimulation = (route) => {
  const [simulationState, setSimulationState] = useState({
    results: null,
    isSimulating: false,
    error: null,
    params: {
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
      trafficMultiplier: 1,
      vehicleType: 'standard',
      simulationSpeed: 1
    }
  });

  const [simulationInterval, setSimulationInterval] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initSimulation = async () => {
      try {
        setIsInitializing(true);
        const data = await routeSimulationService.initializeSimulation(simulationState.params);
        setSimulationState(prev => ({
          ...prev,
          results: data.results,
          params: data.params,
          simulationData: data
        }));
      } catch (error) {
        console.error('Failed to initialize simulation:', error);
        setSimulationState(prev => ({
          ...prev,
          error: error,
          isSimulating: false
        }));
      } finally {
        setIsInitializing(false);
      }
    };

    initSimulation();
  }, [simulationState.params]);

  const runSimulation = useCallback(async (customParams = {}) => {
    if (!route) return;

    const { onProgress, ...params } = customParams;
    setSimulationState(prev => ({
      ...prev,
      isSimulating: true,
      error: null
    }));

    try {
      const simulationParams = { ...simulationState.params, ...params };
      const updateProgress = (newProgress) => {
        if (onProgress) {
          onProgress(newProgress);
        }
        setSimulationState(prev => ({
          ...prev,
          results: prev.results ? {
            ...prev.results,
            progress: newProgress
          } : null
        }));
      };

      const results = await routeSimulationService.simulateRoute(route, simulationParams, updateProgress);
      
      setSimulationState(prev => ({
        ...prev,
        results,
        params: simulationParams,
        isSimulating: false
      }));

      return results;
    } catch (err) {
      setSimulationState(prev => ({
        ...prev,
        error: 'Failed to run route simulation',
        isSimulating: false
      }));
      console.error('Simulation error:', err);
    }
  }, [route, simulationState.params]);

  const updateParams = useCallback((newParams) => {
    setSimulationState(prev => ({
      ...prev,
      params: { ...prev.params, ...newParams }
    }));
  }, []);

  const stopSimulation = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setSimulationState(prev => ({
      ...prev,
      isSimulating: false
    }));
  }, [simulationInterval]);

  const pauseSimulation = useCallback(() => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setSimulationState(prev => ({
      ...prev,
      isSimulating: false
    }));
  }, [simulationInterval]);

  return {
    ...simulationState,
    isInitializing,
    runSimulation,
    updateParams,
    stopSimulation,
    pauseSimulation
  };
}; 