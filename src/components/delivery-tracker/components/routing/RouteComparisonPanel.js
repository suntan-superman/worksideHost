import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Chip,
} from "@mui/material";
import {
	Close as CloseIcon,
	TrendingUp,
	TrendingDown,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const RouteComparisonPanel = ({ open, onClose }) => {
	const { activeRoutes } = useDeliveryStore();

	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	const formatDistance = (meters) => {
		return `${(meters / 1000).toFixed(1)} km`;
	};

	const calculateDifference = (value1, value2) => {
		if (!value1 || !value2) return null;
		const diff = ((value2 - value1) / value1) * 100;
		return {
			value: diff.toFixed(1),
			isPositive: diff > 0,
		};
	};

	const renderDifference = (value1, value2) => {
		const diff = calculateDifference(value1, value2);
		if (!diff) return null;

		const Icon = diff.isPositive ? TrendingUp : TrendingDown;
		const color = diff.isPositive ? "error" : "success";

		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Icon color={color} fontSize="small" />
				<Typography color={color} variant="body2">
					{Math.abs(diff.value)}%
				</Typography>
			</Box>
		);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography variant="h6">Route Comparison</Typography>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>
			</DialogTitle>
			<DialogContent>
				<Paper sx={{ overflow: "auto" }}>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>Metric</TableCell>
								{activeRoutes.map((route) => (
									<TableCell key={`header-${route.id}`}>
										Route {route.name || route.id}
										{route.isPrimary && (
											<Chip
												label="Primary"
												size="small"
												color="primary"
												sx={{ ml: 1 }}
											/>
										)}
									</TableCell>
								))}
								<TableCell>Difference</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Distance</TableCell>
								{activeRoutes.map((route) => (
									<TableCell key={`distance-${route.id}`}>
										{formatDistance(route.metrics?.totalDistance || 0)}
									</TableCell>
								))}
								<TableCell>
									{activeRoutes.length >= 2 &&
										renderDifference(
											activeRoutes[0].metrics?.totalDistance,
											activeRoutes[1].metrics?.totalDistance,
										)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Duration</TableCell>
								{activeRoutes.map((route) => (
									<TableCell key={`duration-${route.id}`}>
										{formatDuration(route.metrics?.estimatedDuration || 0)}
									</TableCell>
								))}
								<TableCell>
									{activeRoutes.length >= 2 &&
										renderDifference(
											activeRoutes[0].metrics?.estimatedDuration,
											activeRoutes[1].metrics?.estimatedDuration,
										)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Average Speed</TableCell>
								{activeRoutes.map((route) => (
									<TableCell key={`speed-${route.id}`}>
										{`${Math.round(route.metrics?.averageSpeed || 0)} km/h`}
									</TableCell>
								))}
								<TableCell>
									{activeRoutes.length >= 2 &&
										renderDifference(
											activeRoutes[0].metrics?.averageSpeed,
											activeRoutes[1].metrics?.averageSpeed,
										)}
								</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Paper>
			</DialogContent>
		</Dialog>
	);
};

export default RouteComparisonPanel; 