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
	IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useDeliveryStore from '../../stores/deliveryStore';

const DistributionCenterDialog = ({ open, onClose }) => {
    const { distributionCenters, addDistributionCenter, removeDistributionCenter, updateDistributionCenter } = useDeliveryStore();
    const [newCenter, setNewCenter] = useState({ name: '', lat: '', lng: '' });
    const [editingCenter, setEditingCenter] = useState(null);

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

    return (
					<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
						<DialogTitle>Manage Distribution Centers</DialogTitle>
						<DialogContent>
							<form onSubmit={handleSubmit}>
								<TextField
									label="Name"
									value={newCenter.name}
									onChange={(e) =>
										setNewCenter((prev) => ({ ...prev, name: e.target.value }))
									}
									fullWidth
									margin="normal"
									required
								/>
								<TextField
									label="Latitude"
									value={newCenter.lat}
									onChange={(e) =>
										setNewCenter((prev) => ({ ...prev, lat: e.target.value }))
									}
									fullWidth
									margin="normal"
									type="number"
									required
								/>
								<TextField
									label="Longitude"
									value={newCenter.lng}
									onChange={(e) =>
										setNewCenter((prev) => ({ ...prev, lng: e.target.value }))
									}
									fullWidth
									margin="normal"
									type="number"
									required
								/>
								<Button
									type="submit"
									variant="contained"
									color="primary"
									fullWidth
									sx={{ mt: 2 }}
								>
									{editingCenter ? "Update Center" : "Add Center"}
								</Button>
							</form>

							<List sx={{ mt: 4 }}>
								{distributionCenters.map((center) => (
									<ListItem
										key={center.id}
										secondaryAction={
											<>
												<IconButton
													edge="end"
													onClick={() => handleEdit(center)}
												>
													<EditIcon />
												</IconButton>
												<IconButton
													edge="end"
													onClick={() => removeDistributionCenter(center.id)}
													sx={{ ml: 1 }}
												>
													<DeleteIcon />
												</IconButton>
											</>
										}
									>
										<ListItemText
											primary={center.name}
											secondary={`${center.coordinates.lat}, ${center.coordinates.lng}`}
										/>
									</ListItem>
								))}
							</List>
						</DialogContent>
						<DialogActions>
							<Button onClick={onClose}>Close</Button>
						</DialogActions>
					</Dialog>
				);
};

export default DistributionCenterDialog; 