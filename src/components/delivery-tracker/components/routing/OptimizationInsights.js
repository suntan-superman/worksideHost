import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Cancel as CancelIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { useIntelligentRouting } from '../../hooks/useIntelligentRouting';

const OptimizationInsights = () => {
  const { optimizationStatus, optimizeRoutes, cancelOptimization } = useIntelligentRouting();

  const handleOptimize = async () => {
    try {
      await optimizeRoutes({
        prioritizeTimeWindows: true,
        balanceWorkload: true,
        minimizeFuel: true
      });
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <RouteIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Route Optimization
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Optimize Routes">
              <IconButton
                onClick={handleOptimize}
                disabled={optimizationStatus.isOptimizing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            {optimizationStatus.isOptimizing && (
              <IconButton onClick={cancelOptimization} color="error">
                <CancelIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {optimizationStatus.isOptimizing && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress
              variant="determinate"
              value={optimizationStatus.progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              Optimizing routes...
            </Typography>
          </Box>
        )}

        {optimizationStatus.error && (
          <Chip
            label={optimizationStatus.error}
            color="error"
            size="small"
            sx={{ mb: 2 }}
          />
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Optimization considers:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip label="Traffic Patterns" size="small" />
            <Chip label="Weather Impact" size="small" />
            <Chip label="Time Windows" size="small" />
            <Chip label="Vehicle Capacity" size="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OptimizationInsights; 