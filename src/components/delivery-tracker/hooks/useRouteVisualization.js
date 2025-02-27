import { useState, useCallback } from 'react';
import { RouteVisualizationService } from '../services/routeVisualizationService';

let service = null;

export const useRouteVisualization = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [visualizationState, setVisualizationState] = useState({
    activeRoutes: [],
    heatmapVisible: false,
    trafficVisible: false,
    selectedRouteIndex: 0
  });

  const initializeService = useCallback((map) => {
    if (!service && map) {
      service = new RouteVisualizationService(map);
      setIsInitialized(true);
    }
  }, []);

  const getDetailedRoute = useCallback((origin, destination) => {
    if (!service) {
      throw new Error('Route visualization service not initialized');
    }
    return service.getDetailedRoute(origin, destination);
  }, []);

  const toggleHeatmap = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      heatmapVisible: !prev.heatmapVisible
    }));
  }, []);

  const toggleTraffic = useCallback(() => {
    setVisualizationState(prev => ({
      ...prev,
      trafficVisible: !prev.trafficVisible
    }));
  }, []);

  const selectRoute = useCallback((index) => {
    setVisualizationState(prev => ({
      ...prev,
      selectedRouteIndex: index
    }));
  }, []);

  const setActiveRoutes = useCallback((routes) => {
    setVisualizationState(prev => ({
      ...prev,
      activeRoutes: routes
    }));
  }, []);

  return {
    isInitialized,
    visualizationState,
    initializeService,
    getDetailedRoute,
    toggleHeatmap,
    toggleTraffic,
    selectRoute,
    setActiveRoutes
  };
}; 