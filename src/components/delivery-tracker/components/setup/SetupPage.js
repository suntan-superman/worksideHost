import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDestinations } from "../../stores/deliveryStore";
import { calculateDistance } from '../../utils/mapUtils';

const RADIUS_LIMIT = 100; // 100 mile radius
const DISTRIBUTION_CENTER = { lat: 35.48, lng: -118.9 };

const SetupPage = () => {
  const navigate = useNavigate();
  const { destinations = [], addDestination, removeDestination, vehicles = [], setVehicles } = useDestinations();
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '' });

  const handleAddLocation = () => {
    const lat = Number.parseFloat(newLocation.lat);
    const lng = Number.parseFloat(newLocation.lng);
    
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      alert('Please enter valid coordinates');
      return;
    }
    
    // Validate coordinates are within radius limit
    const distance = calculateDistance(DISTRIBUTION_CENTER, { lat, lng });
    
    if (distance > RADIUS_LIMIT) {
      alert(`Location must be within ${RADIUS_LIMIT} miles of the distribution center`);
      return;
    }

    addDestination({
      id: Date.now().toString(),
      name: newLocation.name || `Location ${destinations.length + 1}`,
      coordinates: { lat, lng }
    });
    
    setNewLocation({ name: '', lat: '', lng: '' });
  };

  const initializeVehicles = () => {
    if (!destinations || destinations.length === 0) {
      alert('Please add at least one destination before initializing vehicles');
      return;
    }

    const newVehicles = Array.from({ length: 6 }, (_, i) => ({
      id: `vehicle-${i + 1}`,
      name: `Vehicle ${i + 1}`,
      location: {
        lat: 35.48,
        lng: -118.9
      },
      status: 'idle',
      destinationId: destinations[i % destinations.length]?.id || null,
      lastUpdate: new Date().toISOString()
    }));
    
    // console.log('Initializing vehicles:', newVehicles);
    setVehicles(newVehicles);
  };

  const handleAddDestination = (newDestination) => {
    console.log('Adding destination:', newDestination);
    addDestination({
      id: `dest-${Date.now()}`,
      ...newDestination,
      coordinates: {
        lat: Number.parseFloat(newDestination.lat),
        lng: Number.parseFloat(newDestination.lng)
      }
    });
  };

  const canProceedToMap = destinations.length > 0;

  const handleViewMap = () => {
    if (!vehicles || vehicles.length === 0) {
      initializeVehicles();
    }
    navigate('/map');
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Delivery Setup
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Delivery Location
              </Typography>
              <TextField
                fullWidth
                label="Location Name"
                value={newLocation.name}
                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={newLocation.lat}
                onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={newLocation.lng}
                onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
                margin="normal"
              />
              <Button
                variant="contained"
                onClick={handleAddLocation}
                disabled={!newLocation.name || !newLocation.lat || !newLocation.lng}
                sx={{ mt: 2 }}
              >
                Add Location
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Locations
              </Typography>
              <List>
                {destinations.map((dest) => (
                  <React.Fragment key={dest.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end" onClick={() => removeDestination(dest.id)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={dest.name}
                        secondary={`${dest.coordinates.lat}, ${dest.coordinates.lng}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleViewMap}
              disabled={!canProceedToMap}
            >
              View Map
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Note: Delivery locations must be within {RADIUS_LIMIT} miles of the distribution center.
      </Typography>
    </Box>
  );
};

export default SetupPage; 