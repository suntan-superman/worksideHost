import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Update as UpdateIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { usePredictiveAnalytics } from '../../hooks/usePredictiveAnalytics';

const PredictiveInsights = ({ routeData }) => {
  const { predictions, isLoading, predictDeliveryTime } = usePredictiveAnalytics();

  const handleRefresh = async () => {
    await predictDeliveryTime(routeData);
  };

  const prediction = predictions[routeData.routeId];

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TimelineIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Delivery Prediction
          </Typography>
          <Tooltip title="Update prediction">
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <UpdateIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {isLoading ? (
          <CircularProgress size={24} />
        ) : prediction ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SpeedIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h4">
                {prediction.time} min
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                Confidence Score
              </Typography>
              <Typography variant="body2" color="primary">
                {prediction.confidence}%
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Last updated: {new Date(prediction.timestamp).toLocaleTimeString()}
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">
            No prediction available
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveInsights; 