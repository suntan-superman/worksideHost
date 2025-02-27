import React from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRouteHistory } from '../../hooks/useRouteHistory';

const RouteHistoryPanel = ({ routeId }) => {
  const { history, metrics, loading, error } = useRouteHistory(routeId);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric'
    });
  };

  const getPerformanceColor = (score) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  const chartData = history.map(entry => ({
    timestamp: formatDate(entry.timestamp),
    performance: entry.performance,
    traffic: entry.conditions.traffic.congestionLevel,
    complexity: entry.complexity.complexityScore
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Route Performance History
      </Typography>

      {metrics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Average Performance
              </Typography>
              <Chip
                label={`${(metrics.averagePerformance * 100).toFixed(1)}%`}
                color={getPerformanceColor(metrics.averagePerformance)}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Consistency Score
              </Typography>
              <Chip
                label={`${(metrics.consistency * 100).toFixed(1)}%`}
                color={getPerformanceColor(metrics.consistency)}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Performance Trend
              </Typography>
              <Chip
                label={metrics.trend > 0 ? 'Improving' : 'Declining'}
                color={metrics.trend > 0 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
        </Grid>
      )}

      <Box sx={{ height: 300, mb: 3 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="performance"
              stroke="#2196f3"
              name="Performance"
            />
            <Line
              type="monotone"
              dataKey="traffic"
              stroke="#ff9800"
              name="Traffic"
            />
            <Line
              type="monotone"
              dataKey="complexity"
              stroke="#4caf50"
              name="Complexity"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" gutterBottom>
        Recommendations
      </Typography>

      {metrics?.recommendations.map((rec, index) => (
        <Alert
          key={index}
          severity={rec.priority === 'high' ? 'warning' : 'info'}
          sx={{ mb: 1 }}
        >
          {rec.description}
        </Alert>
      ))}
    </Paper>
  );
};

export default RouteHistoryPanel; 