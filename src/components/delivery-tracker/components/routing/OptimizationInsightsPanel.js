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
	Warning as WarningIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const OptimizationInsightsPanel = () => {
	const { activeRoutes, vehicles } = useDeliveryStore();

	const calculateInsights = () => {
		if (!activeRoutes?.length) return null;

		const primaryRoute = activeRoutes[0];
		const metrics = primaryRoute.metrics || {};

		// Calculate basic metrics
		const averageSpeed = metrics.averageSpeed || 0;
		const totalDistance = metrics.totalDistance || 0;
		const estimatedDuration = metrics.estimatedDuration || 0;

		// Calculate optimization potential
		const trafficImpact = metrics.trafficImpact || 0;
		const complexityScore = primaryRoute.complexity?.turns || 0;

		// Generate insights with unique IDs
		const insights = [];

		// Speed Analysis
		if (averageSpeed < 30) {
			insights.push({
				id: "speed-warning",
				type: "warning",
				icon: <SpeedIcon color="warning" />,
				title: "Low Average Speed",
				description: "Consider alternative routes with less congestion",
				severity: "warning",
			});
		}

		// Traffic Impact
		if (trafficImpact > 20) {
			insights.push({
				id: "traffic-warning",
				type: "warning",
				icon: <WarningIcon color="error" />,
				title: "High Traffic Impact",
				description: `Traffic is causing ${trafficImpact.toFixed(0)}% delay`,
				severity: "error",
			});
		}

		// Route Complexity
		if (complexityScore > 10) {
			insights.push({
				id: "complexity-info",
				type: "info",
				icon: <RouteIcon color="info" />,
				title: "Complex Route",
				description: "Route has many turns and intersections",
				severity: "info",
			});
		}

		// Performance Metrics
		insights.push({
			id: "performance-metrics",
			type: "metric",
			icon: <TimelineIcon color="success" />,
			title: "Performance Metrics",
			metrics: [
				{
					id: "metric-speed",
					label: "Average Speed",
					value: `${Math.round(averageSpeed)} km/h`,
				},
				{
					id: "metric-distance",
					label: "Total Distance",
					value: `${(totalDistance / 1000).toFixed(1)} km`,
				},
				{
					id: "metric-duration",
					label: "Estimated Duration",
					value: `${Math.round(estimatedDuration / 60)} min`,
				},
			],
		});

		return insights;
	};

	const insights = calculateInsights();

	if (!insights) {
		return (
			<Paper sx={{ p: 2, mt: 2 }}>
				<Typography color="text.secondary">
					No optimization insights available
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper sx={{ p: 2, mt: 2 }}>
			<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
				<TrendingUp sx={{ mr: 1 }} />
				<Typography variant="h6">Optimization Insights</Typography>
			</Box>
			<Divider sx={{ mb: 2 }} />

			<List>
				{insights.map((insight) => (
					<ListItem
						key={insight.id}
						sx={{
							mb: 2,
							backgroundColor:
								insight.type === "warning"
									? "rgba(255, 152, 0, 0.08)"
									: "transparent",
							borderRadius: 1,
						}}
					>
						<ListItemIcon>{insight.icon}</ListItemIcon>
						<ListItemText
							primary={
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									{insight.title}
									{insight.severity && (
										<Chip
											label={insight.severity}
											size="small"
											color={insight.severity}
											sx={{ ml: 1 }}
										/>
									)}
								</Box>
							}
							secondary={
								insight.type === "metric" ? (
									<Box sx={{ mt: 1 }}>
										{insight.metrics.map((metric) => (
											<Typography
												key={metric.id}
												variant="body2"
												color="text.secondary"
												sx={{ mb: 0.5 }}
											>
												{metric.label}: {metric.value}
											</Typography>
										))}
									</Box>
								) : (
									insight.description
								)
							}
						/>
					</ListItem>
				))}
			</List>
		</Paper>
	);
};

export default OptimizationInsightsPanel; 