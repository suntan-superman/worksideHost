export const exportSimulationResults = (simulation) => {
  const data = {
    timestamp: simulation.timestamp,
    params: simulation.params,
    metrics: simulation.metrics,
    analysis: simulation.analysis,
    weatherData: simulation.weatherData,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `simulation-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 