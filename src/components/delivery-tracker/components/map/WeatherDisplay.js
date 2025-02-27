import React from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  WbSunny,
  Cloud,
  Opacity,
  Air,
  Warning,
} from '@mui/icons-material';

const WeatherDisplay = ({ weatherData, loading, error }) => {
  if (loading) return <CircularProgress size={20} />;
  if (error || !weatherData) return null;

  const getWeatherIcon = (weather) => {
    switch (weather.toLowerCase()) {
      case 'clear': return <WbSunny />;
      case 'clouds': return <Cloud />;
      case 'rain': return <Opacity />;
      default: return <Warning />;
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tooltip title={weatherData.weather[0].description}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getWeatherIcon(weatherData.weather[0].main)}
          <Typography variant="body2" sx={{ ml: 1 }}>
            {Math.round(weatherData.main.temp)}°F
          </Typography>
        </Box>
      </Tooltip>
      
      <Tooltip title="Wind Speed">
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Air />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {Math.round(weatherData.wind.speed)} mph
          </Typography>
        </Box>
      </Tooltip>
    </Box>
  );
};

export default WeatherDisplay; 