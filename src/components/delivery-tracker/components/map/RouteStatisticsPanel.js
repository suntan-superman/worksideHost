import React from "react";
import {
	Paper,
	Typography,
	Box,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Chip,
} from "@mui/material";
import {
	Timeline as TimelineIcon,
	Speed as SpeedIcon,
	Route as RouteIcon,
	TrendingUp,
	LocalShipping as VehicleIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const RouteStatisticsPanel = () => {
	const { vehicles, destinations } = useDeliveryStore();

	const calculateStatistics = () => {
		if (!vehicles.length) return null;

		const activeVehicles = vehicles.filter((v) => v.status === "active");
		const totalDistance = activeVehicles.reduce(
			(sum, v) => sum + (v.metrics?.totalDistance || 0),
			0,
		);
		const averageSpeed =
			activeVehicles.reduce(
				(sum, v) => sum + (v.metrics?.currentSpeed || 0),
				0,
			) / (activeVehicles.length || 1);
		const completionRates = activeVehicles.map((v) => v.metrics?.progress || 0);
		const averageCompletion =
			completionRates.reduce((sum, rate) => sum + rate, 0) /
			(completionRates.length || 1);

		return {
			totalVehicles: vehicles.length,
			activeVehicles: activeVehicles.length,
			totalDistance,
			averageSpeed,
			averageCompletion,
			totalDestinations: destinations.length,
			vehicleStatuses: {
				active: activeVehicles.length,
				idle: vehicles.filter((v) => v.status === "idle").length,
				loading: vehicles.filter((v) => v.status === "loading").length,
				unloading: vehicles.filter((v) => v.status === "unloading").length,
			},
		};
	};

	const formatMetric = (value, unit = "") => {
		return `${typeof value === "number" ? value.toFixed(1) : value}${unit}`;
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "active":
				return "success";
			case "idle":
				return "warning";
			case "loading":
			case "unloading":
				return "info";
			default:
				return "default";
		}
	};

	const stats = calculateStatistics();
	if (!stats) return null;

	return (
		<Paper
			sx={{
				position: "absolute",
				top: 80,
				left: 20,
				width: 300,
				p: 2,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				zIndex: 1000,
			}}
		>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<TimelineIcon sx={{ mr: 1 }} />
				<Typography variant="h6">Route Statistics</Typography>
			</Box>

			<List dense>
				<ListItem>
					<ListItemIcon>
						<VehicleIcon />
					</ListItemIcon>
					<ListItemText
						primary="Vehicle Status"
						secondary={
							<Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
								{Object.entries(stats.vehicleStatuses).map(
									([status, count]) => (
										<Chip
											key={status}
											label={`${status}: ${count}`}
											size="small"
											color={getStatusColor(status)}
											variant={count > 0 ? "filled" : "outlined"}
										/>
									),
								)}
							</Box>
						}
					/>
				</ListItem>

				<Divider sx={{ my: 1 }} />

				<ListItem>
					<ListItemIcon>
						<SpeedIcon />
					</ListItemIcon>
					<ListItemText
						primary="Average Speed"
						secondary={formatMetric(stats.averageSpeed, " km/h")}
					/>
				</ListItem>

				<ListItem>
					<ListItemIcon>
						<RouteIcon />
					</ListItemIcon>
					<ListItemText
						primary="Total Distance"
						secondary={formatMetric(stats.totalDistance / 1000, " km")}
					/>
				</ListItem>

				<ListItem>
					<ListItemIcon>
						<TrendingUp />
					</ListItemIcon>
					<ListItemText
						primary="Average Completion"
						secondary={
							<Box sx={{ display: "flex", alignItems: "center" }}>
								<Typography variant="body2" sx={{ mr: 1 }}>
									{formatMetric(stats.averageCompletion, "%")}
								</Typography>
								<Chip
									size="small"
									label={
										stats.averageCompletion >= 80 ? "On Track" : "In Progress"
									}
									color={stats.averageCompletion >= 80 ? "success" : "warning"}
								/>
							</Box>
						}
					/>
				</ListItem>
			</List>
		</Paper>
	);
};

export default RouteStatisticsPanel; 