import React from "react";
import {
	Paper,
	Typography,
	Box,
	LinearProgress,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Chip,
	Divider,
} from "@mui/material";
import {
	LocalShipping as VehicleIcon,
	LocationOn,
	Timer as TimerIcon,
	CheckCircle as CompleteIcon,
	Schedule as PendingIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const DeliveryProgressPanel = () => {
	const { vehicles, destinations } = useDeliveryStore();

	const calculateProgress = () => {
		if (!vehicles.length || !destinations.length) return null;

		const activeDeliveries = vehicles.filter((v) => v.status === "active");
		const totalDeliveries = destinations.length;
		const completedDeliveries = destinations.filter(
			(d) => d.status === "completed",
		).length;

		const overallProgress = (completedDeliveries / totalDeliveries) * 100;

		const vehicleProgress = activeDeliveries.map((vehicle) => ({
			id: vehicle.id,
			name: vehicle.name,
			progress: vehicle.metrics?.progress || 0,
			destination: destinations.find((d) => d.id === vehicle.destinationId)
				?.name,
			eta: vehicle.metrics?.estimatedArrival,
		}));

		return {
			overallProgress,
			completedDeliveries,
			totalDeliveries,
			vehicleProgress,
		};
	};

	const formatDuration = (seconds) => {
		if (!seconds) return "N/A";
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
	};

	const getProgressColor = (progress) => {
		if (progress >= 80) return "success";
		if (progress >= 40) return "warning";
		return "error";
	};

	const progress = calculateProgress();
	if (!progress) return null;

	return (
		<Paper
			sx={{
				position: "absolute",
				top: 80,
				right: 20,
				width: 350,
				p: 2,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				zIndex: 1000,
			}}
		>
			<Box sx={{ mb: 3 }}>
				<Typography variant="h6" gutterBottom>
					Delivery Progress
				</Typography>
				<Box sx={{ mb: 2 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
						<Typography variant="body2" color="text.secondary">
							Overall Progress
						</Typography>
						<Typography variant="body2">
							{progress.completedDeliveries} / {progress.totalDeliveries}
						</Typography>
					</Box>
					<LinearProgress
						variant="determinate"
						value={progress.overallProgress}
						color={getProgressColor(progress.overallProgress)}
						sx={{ height: 8, borderRadius: 1 }}
					/>
				</Box>
			</Box>

			<Divider sx={{ my: 2 }} />

			<Typography variant="subtitle2" gutterBottom>
				Active Deliveries
			</Typography>
			<List dense>
				{progress.vehicleProgress.map((vehicle) => (
					<ListItem key={vehicle.id}>
						<ListItemIcon>
							<VehicleIcon color="primary" />
						</ListItemIcon>
						<ListItemText
							primary={
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									{vehicle.name}
									<Chip
										size="small"
										label={`${Math.round(vehicle.progress)}%`}
										color={getProgressColor(vehicle.progress)}
									/>
								</Box>
							}
							secondary={
								<Box sx={{ mt: 1 }}>
									{vehicle.destination && (
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												gap: 1,
												mb: 0.5,
											}}
										>
											<LocationOn fontSize="small" color="action" />
											<Typography variant="body2">
												{vehicle.destination}
											</Typography>
										</Box>
									)}
									{vehicle.eta && (
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<TimerIcon fontSize="small" color="action" />
											<Typography variant="body2">
												ETA: {formatDuration(vehicle.eta)}
											</Typography>
										</Box>
									)}
								</Box>
							}
						/>
					</ListItem>
				))}
			</List>

			<Divider sx={{ my: 2 }} />

			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<CompleteIcon color="success" fontSize="small" />
					<Typography variant="body2">
						Completed: {progress.completedDeliveries}
					</Typography>
				</Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<PendingIcon color="warning" fontSize="small" />
					<Typography variant="body2">
						Pending: {progress.totalDeliveries - progress.completedDeliveries}
					</Typography>
				</Box>
			</Box>
		</Paper>
	);
};

export default DeliveryProgressPanel; 