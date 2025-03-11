import React, { useState } from "react";
import {
	Paper,
	Typography,
	Box,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Chip,
	Divider,
	IconButton,
	Collapse,
} from "@mui/material";
import {
	Speed as SpeedIcon,
	Memory as MemoryIcon,
	Timeline as TimelineIcon,
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
	Warning as WarningIcon,
	TrendingUp,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";
import { useMapPerformance } from "../../hooks/useMapPerformance";

const PerformanceOptimizationPanel = () => {
	const [expanded, setExpanded] = useState(true);
	const { vehicles, settings } = useDeliveryStore();
	const { fps, memoryUsage, optimizationSuggestions } = useMapPerformance();

	const getPerformanceLevel = (value, thresholds) => {
		const { warning, critical } = thresholds;
		if (value >= critical) return "critical";
		if (value >= warning) return "warning";
		return "good";
	};

	const getPerformanceColor = (level) => {
		switch (level) {
			case "critical":
				return "error";
			case "warning":
				return "warning";
			default:
				return "success";
		}
	};

	const metrics = [
		{
			id: "vehicles",
			label: "Active Vehicles",
			value: vehicles.filter((v) => v.status === "active").length,
			thresholds: { warning: 50, critical: 100 },
			icon: <SpeedIcon />,
		},
		{
			id: "memory",
			label: "Memory Usage",
			value: Math.round(memoryUsage / (1024 * 1024)),
			unit: "MB",
			thresholds: { warning: 500, critical: 1000 },
			icon: <MemoryIcon />,
		},
		{
			id: "fps",
			label: "Frame Rate",
			value: Math.round(fps),
			unit: "FPS",
			thresholds: { warning: 30, critical: 15 },
			icon: <TimelineIcon />,
		},
	];

	const suggestions = optimizationSuggestions || [
		{
			id: "clustering",
			label: "Enable Vehicle Clustering",
			impact: "high",
			description: "Reduces marker count for better performance",
		},
		{
			id: "animation",
			label: "Optimize Animation Frames",
			impact: "medium",
			description: "Smoother vehicle movement updates",
		},
	];

	return (
		<Paper
			elevation={3}
			sx={{
				position: "absolute",
				bottom: 20,
				left: 20,
				width: 350,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box
				sx={{
					p: 2,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					bgcolor: "background.default",
					borderBottom: 1,
					borderColor: "divider",
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<TrendingUp />
					<Typography variant="h6">Performance Optimization</Typography>
				</Box>
				<IconButton size="small" onClick={() => setExpanded(!expanded)}>
					{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
				</IconButton>
			</Box>

			<Collapse in={expanded}>
				<Box sx={{ p: 2 }}>
					<List dense>
						{metrics.map((metric) => {
							const level = getPerformanceLevel(
								metric.value,
								metric.thresholds,
							);
							return (
								<ListItem key={metric.id}>
									<ListItemIcon>{metric.icon}</ListItemIcon>
									<ListItemText
										primary={metric.label}
										secondary={`${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`}
									/>
									<Chip
										size="small"
										color={getPerformanceColor(level)}
										label={level}
									/>
								</ListItem>
							);
						})}
					</List>

					<Divider sx={{ my: 2 }} />

					<Typography variant="subtitle2" gutterBottom>
						Optimization Suggestions
					</Typography>
					<List dense>
						{suggestions.map((suggestion) => (
							<ListItem key={suggestion.id}>
								<ListItemIcon>
									<SettingsIcon color="action" />
								</ListItemIcon>
								<ListItemText
									primary={suggestion.label}
									secondary={suggestion.description}
								/>
								<Chip
									size="small"
									label={suggestion.impact}
									color={suggestion.impact === "high" ? "error" : "warning"}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Collapse>
		</Paper>
	);
};

export default PerformanceOptimizationPanel; 