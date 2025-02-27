/* eslint-disable */
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import {
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, DragIndicator } from '@mui/icons-material';
import useDeliveryStore from '../../stores/deliveryStore';
import { DEFAULT_DESTINATIONS } from '../../constants/defaultDestinations';

const DIALOG_POSITION_KEY = 'destinationManagerPosition';

const DestinationManager = ({
  open,
  onClose,
  onDestinationsChange,
  initialDestinations = [],
}) => {
  const { destinations, addDestination, removeDestination, setDestinations } = useDeliveryStore();
  
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem(DIALOG_POSITION_KEY);
    if (savedPosition) {
      return JSON.parse(savedPosition);
    }
    // Position dialog in the center-top of the screen
    return {
      x: Math.max(0, (window.innerWidth - 600) / 2),
      y: 100
    };
  });

  const [newDestination, setNewDestination] = useState({
    name: '',
    coordinates: { lat: '', lng: '' },
  });

  useEffect(() => {
    if (open) {
      const savedPosition = localStorage.getItem(DIALOG_POSITION_KEY);
      setPosition(savedPosition ? JSON.parse(savedPosition) : { x: 20, y: -500 });
    }
  }, [open]);

  const handleDragStop = (e, data) => {
    const newPosition = { x: data.x, y: data.y };
    setPosition(newPosition);
    localStorage.setItem(DIALOG_POSITION_KEY, JSON.stringify(newPosition));
  };

  const handleAddDestination = () => {
    if (!newDestination.coordinates.lat || !newDestination.coordinates.lng) return;

    addDestination({
      id: `dest-${Date.now()}`,
      name: newDestination.name || `Destination ${destinations.length + 1}`,
      coordinates: {
        lat: Number(newDestination.coordinates.lat),
        lng: Number(newDestination.coordinates.lng),
      },
    });

    setNewDestination({ name: '', coordinates: { lat: '', lng: '' } });
  };

  const handleDeleteDestination = (id) => {
    removeDestination(id);
  };

  const handleInputChange = (field) => (event) => {
    setNewDestination((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleResetDestinations = () => {
    setDestinations(DEFAULT_DESTINATIONS.map(dest => ({
      ...dest,
      id: `dest-${Date.now()}-${dest.name.toLowerCase()}`
    })));
  };

  if (!open) return null;

  return (
    <Draggable
      handle=".drag-handle"
      position={position}
      onStop={handleDragStop}
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - 600,
        bottom: window.innerHeight - 100
      }}
    >
      <Paper
        sx={{
          position: 'absolute',
          width: 720,
          maxWidth: '90vw',
          backgroundColor: 'white',
          borderRadius: 2,
          zIndex: 1300,
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box 
          className="drag-handle" 
          sx={{ 
            cursor: 'move',
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            backgroundColor: 'rgba(0,0,0,0.03)'
          }}
        >
          <DragIndicator sx={{ mr: 2, color: 'text.secondary' }} />
          <Typography variant="h6">Manage Destinations</Typography>
        </Box>

        <DialogContent sx={{ overflow: 'auto' }}>
          <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Add New Destination</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Name"
                value={newDestination.name}
                onChange={handleInputChange('name')}
                size="small"
                sx={{ flex: 2 }}
              />
              <TextField
                label="Latitude"
                type="number"
                value={newDestination.coordinates.lat}
                onChange={handleInputChange('lat')}
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Longitude"
                type="number"
                value={newDestination.coordinates.lng}
                onChange={handleInputChange('lng')}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAddDestination}
                startIcon={<AddIcon />}
                sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }, color: 'white' }}
              >
                Add
              </Button>
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>Current Destinations</Typography>
          <List>
            {destinations.map((dest) => (
              <ListItem
                key={dest.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteDestination(dest.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
                  <Typography sx={{ minWidth: 150 }}>{dest.name}</Typography>
                  <Typography color="textSecondary">
                    ({dest.coordinates.lat.toFixed(4)}, {dest.coordinates.lng.toFixed(4)})
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(0,0,0,0.12)' }}>
          <Button 
            onClick={onClose}
            variant="contained"
            sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }, color: 'white' }}
          >
            Close
          </Button>
          <Button 
            onClick={handleResetDestinations}
            variant="contained"
            sx={{ bgcolor: 'green', '&:hover': { bgcolor: 'darkgreen' }, color: 'white' }}
          >
            Reset to Default Destinations
          </Button>
        </DialogActions>
      </Paper>
    </Draggable>
  );
};

export default DestinationManager;
