import React from "react";
import {
	Paper,
	Typography,
	Box,
	Chip,
	IconButton,
	LinearProgress,
	Divider,
} from "@mui/material";
import {
	LocalShipping as VehicleIcon,
	LocationOn,
	Speed as SpeedIcon,
	Timeline as RouteIcon,
	Close as CloseIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const VehicleStatusPanel = ({ vehicleId, onClose }) => {
	const { vehicles, destinations } = useDeliveryStore();
	const vehicle = vehicles.find((v) => v.id === vehicleId);

	if (!vehicle) return null;

	const destination = destinations.find((d) => d.id === vehicle.destinationId);

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "active":
				return "success";
			case "idle":
				return "warning";
			case "error":
				return "error";
			default:
				return "default";
		}
	};

	const formatSpeed = (speed) => {
		return `${Math.round(speed)} km/h`;
	};

	const formatDistance = (meters) => {
		return `${(meters / 1000).toFixed(1)} km`;
	};

	const formatDuration = (seconds) => {
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
	};

	return (
		<Paper
			elevation={3}
			sx={{
				position: "absolute",
				top: 80,
				right: 20,
				width: 300,
				p: 2,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				zIndex: 1000,
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<VehicleIcon color="primary" />
					<Typography variant="h6">{vehicle.name}</Typography>
				</Box>
				<IconButton size="small" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Box>

			<Box sx={{ mb: 2 }}>
				<Chip
					label={vehicle.status}
					color={getStatusColor(vehicle.status)}
					size="small"
					sx={{ mr: 1 }}
				/>
				{vehicle.type && (
					<Chip label={vehicle.type} variant="outlined" size="small" />
				)}
			</Box>

			<Divider sx={{ my: 2 }} />

			{destination && (
				<Box sx={{ mb: 2 }}>
					<Typography variant="subtitle2" color="text.secondary" gutterBottom>
						Current Destination
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<LocationOn color="action" />
						<Typography>{destination.name}</Typography>
					</Box>
				</Box>
			)}

			<Box sx={{ mb: 2 }}>
				<Typography variant="subtitle2" color="text.secondary" gutterBottom>
					Progress
				</Typography>
				<LinearProgress
					variant="determinate"
					value={vehicle.metrics?.progress || 0}
					sx={{ height: 8, borderRadius: 1, mb: 1 }}
				/>
				<Typography variant="body2" color="text.secondary">
					{vehicle.metrics?.progress?.toFixed(1)}% Complete
				</Typography>
			</Box>

			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<SpeedIcon fontSize="small" color="action" />
						<Typography variant="body2" color="text.secondary">
							Current Speed
						</Typography>
					</Box>
					<Typography>
						{formatSpeed(vehicle.metrics?.currentSpeed || 0)}
					</Typography>
				</Box>

				<Box>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
						<RouteIcon fontSize="small" color="action" />
						<Typography variant="body2" color="text.secondary">
							Distance Left
						</Typography>
					</Box>
					<Typography>
						{formatDistance(vehicle.metrics?.remainingDistance || 0)}
					</Typography>
				</Box>
			</Box>

			{vehicle.metrics?.estimatedArrival && (
				<Box sx={{ mt: 2 }}>
					<Typography variant="body2" color="text.secondary">
						ETA: {formatDuration(vehicle.metrics.estimatedArrival)}
					</Typography>
				</Box>
			)}
		</Paper>
	);
};

export default VehicleStatusPanel; 