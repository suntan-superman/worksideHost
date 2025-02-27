import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const MetricCard = ({ icon, label, value, color, tooltip }) => (
  <Tooltip title={tooltip}>
    <Box sx={{ textAlign: 'center', p: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h6" color={color || 'text.primary'}>
        {value}
      </Typography>
    </Box>
  </Tooltip>
);

const SimulationMetricsDisplay = ({ metrics, isLive = false }) => {
  if (!metrics) return null;

  const {
    averageSpeed,
    estimatedDuration,
    reliability,
    riskLevel,
    progress,
  } = metrics;

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getReliabilityColor = (value) => {
    if (value >= 0.8) return 'success.main';
    if (value >= 0.6) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flex: 1 }}>
          {isLive ? 'Live Metrics' : 'Simulation Metrics'}
        </Typography>
        {isLive && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="text.secondary">
              Live
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<SpeedIcon color="primary" />}
            label="Average Speed"
            value={`${Math.round(averageSpeed)} km/h`}
            tooltip="Current average speed across all segments"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<TimerIcon color="info" />}
            label="ETA"
            value={formatDuration(estimatedDuration)}
            tooltip="Estimated time of arrival"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<TrendingIcon />}
            label="Reliability"
            value={`${Math.round(reliability * 100)}%`}
            color={getReliabilityColor(reliability)}
            tooltip="Route reliability score"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <MetricCard
            icon={<WarningIcon color={riskLevel > 0.5 ? 'error' : 'inherit'} />}
            label="Risk Level"
            value={`${Math.round(riskLevel * 100)}%`}
            color={riskLevel > 0.5 ? 'error.main' : 'text.primary'}
            tooltip="Current risk assessment"
          />
        </Grid>
      </Grid>

      {isLive && progress !== undefined && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Simulation Progress
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <CircularProgress
                variant="determinate"
                value={progress}
                size={40}
                thickness={4}
                sx={{
                  circle: {
                    strokeLinecap: 'round',
                  },
                }}
              />
            </Box>
            <Typography variant="body2">
              {Math.round(progress)}%
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default SimulationMetricsDisplay; 