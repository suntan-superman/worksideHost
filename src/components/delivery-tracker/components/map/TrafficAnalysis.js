import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { useTrafficData } from '../../hooks/useTrafficData';
import { calculateDistance } from '../../utils/mapUtils';

const TrafficAnalysis = () => {
  const { trafficData, isLoading } = useTrafficData();
  const { vehicles, destinations } = useDeliveryStore();

  const analysis = useMemo(() => {
    if (!trafficData) return null;

    return vehicles.map(vehicle => {
      const destination = destinations.find(d => d.id === vehicle.destinationId);
      if (!destination) return null;

      const distance = calculateDistance(vehicle.location, destination.coordinates);
      const trafficDelay = trafficData.getDelay(vehicle.location, destination.coordinates);
      const normalTime = distance / 35 * 60; // 35 mph average speed
      const estimatedTime = normalTime + trafficDelay;

      return {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        normalTime,
        estimatedTime,
        delay: trafficDelay,
        severity: trafficDelay / normalTime // Delay as percentage of normal time
      };
    }).filter(Boolean);
  }, [trafficData, vehicles, destinations]);

  if (isLoading) return <LinearProgress />;
  if (!analysis) return null;

  return (
    <Paper
      sx={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 300,
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        zIndex: 1000
      }}
    >
      <Typography variant="h6" gutterBottom>
        Traffic Impact
      </Typography>
      {analysis.map(item => (
        <Box key={item.vehicleId} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">{item.vehicleName}</Typography>
            <Tooltip title={`${Math.round(item.delay)} minutes delay`}>
              <Typography
                variant="body2"
                color={item.severity > 0.25 ? 'error' : 'text.secondary'}
              >
                +{Math.round(item.delay)}m
              </Typography>
            </Tooltip>
          </Box>
          <LinearProgress
            variant="buffer"
            value={(item.normalTime / item.estimatedTime) * 100}
            valueBuffer={100}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: 'rgba(0,0,0,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: item.severity > 0.25 ? '#f44336' : '#4caf50'
              }
            }}
          />
        </Box>
      ))}
    </Paper>
  );
};

export default TrafficAnalysis; 