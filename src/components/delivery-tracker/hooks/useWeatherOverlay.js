import { useState, useCallback, useEffect } from 'react';

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY || '';

export const useWeatherOverlay = (center) => {
  // Return empty data to prevent errors
  return {
    weatherData: null,
    loading: false,
    error: null
  };
}; 