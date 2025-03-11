
export const useWeatherOverlay = (center) => {
  // Return empty data to prevent errors
  return {
    weatherData: null,
    loading: false,
    error: null
  };
}; 