import React from "react";
import {
	Paper,
	Typography,
	Box,
	Grid,
	LinearProgress,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import {
	Timeline as TimelineIcon,
	TrendingUp,
	TrendingDown,
	Warning as WarningIcon,
	CheckCircle as CheckIcon,
	Schedule as TimeIcon,
	Route as RouteIcon,
	Speed as SpeedIcon,
	LocalShipping as TruckIcon,
} from "@mui/icons-material";

const SimulationDetailsPanel = ({ results }) => {
	if (!results) return null;

	const { metrics, analysis, segments } = results;
	const { summary, recommendations, riskAnalysis } = analysis;

	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	const getConfidenceColor = (confidence) => {
		switch (confidence) {
			case "high":
				return "success";
			case "medium":
				return "warning";
			default:
				return "error";
		}
	};

	const formatMetric = (value, unit = "") => {
		return `${typeof value === "number" ? value.toFixed(1) : value}${unit}`;
	};

	const getEfficiencyColor = (value) => {
		if (value >= 80) return "success";
		if (value >= 60) return "warning";
		return "error";
	};

	const simulationMetrics = [
		{
			id: "completion",
			label: "Completion Rate",
			value: `${formatMetric(metrics.completionRate)}%`,
			icon: <TimelineIcon />,
			color: getEfficiencyColor(metrics.completionRate),
		},
		{
			id: "speed",
			label: "Average Speed",
			value: `${formatMetric(metrics.averageSpeed, " km/h")}`,
			icon: <SpeedIcon />,
			color: "primary",
		},
		{
			id: "vehicles",
			label: "Active Vehicles",
			value: metrics.activeVehicles,
			icon: <TruckIcon />,
			color: "info",
		},
	];

	const efficiencyMetrics = [
		{
			id: "delivery",
			label: "Delivery Efficiency",
			value: metrics.deliveryEfficiency,
		},
		{
			id: "fuel",
			label: "Fuel Efficiency",
			value: metrics.fuelEfficiency,
		},
		{
			id: "time",
			label: "Time Efficiency",
			value: metrics.timeEfficiency,
		},
	];

	return (
		<Paper sx={{ p: 2, mt: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<TrendingUp sx={{ mr: 1 }} />
				<Typography variant="h6">Simulation Results</Typography>
			</Box>
			<Divider sx={{ mb: 3 }} />

			<Grid container spacing={3} sx={{ mb: 3 }}>
				{simulationMetrics.map((metric) => (
					<Grid item xs={12} sm={4} key={metric.id}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								p: 2,
								bgcolor: "background.default",
								borderRadius: 1,
							}}
						>
							<Box sx={{ mr: 2, color: `${metric.color}.main` }}>
								{metric.icon}
							</Box>
							<Box>
								<Typography variant="body2" color="text.secondary">
									{metric.label}
								</Typography>
								<Typography variant="h6">{metric.value}</Typography>
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>

			<Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
				Efficiency Metrics
			</Typography>

			<Box sx={{ mb: 3 }}>
				{efficiencyMetrics.map((metric) => (
					<Box key={metric.id} sx={{ mb: 2 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								mb: 1,
							}}
						>
							<Typography variant="body2">{metric.label}</Typography>
							<Chip
								label={`${metric.value}%`}
								size="small"
								color={getEfficiencyColor(metric.value)}
							/>
						</Box>
						<LinearProgress
							variant="determinate"
							value={metric.value}
							color={getEfficiencyColor(metric.value)}
							sx={{ height: 6, borderRadius: 1 }}
						/>
					</Box>
				))}
			</Box>

			<Box sx={{ mt: 2 }}>
				<Typography variant="body2" color="text.secondary">
					Total Distance Covered: {formatMetric(metrics.totalDistance, " km")}
				</Typography>
			</Box>
		</Paper>
	);
};

export default SimulationDetailsPanel; 