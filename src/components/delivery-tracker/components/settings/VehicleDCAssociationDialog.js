/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
} from '@mui/material';
import useDeliveryStore from '../../stores/deliveryStore';

const VehicleDCAssociationDialog = ({ open, onClose }) => {
    const { vehicles, distributionCenters, assignVehicleToCenter } = useDeliveryStore();
    const [assignments, setAssignments] = useState({});

    useEffect(() => {
        // Initialize assignments with current values from stored state
        const currentAssignments = vehicles.reduce((acc, vehicle) => {
            // Use the stored DC ID if available
            acc[vehicle.id] = vehicle.distributionCenterId || '';
            return acc;
        }, {});
        setAssignments(currentAssignments);
    }, [vehicles]);

    const handleAssignmentChange = (vehicleId, centerId) => {
        setAssignments((prev) => ({
            ...prev,
            [vehicleId]: centerId,
        }));
    };

    const handleSave = () => {
        for (const [vehicleId, centerId] of Object.entries(assignments)) {
            if (centerId) {  // Only assign if a center is selected
                assignVehicleToCenter(vehicleId, centerId);
            }
        }
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Associate Vehicles with Distribution Centers</DialogTitle>
            <DialogContent>
                <List>
                    {vehicles.map((vehicle) => (
                        <ListItem key={vehicle.id}>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="subtitle1">
                                    {vehicle.name}
                                </Typography>
                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel>Distribution Center</InputLabel>
                                    <Select
                                        value={assignments[vehicle.id] || ''}
                                        onChange={(e) => handleAssignmentChange(vehicle.id, e.target.value)}
                                        sx={{
                                            '&.MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: 'green',
                                                },
                                            },
                                        }}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        {distributionCenters.map((dc) => (
                                            <MenuItem key={dc.id} value={dc.id}>
                                                {dc.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose}
                    sx={{
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": { backgroundColor: "darkgreen" },
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSave}
                    sx={{
                        backgroundColor: "green",
                        color: "white",
                        "&:hover": { backgroundColor: "darkgreen" },
                    }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VehicleDCAssociationDialog; 