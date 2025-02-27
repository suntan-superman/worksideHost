import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormControl,
	FormControlLabel,
	Switch,
	Slider,
	Typography,
	Box,
	Divider,
	Alert,
} from "@mui/material";
import { useRouteOptimization } from "../../hooks/useRouteOptimization";

const RouteOptimizationSettings = ({ open, onClose }) => {
	const { settings, updateSettings, applySettings } = useRouteOptimization();
	const [localSettings, setLocalSettings] = useState(settings);
	const [error, setError] = useState(null);

	const handleChange = (key, value) => {
		setLocalSettings((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleSave = async () => {
		try {
			await updateSettings(localSettings);
			await applySettings();
			onClose();
		} catch (err) {
			setError("Failed to update optimization settings");
			console.error(err);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Route Optimization Settings</DialogTitle>
			<DialogContent>
				{error && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Priority Weights
					</Typography>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<Typography gutterBottom>Time Efficiency</Typography>
						<Slider
							value={localSettings.timeWeight}
							onChange={(_, value) => handleChange("timeWeight", value)}
							min={0}
							max={100}
							valueLabelDisplay="auto"
						/>
					</FormControl>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<Typography gutterBottom>Fuel Efficiency</Typography>
						<Slider
							value={localSettings.fuelWeight}
							onChange={(_, value) => handleChange("fuelWeight", value)}
							min={0}
							max={100}
							valueLabelDisplay="auto"
						/>
					</FormControl>
					<FormControl fullWidth>
						<Typography gutterBottom>Traffic Avoidance</Typography>
						<Slider
							value={localSettings.trafficWeight}
							onChange={(_, value) => handleChange("trafficWeight", value)}
							min={0}
							max={100}
							valueLabelDisplay="auto"
						/>
					</FormControl>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ mb: 3 }}>
					<Typography variant="subtitle2" gutterBottom>
						Optimization Features
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={localSettings.useRealTimeTraffic}
								onChange={(e) =>
									handleChange("useRealTimeTraffic", e.target.checked)
								}
							/>
						}
						label="Use Real-time Traffic Data"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={localSettings.considerWeather}
								onChange={(e) =>
									handleChange("considerWeather", e.target.checked)
								}
							/>
						}
						label="Consider Weather Conditions"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={localSettings.useHistoricalData}
								onChange={(e) =>
									handleChange("useHistoricalData", e.target.checked)
								}
							/>
						}
						label="Use Historical Performance Data"
					/>
				</Box>

				<Box>
					<Typography variant="subtitle2" gutterBottom>
						Advanced Settings
					</Typography>
					<FormControlLabel
						control={
							<Switch
								checked={localSettings.dynamicReoptimization}
								onChange={(e) =>
									handleChange("dynamicReoptimization", e.target.checked)
								}
							/>
						}
						label="Enable Dynamic Re-optimization"
					/>
					<FormControlLabel
						control={
							<Switch
								checked={localSettings.balanceWorkload}
								onChange={(e) =>
									handleChange("balanceWorkload", e.target.checked)
								}
							/>
						}
						label="Balance Vehicle Workload"
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} variant="contained" color="primary">
					Save & Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RouteOptimizationSettings; 