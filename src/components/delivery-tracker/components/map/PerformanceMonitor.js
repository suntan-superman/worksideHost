import React, { useState, useEffect, useCallback } from "react";
import {
	Paper,
	Typography,
	Box,
	IconButton,
	Tooltip,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Collapse,
	Dialog,
	DialogTitle,
	DialogContent,
} from "@mui/material";
import {
	Speed as SpeedIcon,
	Memory as MemoryIcon,
	Timeline as TimelineIcon,
	ExpandMore as ExpandMoreIcon,
	ExpandLess as ExpandLessIcon,
	Warning as WarningIcon,
} from "@mui/icons-material";
import { useMapPerformance } from "../../hooks/useMapPerformance";
import useDeliveryStore from "../../stores/deliveryStore";

const PerformanceMonitor = () => {
	const { vehicles = [] } = useDeliveryStore((state) => ({
		vehicles: state.vehicles || [],
	}));

	const { fps, memoryUsage, renderTime, warnings = [] } = useMapPerformance();
	const [expanded, setExpanded] = useState(false);
	const [showWarnings, setShowWarnings] = useState(false);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (warnings.length > 0) {
			setShowWarnings(true);
			const timer = setTimeout(() => setShowWarnings(false), 5000);
			return () => clearTimeout(timer);
		}
	}, [warnings]);

	const getPerformanceColor = useCallback((value, thresholds) => {
		const { warning, error } = thresholds;
		if (value >= error) return "error.main";
		if (value >= warning) return "warning.main";
		return "success.main";
	}, []);

	const metrics = [
		{
			id: "fps",
			label: "FPS",
			value: fps || 0,
			icon: <SpeedIcon />,
			format: (v) => v.toFixed(1),
			thresholds: { warning: 30, error: 15 },
		},
		{
			id: "memory",
			label: "Memory Usage",
			value: memoryUsage || 0,
			icon: <MemoryIcon />,
			format: (v) => `${(v / 1024 / 1024).toFixed(1)} MB`,
			thresholds: { warning: 500 * 1024 * 1024, error: 1000 * 1024 * 1024 },
		},
		{
			id: "render",
			label: "Render Time",
			value: renderTime || 0,
			icon: <TimelineIcon />,
			format: (v) => `${v.toFixed(1)} ms`,
			thresholds: { warning: 16, error: 33 },
		},
	];

	// Create a unique key for each warning by combining the warning message with its index
	const getWarningKey = (warning, index) =>
		`${warning.replace(/\s+/g, "_")}_${index}`;

	return (
		<Paper
			sx={{
				position: "absolute",
				bottom: 20,
				right: 20,
				width: 300,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				overflow: "hidden",
				zIndex: 1000,
			}}
		>
			<Box
				sx={{
					p: 1,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					borderBottom: 1,
					borderColor: "divider",
					bgcolor: "background.default",
				}}
			>
				<Typography variant="subtitle2">Performance Monitor</Typography>
				<Box sx={{ display: "flex", alignItems: "center" }}>
					{warnings.length > 0 && (
						<Tooltip title="Performance Warnings">
							<IconButton
								size="small"
								color="warning"
								onClick={() => setShowWarnings(!showWarnings)}
							>
								<WarningIcon />
							</IconButton>
						</Tooltip>
					)}
					<IconButton size="small" onClick={() => setExpanded(!expanded)}>
						{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					</IconButton>
				</Box>
			</Box>

			<Collapse in={expanded}>
				<List dense>
					{metrics.map((metric) => (
						<ListItem key={metric.id}>
							<ListItemIcon>{metric.icon}</ListItemIcon>
							<ListItemText
								primary={metric.label}
								secondary={metric.format(metric.value)}
								secondaryTypographyProps={{
									sx: {
										color: getPerformanceColor(metric.value, metric.thresholds),
									},
								}}
							/>
						</ListItem>
					))}
					<ListItem>
						<ListItemText
							primary="Active Vehicles"
							secondary={vehicles?.length || 0}
						/>
					</ListItem>
				</List>
			</Collapse>

			<Collapse in={showWarnings}>
				<Box sx={{ p: 1, bgcolor: "warning.light" }}>
					<List dense>
						{warnings.map((warning, index) => (
							<ListItem key={getWarningKey(warning, index)}>
								<ListItemIcon>
									<WarningIcon color="warning" />
								</ListItemIcon>
								<ListItemText
									primary={warning}
									primaryTypographyProps={{
										variant: "caption",
										color: "warning.dark",
									}}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Collapse>

			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Performance Monitor</DialogTitle>
				<DialogContent>
					<List dense>
						{warnings.map((warning, index) => (
							<ListItem key={getWarningKey(warning, index)}>
								<ListItemIcon>
									<WarningIcon color="warning" />
								</ListItemIcon>
								<ListItemText primary={warning} />
							</ListItem>
						))}
					</List>
				</DialogContent>
			</Dialog>
		</Paper>
	);
};

export default React.memo(PerformanceMonitor); 