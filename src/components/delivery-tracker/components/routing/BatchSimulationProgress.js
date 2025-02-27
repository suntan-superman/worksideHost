import React from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Grid,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';

const BatchSimulationProgress = ({ configs, progress, results }) => {
  const getStatusIcon = (index) => {
    if (!results[index]) return <PendingIcon color="disabled" />;
    return results[index].error ? 
      <ErrorIcon color="error" /> : 
      <SuccessIcon color="success" />;
  };

  const getStatusText = (index) => {
    if (!results[index]) return 'Pending';
    return results[index].error ? 'Failed' : 'Completed';
  };

  const getProgressColor = (index) => {
    if (!results[index]) return 'primary';
    return results[index].error ? 'error' : 'success';
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Batch Simulation Progress
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Overall Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(progress.completed / configs.length) * 100}
          sx={{ height: 8, borderRadius: 4 }}
        />
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          {progress.completed} of {configs.length} simulations completed
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {configs.map((config, index) => (
          <Grid item xs={12} key={config.id}>
            <Box sx={{ 
              p: 1.5, 
              border: 1, 
              borderColor: 'divider',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Tooltip title={getStatusText(index)}>
                {getStatusIcon(index)}
              </Tooltip>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Configuration {index + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    size="small"
                    label={config.weatherCondition}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={`${config.timeOfDay}:00`}
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Box sx={{ width: '30%' }}>
                <LinearProgress
                  variant="determinate"
                  value={results[index]?.progress || 0}
                  color={getProgressColor(index)}
                />
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {progress.errors > 0 && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ErrorIcon color="error" />
          <Typography color="error.main">
            {progress.errors} simulation{progress.errors > 1 ? 's' : ''} failed
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default BatchSimulationProgress; 