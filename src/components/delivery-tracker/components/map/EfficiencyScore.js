import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { useDeliveryStore } from '../../stores/deliveryStore';
import { useDeliveryTimeWindows } from '../../hooks/useDeliveryTimeWindows';

const EfficiencyScore = () => {
  const { vehicles, destinations } = useDeliveryStore();
  const { isDeliveryInWindow } = useDeliveryTimeWindows();

  const scores = useMemo(() => {
    const totalDeliveries = destinations.length;
    if (totalDeliveries === 0) return null;

    const completedDeliveries = vehicles.filter(v => v.status === 'arrived').length;
    const inWindowDeliveries = destinations.filter(d => isDeliveryInWindow(d.id)).length;
    
    const deliveryScore = (completedDeliveries / totalDeliveries) * 100;
    const timeScore = (inWindowDeliveries / totalDeliveries) * 100;
    
    const vehicleUtilization = vehicles.filter(v => v.status !== 'idle').length / vehicles.length * 100;
    
    const overallScore = (deliveryScore + timeScore + vehicleUtilization) / 3;

    return {
      overall: overallScore,
      delivery: deliveryScore,
      time: timeScore,
      utilization: vehicleUtilization
    };
  }, [vehicles, destinations, isDeliveryInWindow]);

  if (!scores) return null;

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 80,
        left: 20,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1000,
        width: 200
      }}
    >
      <Typography variant="h6" gutterBottom>
        Efficiency Score
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={scores.overall}
          size={80}
          thickness={4}
          sx={{
            color: scores.overall > 75 ? 'success.main' : 
                  scores.overall > 50 ? 'warning.main' : 'error.main'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" component="div">
            {Math.round(scores.overall)}%
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {[
          { label: 'Delivery Rate', value: scores.delivery },
          { label: 'Time Window', value: scores.time },
          { label: 'Vehicle Usage', value: scores.utilization }
        ].map(metric => (
          <Tooltip 
            key={metric.label}
            title={`${metric.label}: ${Math.round(metric.value)}%`}
          >
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {metric.label}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metric.value}
                sx={{
                  height: 6,
                  borderRadius: 1,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                  }
                }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Paper>
  );
};

export default EfficiencyScore; 