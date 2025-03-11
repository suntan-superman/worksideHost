/* eslint-disable */
import React, { useState, useEffect, useRef, useCallback } from "react";
import Draggable from "react-draggable";
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
	Typography,
	Box,
	Alert,
	Paper,
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const DIALOG_POSITION_KEY = "setupDialogPosition";
const STORAGE_KEY = "delivery-vehicle-assignments";

const SimulationSetupDialog = ({ open, onClose, onStart, onError }) => {
	const vehicles = useDeliveryStore((state) => state.vehicles);
	const destinations = useDeliveryStore((state) => state.destinations);
	// eslint-disable-next-line no-unused-vars
	const setVehicles = useDeliveryStore((state) => state.setVehicles);
	const nodeRef = useRef(null);

	const [position, setPosition] = useState(() => {
		const savedPosition = localStorage.getItem(DIALOG_POSITION_KEY);
		if (savedPosition) {
			return JSON.parse(savedPosition);
		}
		// Position dialog in the center-top of the screen
		return {
			x: Math.max(0, (window.innerWidth - 600) / 2),
			y: 100,
		};
	});

	// State to track destination assignments
	const [assignments, setAssignments] = useState({});

	// Save position to localStorage when it changes
	useEffect(() => {
		localStorage.setItem(DIALOG_POSITION_KEY, JSON.stringify(position));
	}, [position]);

	// Clear assignments when dialog opens
	useEffect(() => {
		if (open) {
			setAssignments({});
		}
	}, [open]);

	// Add logging for open prop changes
	useEffect(() => {
		console.log("SimulationSetupDialog: open state changed:", open);
	}, [open]);

	const handleDragStop = (e, data) => {
		const newPosition = { x: data.x, y: data.y };
		setPosition(newPosition);
		localStorage.setItem(DIALOG_POSITION_KEY, JSON.stringify(newPosition));
	};

	const handleAssignment = (vehicleId, destinationId) => {
		console.log("Assigning destination:", {
			vehicleId,
			destinationId,
		});

		setAssignments((prev) => {
			const newAssignments = {
				...prev,
				[vehicleId]: destinationId,
			};
			console.log("Updated assignments:", newAssignments);
			return newAssignments;
		});
	};

	const handleStart = useCallback(async () => {
		try {
			console.log("SimulationSetupDialog: Starting simulation");
			// Set simulation running state before calling onStart
			useDeliveryStore.getState().setSimulationRunning(true);

			if (onStart) {
				await onStart(assignments);
			}
			onClose();
		} catch (error) {
			console.error("Error starting simulation:", error);
			useDeliveryStore.getState().setSimulationRunning(false);
			if (onError) {
				onError("Failed to start simulation");
			}
		}
	}, [assignments, onStart, onClose, onError]);

	const isValidSetup = () => {
		// Check if at least one vehicle has a destination
		return Object.keys(assignments).length > 0;
	};

	// Move saveAssignments inside useCallback to avoid dependency issues
	const saveAssignments = React.useCallback((assignmentsToSave) => (
		localStorage.setItem(STORAGE_KEY, JSON.stringify(assignmentsToSave))
	), []);

	// Load saved assignments when dialog opens
	useEffect(() => {
		if (open) {
			try {
				const saved = localStorage.getItem(STORAGE_KEY);
				if (saved) {
					const savedAssignments = JSON.parse(saved);
					setAssignments(savedAssignments);
				}
			} catch (error) {
				console.error("Failed to load saved assignments:", error);
			}
		}
	}, [open]);

	// Save assignments when they change
	useEffect(() => {
		if (Object.keys(assignments).length > 0) {
			saveAssignments(assignments);
		}
	}, [assignments, saveAssignments]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperComponent={(props) => (
				<Draggable
					handle=".drag-handle"
					position={position}
					onStop={handleDragStop}
					bounds="parent"
					nodeRef={nodeRef}
				>
					<Paper {...props} ref={nodeRef}>
						<Box
							className="drag-handle"
							sx={{
								cursor: "move",
								display: "flex",
								alignItems: "center",
								padding: 2,
								borderBottom: "1px solid rgba(0,0,0,0.12)",
								backgroundColor: "rgba(0,0,0,0.03)",
							}}
						>
							<DragIndicator sx={{ mr: 2, color: "text.secondary" }} />
							<DialogTitle sx={{ p: 0 }}>Simulation Setup</DialogTitle>
						</Box>

						<DialogContent>
							{vehicles.length === 0 || destinations.length === 0 ? (
								<Alert severity="warning" sx={{ mt: 2 }}>
									Please ensure you have both vehicles and destinations
									available before starting the simulation.
								</Alert>
							) : (
								<>
									<Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
										Assign Destinations to Vehicles
									</Typography>
									<List>
										{vehicles.map((vehicle) => (
											<ListItem key={vehicle.id}>
												<Box
													sx={{
														display: "flex",
														width: "100%",
														gap: 2,
														alignItems: "center",
													}}
												>
													<Typography sx={{ minWidth: 200 }}>
														{vehicle.name}
													</Typography>
													<FormControl fullWidth>
														<InputLabel>Destination</InputLabel>
														<Select
															value={assignments[vehicle.id] || ""}
															onChange={(e) =>
																handleAssignment(vehicle.id, e.target.value)
															}
															label="Destination"
														>
															<MenuItem value="">
																<em>None</em>
															</MenuItem>
															{destinations.map((dest) => (
																<MenuItem key={dest.id} value={dest.id}>
																	{dest.name || `Destination ${dest.id}`} (
																	{dest.coordinates.lat.toFixed(3)},{" "}
																	{dest.coordinates.lng.toFixed(3)})
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Box>
											</ListItem>
										))}
									</List>
								</>
							)}
						</DialogContent>

						<DialogActions>
							<Button
								onClick={onClose}
								variant="contained"
								sx={{
									bgcolor: "green",
									"&:hover": { bgcolor: "darkgreen" },
									color: "white",
								}}
							>
								Cancel
							</Button>
							<Button
								onClick={handleStart}
								variant="contained"
								disabled={
									!isValidSetup() ||
									vehicles.length === 0 ||
									destinations.length === 0
								}
								sx={{
									bgcolor: "green",
									"&:hover": { bgcolor: "darkgreen" },
									"&:disabled": { bgcolor: "rgba(0, 128, 0, 0.5)" },
									color: "white",
								}}
							>
								Start Simulation
							</Button>
						</DialogActions>
					</Paper>
				</Draggable>
			)}
		>
			<Box
				className="drag-handle"
				sx={{
					cursor: "move",
					display: "flex",
					alignItems: "center",
					padding: 2,
					borderBottom: "1px solid rgba(0,0,0,0.12)",
					backgroundColor: "rgba(0,0,0,0.03)",
				}}
			>
				<DragIndicator sx={{ mr: 2, color: "text.secondary" }} />
				<DialogTitle sx={{ p: 0 }}>Simulation Setup</DialogTitle>
			</Box>

			<DialogContent>{/* ... rest of the dialog content ... */}</DialogContent>
		</Dialog>
	);
};

export default SimulationSetupDialog;
