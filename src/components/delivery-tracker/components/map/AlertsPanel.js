import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Paper
} from '@mui/material';
import useDeliveryStore from '../../stores/deliveryStore';
import DraggableDialog from '../common/DraggableDialog';

const AlertsPanel = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const { vehicles = [], destinations = [] } = useDeliveryStore();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!isEnabled) {
      setAlerts([]);
      return;
    }

    // Generate alerts based on vehicle status
    const newAlerts = vehicles.reduce((acc, vehicle) => {
      const destination = destinations.find(d => d.id === vehicle.destinationId);
      
      if (vehicle.status === 'delivering') {
        acc.push({
          id: `${vehicle.id}-delivering`,
          type: 'info',
          message: `${vehicle.name} is en route to ${destination?.name || 'destination'}`,
          timestamp: new Date()
        });
      }
      
      if (vehicle.status === 'returning') {
        acc.push({
          id: `${vehicle.id}-returning`,
          type: 'warning',
          message: `${vehicle.name} is returning to distribution center`,
          timestamp: new Date()
        });
      }

      return acc;
    }, []);

    setAlerts(newAlerts);
  }, [vehicles, destinations, isEnabled]);

  const handleToggle = () => {
    setIsEnabled(prev => !prev);
  };

  return (
    <DraggableDialog
      dialogId="alerts"
      title="Delivery Alerts"
    >
      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={handleToggle}
              color="primary"
            />
          }
          label="Enable Alerts"
        />

        {isEnabled && (
          <List dense>
            {alerts.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No active alerts"
                  secondary="All deliveries are proceeding normally"
                />
              </ListItem>
            ) : (
              alerts.map(alert => (
                <ListItem
                  key={alert.id}
                  sx={{
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: alert.type === 'warning' ? 'warning.light' : 'info.light'
                  }}
                >
                  <ListItemText
                    primary={alert.message}
                    secondary={alert.timestamp.toLocaleTimeString()}
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>
    </DraggableDialog>
  );
};

export default AlertsPanel; 