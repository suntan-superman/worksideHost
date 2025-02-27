import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Warning as WarningIcon,
  Traffic as TrafficIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

const SegmentAnalysis = ({ segment }) => {
  const getTrafficLevel = (density) => {
    if (density > 1.5) return { label: 'Heavy', color: 'error' };
    if (density > 1.2) return { label: 'Moderate', color: 'warning' };
    return { label: 'Light', color: 'success' };
  };

  const getRiskSeverity = (severity) => {
    if (severity > 0.7) return 'error';
    if (severity > 0.4) return 'warning';
    return 'info';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Segment Details
        </Typography>
        <Typography
          variant="body1"
          dangerouslySetInnerHTML={{ __html: segment.instruction }}
        />
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Traffic Density
            </Typography>
            <Chip
              icon={<TrafficIcon />}
              label={getTrafficLevel(segment.trafficDensity).label}
              color={getTrafficLevel(segment.trafficDensity).color}
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary">
              Risk Level
            </Typography>
            <Chip
              icon={<WarningIcon />}
              label={`${segment.riskFactors.length} Risks`}
              color={segment.riskFactors.length > 0 ? 'warning' : 'success'}
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      {segment.riskFactors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Risk Factors
          </Typography>
          <List dense>
            {segment.riskFactors.map((risk, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <WarningIcon color={getRiskSeverity(risk.severity)} />
                </ListItemIcon>
                <ListItemText
                  primary={risk.type}
                  secondary={risk.description}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Performance Metrics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Duration Impact
              </Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(segment.simulatedDuration / segment.duration) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: segment.simulatedDuration > segment.duration * 1.2
                        ? '#f44336'
                        : '#4caf50',
                    },
                  }}
                />
                <Typography variant="caption">
                  {((segment.simulatedDuration / segment.duration - 1) * 100).toFixed(1)}% impact
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Traffic Flow
              </Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(1 / segment.trafficDensity) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: segment.trafficDensity > 1.5
                        ? '#f44336'
                        : '#4caf50',
                    },
                  }}
                />
                <Typography variant="caption">
                  {((1 / segment.trafficDensity) * 100).toFixed(1)}% efficiency
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SegmentAnalysis; 