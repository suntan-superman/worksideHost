import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Traffic as TrafficIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';

const SegmentDetailView = ({ segment, index, totalSegments }) => {
  if (!segment) return null;

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTrafficColor = (density) => {
    if (density > 1.5) return 'error';
    if (density > 1.2) return 'warning';
    return 'success';
  };

  const getEfficiencyScore = () => {
    const baseEfficiency = segment.simulatedDuration / segment.duration;
    return Math.max(0, Math.min(100, (2 - baseEfficiency) * 100));
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" sx={{ flex: 1 }}>
          Segment {index + 1} of {totalSegments}
        </Typography>
        {segment.riskFactors.length > 0 && (
          <Tooltip title={`${segment.riskFactors.length} risk factors detected`}>
            <Chip
              icon={<WarningIcon />}
              label={segment.riskFactors.length}
              color="warning"
              size="small"
            />
          </Tooltip>
        )}
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 2 }}
      >
        {segment.instruction}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TimerIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="h6">
              {formatDuration(segment.simulatedDuration)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Base: {formatDuration(segment.duration)}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <TrafficIcon color={getTrafficColor(segment.trafficDensity)} sx={{ mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Traffic Density
              </Typography>
            </Box>
            <Typography variant="h6">
              {(segment.trafficDensity * 100).toFixed(0)}%
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingIcon sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Efficiency Score
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={getEfficiencyScore()}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: getEfficiencyScore() > 70 ? '#4caf50' : '#ff9800',
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          {getEfficiencyScore().toFixed(1)}% efficient
        </Typography>
      </Box>

      {segment.riskFactors.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Risk Factors
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {segment.riskFactors.map((risk, idx) => (
              <Chip
                key={idx}
                icon={<WarningIcon />}
                label={risk.description}
                color={risk.severity > 0.7 ? 'error' : 'warning'}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SegmentDetailView; 