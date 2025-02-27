import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Speed as SpeedIcon,
  Traffic as TrafficIcon,
  WbSunny as WeatherIcon,
  Schedule as TimeIcon,
} from '@mui/icons-material';
import { useRouteHistory } from '../../hooks/useRouteHistory';

const RoutePerformanceInsights = ({ routeId }) => {
  const { metrics, loading } = useRouteHistory(routeId);

  if (loading || !metrics) {
    return <LinearProgress />;
  }

  const generateInsights = () => {
    const insights = [];

    // Performance trend insights
    if (Math.abs(metrics.trend) > 0.05) {
      insights.push({
        icon: metrics.trend > 0 ? <TrendingUp color="success" /> : <TrendingDown color="error" />,
        primary: metrics.trend > 0 ? 'Improving Performance' : 'Declining Performance',
        secondary: `Route performance has ${metrics.trend > 0 ? 'improved' : 'declined'} by ${Math.abs(metrics.trend * 100).toFixed(1)}% recently`,
      });
    }

    // Consistency insights
    if (metrics.consistency < 0.7) {
      insights.push({
        icon: <SpeedIcon color="warning" />,
        primary: 'Inconsistent Performance',
        secondary: 'High variability in route completion times',
      });
    }

    // Weather impact insights
    if (metrics.recommendations.some(rec => rec.type === 'weather')) {
      insights.push({
        icon: <WeatherIcon color="info" />,
        primary: 'Weather Sensitivity',
        secondary: 'Route performance varies significantly with weather conditions',
      });
    }

    // Time-based insights
    if (metrics.recommendations.some(rec => rec.type === 'timing')) {
      insights.push({
        icon: <TimeIcon color="warning" />,
        primary: 'Time-Sensitive Route',
        secondary: 'Performance varies based on time of day',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Performance Insights
      </Typography>

      <List>
        {insights.map((insight, index) => (
          <ListItem key={index}>
            <ListItemIcon>
              <Tooltip title={insight.secondary}>
                {insight.icon}
              </Tooltip>
            </ListItemIcon>
            <ListItemText
              primary={insight.primary}
              secondary={insight.secondary}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Performance Score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={metrics.averagePerformance * 100}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: metrics.averagePerformance > 0.7 ? '#4caf50' : '#ff9800',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary">
          {(metrics.averagePerformance * 100).toFixed(1)}% efficiency
        </Typography>
      </Box>
    </Paper>
  );
};

export default RoutePerformanceInsights; 