import { useState, useCallback } from 'react';

export const useSimulationHistory = () => {
  const [history, setHistory] = useState([]);

  const addSimulation = useCallback((results, params) => {
    setHistory(prev => [
      {
        id: Date.now(),
        timestamp: new Date(),
        results,
        params
      },
      ...prev.slice(0, 9) // Keep last 10 simulations
    ]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const compareSimulations = useCallback((sim1Id, sim2Id) => {
    const simulation1 = history.find(h => h.id === sim1Id);
    const simulation2 = history.find(h => h.id === sim2Id);

    if (!simulation1 || !simulation2) return null;

    return {
      durationDiff: simulation2.results.metrics.estimatedDuration - simulation1.results.metrics.estimatedDuration,
      speedDiff: simulation2.results.metrics.averageSpeed - simulation1.results.metrics.averageSpeed,
      riskDiff: simulation2.results.metrics.riskLevel - simulation1.results.metrics.riskLevel,
      reliabilityDiff: simulation2.results.metrics.reliability - simulation1.results.metrics.reliability
    };
  }, [history]);

  return {
    history,
    addSimulation,
    clearHistory,
    compareSimulations
  };
}; 