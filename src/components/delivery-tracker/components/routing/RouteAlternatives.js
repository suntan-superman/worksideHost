import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CompareArrows as CompareIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

const RouteAlternatives = ({ alternatives, onSelectRoute, selectedIndex }) => {
  const getRouteScore = (route) => {
    const reliabilityWeight = 0.4;
    const speedWeight = 0.3;
    const riskWeight = 0.3;

    const reliabilityScore = route.metrics.reliability * reliabilityWeight;
    const speedScore = (route.metrics.averageSpeed / 60) * speedWeight;
    const riskScore = (1 - route.metrics.riskLevel) * riskWeight;

    return (reliabilityScore + speedScore + riskScore) * 100;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CompareIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          Route Alternatives
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {alternatives.map((route, index) => {
          const score = getRouteScore(route);
          return (
            <Grid item xs={12} key={route.id || index}>
              <Paper
                elevation={selectedIndex === index ? 3 : 1}
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  bgcolor: selectedIndex === index ? 'action.selected' : 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                onClick={() => onSelectRoute(index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ flex: 1 }}>
                    Route {index + 1}
                    {index === 0 && (
                      <Tooltip title="Recommended Route">
                        <StarIcon
                          color="primary"
                          fontSize="small"
                          sx={{ ml: 1, verticalAlign: 'middle' }}
                        />
                      </Tooltip>
                    )}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${Math.round(score)}%`}
                    color={getScoreColor(score)}
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SpeedIcon fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="body2">
                        {Math.round(route.metrics.averageSpeed)} km/h
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WarningIcon
                        fontSize="small"
                        sx={{ mr: 0.5 }}
                        color={route.metrics.riskLevel > 0.5 ? 'error' : 'inherit'}
                      />
                      <Typography variant="body2">
                        {Math.round(route.metrics.riskLevel * 100)}% risk
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      {route.segments.length} segments
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default RouteAlternatives; 