import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Schedule as TimeIcon,
  Route as RouteIcon,
  Cloud as WeatherIcon,
} from '@mui/icons-material';

const InsightCard = ({ title, value, trend, description, icon, color }) => (
  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      {icon}
      <Typography variant="subtitle2" sx={{ ml: 1 }}>
        {title}
      </Typography>
    </Box>
    <Typography variant="h5" color={color} gutterBottom>
      {value}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {trend > 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
      <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
        {Math.abs(trend)}% {trend > 0 ? 'improvement' : 'decline'}
      </Typography>
    </Box>
    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
      {description}
    </Typography>
  </Box>
);

const SimulationInsights = ({ history }) => {
  const calculateTrends = () => {
    if (history.length < 2) return null;

    const recentSimulations = history.slice(-5);
    const averageReliability = recentSimulations.reduce((sum, sim) => 
      sum + sim.metrics.reliability, 0) / recentSimulations.length;
    
    const previousReliability = history.slice(-10, -5).reduce((sum, sim) => 
      sum + sim.metrics.reliability, 0) / Math.min(5, history.length - 5);

    return {
      reliabilityTrend: ((averageReliability - previousReliability) / previousReliability) * 100,
      bestTimeOfDay: recentSimulations.reduce((best, sim) => 
        sim.metrics.reliability > (best?.metrics.reliability || 0) ? sim : best
      ).params.timeOfDay,
      weatherImpact: recentSimulations.reduce((acc, sim) => ({
        ...acc,
        [sim.params.weatherCondition]: (acc[sim.params.weatherCondition] || 0) + sim.metrics.reliability
      }), {})
    };
  };

  const trends = calculateTrends();
  if (!trends) return null;

  const getBestWeatherCondition = () => {
    const conditions = Object.entries(trends.weatherImpact)
      .map(([condition, total]) => ({
        condition,
        average: total / history.filter(sim => sim.params.weatherCondition === condition).length
      }));
    return conditions.reduce((best, current) => 
      current.average > best.average ? current : best
    );
  };

  const bestWeather = getBestWeatherCondition();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Simulation Insights
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <InsightCard
            title="Reliability Trend"
            value={`${Math.abs(trends.reliabilityTrend).toFixed(1)}%`}
            trend={trends.reliabilityTrend}
            description="Based on last 5 simulations compared to previous 5"
            icon={<TrendingUpIcon color="primary" />}
            color={trends.reliabilityTrend > 0 ? 'success.main' : 'error.main'}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InsightCard
            title="Optimal Time"
            value={`${trends.bestTimeOfDay}:00`}
            trend={15}
            description="Most reliable departure time based on simulations"
            icon={<TimeIcon color="primary" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <InsightCard
            title="Weather Performance"
            value={bestWeather.condition}
            trend={10}
            description="Best performing weather condition"
            icon={<WeatherIcon color="primary" />}
            color="primary.main"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Route Performance Analysis
        </Typography>
        <Box sx={{ mb: 2 }}>
          {Object.entries(trends.weatherImpact).map(([condition, total]) => {
            const average = total / history.filter(sim => 
              sim.params.weatherCondition === condition
            ).length;
            return (
              <Box key={condition} sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2">
                    {condition}
                  </Typography>
                  <Typography variant="body2">
                    {(average * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={average * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: average > 0.8 ? 'success.main' : 
                        average > 0.6 ? 'warning.main' : 'error.main',
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default SimulationInsights; 