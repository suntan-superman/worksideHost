/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Typography,
	Box,
} from "@mui/material";
import useDeliveryStore from "../../stores/deliveryStore";
import useMapStore from "../../stores/mapStore";

const MapSettingsDialog = ({ open, onClose }) => {
	const mapInstance = useMapStore((state) => state.mapInstance);
	const destinations = useDeliveryStore((state) => state.destinations);
	const originLocation = useDeliveryStore((state) => state.originLocation);

	const [mapSettings, setMapSettings] = useState({
		center: {
			lat: 35.3733,
			lng: -119.0187,
		},
		zoom: 8,
		radius: 50,
		unit: "miles",
	});

	useEffect(() => {
		// console.log("MapSettingsDialog: mapInstance changed:", {
		// 	hasInstance: Boolean(mapInstance),
		// 	methods: mapInstance ? Object.keys(mapInstance) : [],
		// });

		if (!open || !mapInstance) return;

		try {
			const center = mapInstance.getCenter();
			const zoom = mapInstance.getZoom();

			setMapSettings((prev) => ({
				...prev,
				center: {
					lat: center.lat(),
					lng: center.lng(),
				},
				zoom: zoom,
			}));
		} catch (error) {
			console.error("Error getting map state:", error);
		}
	}, [open, mapInstance]);

	const fitToMarkers = () => {
		try {
			const bounds = {
				north: -90,
				south: 90,
				east: -180,
				west: 180,
			};

			console.log("Starting fitToMarkers with bounds:", bounds);
			console.log("Origin location:", originLocation);
			console.log("Destinations:", destinations);

			// Include origin location
			if (originLocation) {
				bounds.north = Math.max(bounds.north, originLocation.lat);
				bounds.south = Math.min(bounds.south, originLocation.lat);
				bounds.east = Math.max(bounds.east, originLocation.lng);
				bounds.west = Math.min(bounds.west, originLocation.lng);
			}

			// Include all destinations
			for (const dest of destinations) {
				bounds.north = Math.max(bounds.north, dest.coordinates.lat);
				bounds.south = Math.min(bounds.south, dest.coordinates.lat);
				bounds.east = Math.max(bounds.east, dest.coordinates.lng);
				bounds.west = Math.min(bounds.west, dest.coordinates.lng);
			}

			console.log("Calculated bounds:", bounds);

			// Add padding
			const padding = 0.1; // 10% padding
			const latDiff = (bounds.north - bounds.south) * padding;
			const lngDiff = (bounds.east - bounds.west) * padding;

			const newSettings = {
				...mapSettings,
				center: {
					lat: (bounds.north + bounds.south) / 2,
					lng: (bounds.east + bounds.west) / 2,
				},
				zoom: 10,
			};

			console.log("New settings after fit:", newSettings);
			setMapSettings(newSettings);

			// Use mapInstance for immediate updates
			if (mapInstance) {
				mapInstance.panTo(newSettings.center);
				mapInstance.setZoom(newSettings.zoom);
			}
		} catch (e) {
			console.error("Failed to fit markers:", e);
		}
	};

	const saveCurrentSettings = () => {
		if (!mapInstance) {
			console.error("No map instance available");
			return;
		}

		try {
			const center = mapInstance.getCenter();
			const zoom = mapInstance.getZoom();

			const settings = {
				...mapSettings,
				center: {
					lat: center.lat(),
					lng: center.lng(),
				},
				zoom: zoom,
			};

			localStorage.setItem("delivery-map-settings", JSON.stringify(settings));
			window.dispatchEvent(
				new CustomEvent("mapSettingsChanged", {
					detail: settings,
				}),
			);

			onClose();
		} catch (error) {
			console.error("Error saving settings:", error);
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: "100%",
					maxWidth: 600,
					bgcolor: "background.paper",
				},
			}}
		>
			<DialogTitle
				sx={{
					bgcolor: "black",
					color: "white",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				Map Settings
			</DialogTitle>
			<DialogContent sx={{ mt: 2 }}>
				<Grid container spacing={3}>
					<Grid item xs={6}>
						<TextField
							label="Latitude"
							type="number"
							value={mapSettings.center.lat}
							onChange={(e) =>
								setMapSettings({
									...mapSettings,
									center: {
										...mapSettings.center,
										lat: Number(e.target.value),
									},
								})
							}
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									"&.Mui-focused fieldset": {
										borderColor: "green",
									},
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "green",
								},
								marginTop: "10px",
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							label="Longitude"
							type="number"
							value={mapSettings.center.lng}
							onChange={(e) =>
								setMapSettings({
									...mapSettings,
									center: {
										...mapSettings.center,
										lng: Number(e.target.value),
									},
								})
							}
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									"&.Mui-focused fieldset": {
										borderColor: "green",
									},
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "green",
								},
								marginTop: "10px",
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<TextField
							label="Zoom Level"
							type="number"
							value={mapSettings.zoom}
							onChange={(e) =>
								setMapSettings({
									...mapSettings,
									zoom: Number(e.target.value),
								})
							}
							inputProps={{ min: 1, max: 20 }}
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									"&.Mui-focused fieldset": {
										borderColor: "green",
									},
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "green",
								},
							}}
						/>
					</Grid>
					<Grid item xs={6}>
						<FormControl fullWidth>
							<InputLabel sx={{ "&.Mui-focused": { color: "green" } }}>
								Unit
							</InputLabel>
							<Select
								value={mapSettings.unit}
								label="Unit"
								onChange={(e) =>
									setMapSettings({
										...mapSettings,
										unit: e.target.value,
									})
								}
								sx={{
									"& .MuiOutlinedInput-notchedOutline": {
										"&.Mui-focused": {
											borderColor: "green",
										},
									},
								}}
							>
								<MenuItem value="miles">Miles</MenuItem>
								<MenuItem value="kilometers">Kilometers</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ mt: 2 }}>
							<Button
								variant="contained"
								onClick={fitToMarkers}
								fullWidth
								sx={{
									bgcolor: "green",
									"&:hover": {
										bgcolor: "darkgreen",
									},
									color: "white",
								}}
							>
								Fit Map to Show All Markers
							</Button>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions sx={{ p: 2, gap: 1 }}>
				<Button
					onClick={saveCurrentSettings}
					variant="contained"
					sx={{
						bgcolor: "green",
						"&:hover": {
							bgcolor: "darkgreen",
						},
						color: "white",
					}}
				>
					Save Current Settings
				</Button>
				<Button
					onClick={onClose}
					variant="contained"
					sx={{
						bgcolor: "green",
						"&:hover": {
							bgcolor: "darkgreen",
						},
						color: "white",
					}}
				>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default MapSettingsDialog; 