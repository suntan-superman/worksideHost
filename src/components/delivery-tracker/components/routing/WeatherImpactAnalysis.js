import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Opacity as RainIcon,
  AcUnit as SnowIcon,
  Cloud as CloudIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const WeatherImpactAnalysis = ({ weatherData, metrics }) => {
  if (!weatherData || !metrics) return null;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'rain': return <RainIcon />;
      case 'snow': return <SnowIcon />;
      case 'cloudy': return <CloudIcon />;
      default: return <SunIcon />;
    }
  };

  const getImpactLevel = (impact) => {
    if (impact > 0.7) return { color: 'error', label: 'High' };
    if (impact > 0.4) return { color: 'warning', label: 'Moderate' };
    return { color: 'success', label: 'Low' };
  };

  const calculateVisibilityImpact = () => {
    const { visibility } = weatherData;
    if (visibility < 200) return 1;
    if (visibility < 500) return 0.7;
    if (visibility < 1000) return 0.4;
    return 0.1;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          Weather Impact Analysis
        </Typography>
        <Chip
          icon={getWeatherIcon(weatherData.condition)}
          label={weatherData.condition}
          size="small"
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Temperature
            </Typography>
            <Typography variant="h6">
              {weatherData.temperature}°C
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Visibility
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <VisibilityIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                {weatherData.visibility}m
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Impact Assessment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Speed Impact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(metrics.weatherImpact.speedReduction * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.weatherImpact.speedReduction * 100}
                color={getImpactLevel(metrics.weatherImpact.speedReduction).color}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  Safety Risk
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {(metrics.weatherImpact.safetyRisk * 100).toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={metrics.weatherImpact.safetyRisk * 100}
                color={getImpactLevel(metrics.weatherImpact.safetyRisk).color}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Recommendations
        </Typography>
        {metrics.weatherImpact.recommendations.map((rec, index) => (
          <Tooltip key={index} title={rec.reason}>
            <Chip
              label={rec.action}
              size="small"
              color={rec.priority === 'high' ? 'error' : 'warning'}
              sx={{ mr: 1, mb: 1 }}
            />
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default WeatherImpactAnalysis; 