import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useDeliveryTimeWindows } from '../../hooks/useDeliveryTimeWindows';
import useDeliveryStore from '../../stores/deliveryStore';

const TimeWindowEditor = ({ open, onClose }) => {
  const { destinations } = useDeliveryStore();
  const { timeWindows, addTimeWindow, removeTimeWindow } = useDeliveryTimeWindows();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSave = () => {
    if (!selectedDestination) return;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    addTimeWindow(selectedDestination, {
      start: startHours + startMinutes / 60,
      end: endHours + endMinutes / 60
    });

    setSelectedDestination(null);
    setStartTime('');
    setEndTime('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delivery Time Windows</DialogTitle>
      <DialogContent>
        <List>
          {destinations.map(dest => (
            <ListItem
              key={dest.id}
              secondaryAction={
                timeWindows.has(dest.id) ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => setSelectedDestination(dest.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => removeTimeWindow(dest.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedDestination(dest.id)}
                  >
                    Add Window
                  </Button>
                )
              }
            >
              <ListItemText
                primary={dest.name}
                secondary={
                  timeWindows.has(dest.id)
                    ? `${formatTime(timeWindows.get(dest.id).start)} - ${formatTime(timeWindows.get(dest.id).end)}`
                    : 'No time window set'
                }
              />
            </ListItem>
          ))}
        </List>

        {selectedDestination && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Set Time Window
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <Typography>to</Typography>
              <TextField
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {selectedDestination && (
          <Button onClick={handleSave} variant="contained">
            Save Time Window
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

const formatTime = (hours) => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  return `${wholeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export default TimeWindowEditor; 