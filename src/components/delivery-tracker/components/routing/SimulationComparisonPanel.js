import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	Box,
	Typography,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	Chip,
} from "@mui/material";
import {
	Close as CloseIcon,
	TrendingUp,
	TrendingDown,
	Remove as NoChangeIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";

const SimulationComparisonPanel = ({ open, onClose }) => {
	const { simulationHistory } = useDeliveryStore();

	const formatMetric = (value, unit = "") => {
		return `${typeof value === "number" ? value.toFixed(1) : value}${unit}`;
	};

	const calculateDifference = (current, previous) => {
		if (!previous || !current) return null;
		const diff = ((current - previous) / previous) * 100;
		return {
			value: diff.toFixed(1),
			isPositive: diff > 0,
			isSignificant: Math.abs(diff) > 5,
		};
	};

	const renderTrend = (current, previous) => {
		const diff = calculateDifference(current, previous);
		if (!diff) return null;

		const { value, isPositive, isSignificant } = diff;
		if (!isSignificant) {
			return (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<NoChangeIcon color="action" fontSize="small" />
					<Typography variant="body2" color="text.secondary">
						No significant change
					</Typography>
				</Box>
			);
		}

		const Icon = isPositive ? TrendingUp : TrendingDown;
		const color = isPositive ? "success" : "error";

		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
				<Icon color={color} fontSize="small" />
				<Typography color={color} variant="body2">
					{Math.abs(value)}%
				</Typography>
			</Box>
		);
	};

	const getStatusColor = (status) => {
		switch (status.toLowerCase()) {
			case "completed":
				return "success";
			case "in_progress":
				return "info";
			case "failed":
				return "error";
			default:
				return "default";
		}
	};

	if (!simulationHistory || simulationHistory.length < 2) {
		return null;
	}

	const current = simulationHistory[simulationHistory.length - 1];
	const previous = simulationHistory[simulationHistory.length - 2];

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
					<Typography variant="h6">Simulation Comparison</Typography>
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
								<TableCell>Previous</TableCell>
								<TableCell>Current</TableCell>
								<TableCell>Trend</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell>Status</TableCell>
								<TableCell>
									<Chip
										label={previous.status}
										size="small"
										color={getStatusColor(previous.status)}
									/>
								</TableCell>
								<TableCell>
									<Chip
										label={current.status}
										size="small"
										color={getStatusColor(current.status)}
									/>
								</TableCell>
								<TableCell>-</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Completion Rate</TableCell>
								<TableCell>
									{formatMetric(previous.metrics.completionRate, "%")}
								</TableCell>
								<TableCell>
									{formatMetric(current.metrics.completionRate, "%")}
								</TableCell>
								<TableCell>
									{renderTrend(
										current.metrics.completionRate,
										previous.metrics.completionRate,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Average Speed</TableCell>
								<TableCell>
									{formatMetric(previous.metrics.averageSpeed, " km/h")}
								</TableCell>
								<TableCell>
									{formatMetric(current.metrics.averageSpeed, " km/h")}
								</TableCell>
								<TableCell>
									{renderTrend(
										current.metrics.averageSpeed,
										previous.metrics.averageSpeed,
									)}
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Fuel Efficiency</TableCell>
								<TableCell>
									{formatMetric(previous.metrics.fuelEfficiency, "%")}
								</TableCell>
								<TableCell>
									{formatMetric(current.metrics.fuelEfficiency, "%")}
								</TableCell>
								<TableCell>
									{renderTrend(
										current.metrics.fuelEfficiency,
										previous.metrics.fuelEfficiency,
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

export default SimulationComparisonPanel; 