import { useState, useCallback, useEffect } from 'react';
import { routeHistory } from '../services/routeHistoryService';

export const useRouteHistory = (routeId) => {
  const [history, setHistory] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const historyData = await routeHistory.getRouteHistory(routeId);
      const performanceMetrics = await routeHistory.getPerformanceMetrics(routeId);
      
      setHistory(historyData);
      setMetrics(performanceMetrics);
      setError(null);
    } catch (err) {
      setError('Failed to load route history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const saveRouteData = useCallback(async (routeData) => {
    try {
      await routeHistory.saveRouteHistory(routeId, routeData);
      await loadHistory();
    } catch (err) {
      console.error('Failed to save route data:', err);
      throw err;
    }
  }, [routeId, loadHistory]);

  return {
    history,
    metrics,
    loading,
    error,
    saveRouteData,
    refreshHistory: loadHistory
  };
}; 