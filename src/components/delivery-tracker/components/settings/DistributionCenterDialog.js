/* eslint-disable */
import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useDeliveryStore from '../../stores/deliveryStore';
import Draggable from 'react-draggable';
import VehicleDCAssociationDialog from './VehicleDCAssociationDialog';

// Draggable Paper component
const DraggablePaper = (props) => (
    <Draggable
        handle="#draggable-dialog-title"
        bounds="parent"
        defaultPosition={JSON.parse(localStorage.getItem('dcDialogPosition')) || { x: 0, y: 0 }}
        onStop={(e, data) => {
            localStorage.setItem('dcDialogPosition', JSON.stringify({ x: data.x, y: data.y }));
        }}
    >
        <Paper {...props} />
    </Draggable>
);

const DistributionCenterDialog = ({ open, onClose }) => {
    const { 
        distributionCenters, 
        addDistributionCenter, 
        removeDistributionCenter, 
        updateDistributionCenter,
        vehicles 
    } = useDeliveryStore();
    const [newCenter, setNewCenter] = useState({ name: '', lat: '', lng: '' });
    const [editingCenter, setEditingCenter] = useState(null);
    const [vehicleAssociationOpen, setVehicleAssociationOpen] = useState(false);

    // Check if we can enable the association button
    const canAssociateVehicles = distributionCenters.length > 0 && vehicles.length > 0;

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (editingCenter) {
            updateDistributionCenter({
                ...editingCenter,
                name: newCenter.name,
                coordinates: {
                    lat: Number(newCenter.lat),
                    lng: Number(newCenter.lng)
                }
            });
            setEditingCenter(null);
        } else {
            addDistributionCenter({
                id: `dc-${Date.now()}`,
                name: newCenter.name,
                coordinates: {
                    lat: Number(newCenter.lat),
                    lng: Number(newCenter.lng)
                }
            });
        }
        setNewCenter({ name: '', lat: '', lng: '' });
    }, [newCenter, editingCenter, addDistributionCenter, updateDistributionCenter]);

    const handleEdit = useCallback((center) => {
        setEditingCenter(center);
        setNewCenter({
            name: center.name,
            lat: center.coordinates.lat.toString(),
            lng: center.coordinates.lng.toString()
        });
    }, []);

    const handleAssociateVehicles = () => {
        setVehicleAssociationOpen(true);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="md" 
            fullWidth
            PaperComponent={DraggablePaper}
            aria-labelledby="draggable-dialog-title"
        >
            <DialogTitle 
                style={{ cursor: 'move' }} 
                id="draggable-dialog-title"
            >
                Manage Distribution Centers
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Center Name"
                        value={newCenter.name}
                        onChange={(e) => setNewCenter({ ...newCenter, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Latitude"
                        value={newCenter.lat}
                        onChange={(e) => setNewCenter({ ...newCenter, lat: e.target.value })}
                        margin="normal"
                        type="number"
                    />
                    <TextField
                        fullWidth
                        label="Longitude"
                        value={newCenter.lng}
                        onChange={(e) => setNewCenter({ ...newCenter, lng: e.target.value })}
                        margin="normal"
                        type="number"
                    />
                    <Button 
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: "green",
                            "&:hover": {
                                backgroundColor: "darkgreen",
                            },
                        }}
                    >
                        {editingCenter ? 'Update' : 'Add'} Center
                    </Button>
                </form>

                <List sx={{ mt: 4 }}>
                    {distributionCenters.map((center) => (
                        <ListItem key={center.id}>
                            <ListItemText
                                primary={center.name}
                                secondary={`${center.coordinates.lat}, ${center.coordinates.lng}`}
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleEdit(center)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton 
                                    edge="end" 
                                    onClick={() => removeDistributionCenter(center.id)}
                                    sx={{ ml: 1 }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button 
                    variant="contained"
                    onClick={handleAssociateVehicles}
                    disabled={!canAssociateVehicles}
                    sx={{
                        backgroundColor: "green",
                        "&:hover": {
                            backgroundColor: "darkgreen",
                        },
                        "&.Mui-disabled": {
                            backgroundColor: "#cccccc",
                        },
                    }}
                >
                    Associate Vehicles
                </Button>
                <Button 
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: "green",
                        "&:hover": {
                            backgroundColor: "darkgreen",
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
            <VehicleDCAssociationDialog
                open={vehicleAssociationOpen}
                onClose={() => setVehicleAssociationOpen(false)}
            />
        </Dialog>
    );
};

export default DistributionCenterDialog; 