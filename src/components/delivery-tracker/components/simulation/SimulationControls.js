/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Paper,
	ButtonGroup,
	Button,
	IconButton,
	Tooltip,
	Box,
	Slider,
	Typography,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
} from "@mui/material";
import {
	PlayArrow as PlayIcon,
	Pause as PauseIcon,
	Stop as StopIcon,
	Speed as SpeedIcon,
	Settings as SettingsIcon,
	LocationOn,
	Route as RouteIcon,
	Timeline as TimelineIcon,
	Refresh as ResetIcon,
	RestartAlt as RestartAltIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";
import useSimulation from "../../hooks/useSimulation";

const SimulationControls = ({
	onStart,
	onPause,
	onReset,
	onError,
}) => {
	const [speedMenuAnchor, setSpeedMenuAnchor] = useState(null);
	const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
	const { simulationSpeed, setSimulationSpeed, updateSettings, isSimulationRunning, vehicles } =
		useDeliveryStore();
	const { startSimulation, pauseSimulation, resetSimulation } = useSimulation();
	const hasActiveVehicles = vehicles.some((v) => v.status === 'delivering' || v.status === 'active');
	const canReset = vehicles.length > 0 && !isSimulationRunning;

	// Add debug logging
	useEffect(() => {
		console.log('SimulationControls - isRunning:', isSimulationRunning);
	}, [isSimulationRunning]);

	// Add debug logging for button states
	useEffect(() => {
		console.log('SimulationControls: Button states:', {
			isRunning: isSimulationRunning,
			resetEnabled: canReset,
			simulationSpeed
		});
	}, [isSimulationRunning, simulationSpeed, canReset]);

	// Add more detailed logging
	useEffect(() => {
		console.log('SimulationControls: State update:', {
			isRunning: isSimulationRunning,
			resetEnabled: canReset,
			simulationSpeed: simulationSpeed,
			hasResetHandler: true
		});
	}, [isSimulationRunning, simulationSpeed, canReset]);

	// Add at the top of the component
	useEffect(() => {
		console.log('SimulationControls: isRunning changed:', {
			isRunning: isSimulationRunning,
			hasResetHandler: !!onReset,
			buttonDisabled: !isSimulationRunning
		});
	}, [isSimulationRunning, onReset]);

	// Add state debugging
	useEffect(() => {
		console.log('SimulationControls: State check:', {
			isRunning: isSimulationRunning,
			type: typeof isSimulationRunning,
			hasResetHandler: !!onReset,
			hasStartHandler: !!onStart,
			hasPauseHandler: !!onPause
		});
	}, [isSimulationRunning, onReset, onStart, onPause]);

	const handleSpeedChange = (newSpeed) => {
		try {
			setSimulationSpeed(newSpeed);
			setSpeedMenuAnchor(null);
		} catch (err) {
			onError?.("Failed to change simulation speed");
		}
	};

	const speedOptions = [
		{ value: 1, label: "1x" },
		{ value: 2, label: "2x" },
		{ value: 5, label: "5x" },
		{ value: 10, label: "10x", },
	];

	const handleSettingsClick = (setting) => {
		try {
			updateSettings(setting);
			setSettingsMenuAnchor(null);
		} catch (err) {
			onError?.("Failed to update settings");
		}
	};

	const handleMainButtonClick = () => {
		if (isSimulationRunning) {
			onPause();
		} else {
			onStart();
		}
	};

	return (
		<Paper
			elevation={3}
			sx={{
				position: "absolute",
				bottom: 20,
				left: "50%",
				transform: "translateX(-50%)",
				p: 2,
				backgroundColor: "rgba(255, 255, 255, 0.95)",
				borderRadius: 2,
				zIndex: 1000,
			}}
		>
			<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
				<ButtonGroup variant="contained">
					<Button
						onClick={handleMainButtonClick}
						disabled={!vehicles.length}
						sx={{
							bgcolor: "green",
							"&:hover": { bgcolor: "darkgreen" },
						}}
					>
						{isSimulationRunning ? 'Pause' : 'Start'}
					</Button>
					<Button
						onClick={onReset}
						disabled={!canReset}
						sx={{
							bgcolor: "green",
							"&:hover": { bgcolor: "darkgreen" },
						}}
					>
						Reset
					</Button>
				</ButtonGroup>

				<Tooltip title="Simulation Speed">
					<IconButton onClick={(e) => setSpeedMenuAnchor(e.currentTarget)}>
						<SpeedIcon />
					</IconButton>
				</Tooltip>

				<Menu
					anchorEl={speedMenuAnchor}
					open={Boolean(speedMenuAnchor)}
					onClose={() => setSpeedMenuAnchor(null)}
				>
					{speedOptions.map((option) => (
						<MenuItem
							key={option.value}
							onClick={() => handleSpeedChange(option.value)}
							selected={simulationSpeed === option.value}
						>
							{option.label}
						</MenuItem>
					))}
				</Menu>

				<Tooltip title="Settings">
					<IconButton onClick={(e) => setSettingsMenuAnchor(e.currentTarget)}>
						<SettingsIcon />
					</IconButton>
				</Tooltip>

				<Menu
					anchorEl={settingsMenuAnchor}
					open={Boolean(settingsMenuAnchor)}
					onClose={() => setSettingsMenuAnchor(null)}
				>
					<MenuItem onClick={() => handleSettingsClick({ showPaths: true })}>
						<ListItemIcon>
							<RouteIcon />
						</ListItemIcon>
						<ListItemText>Show Routes</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={() => handleSettingsClick({ showDestinations: true })}
					>
						<ListItemIcon>
							<LocationOn />
						</ListItemIcon>
						<ListItemText>Show Destinations</ListItemText>
					</MenuItem>
					<MenuItem
						onClick={() => handleSettingsClick({ showStatistics: true })}
					>
						<ListItemIcon>
							<TimelineIcon />
						</ListItemIcon>
						<ListItemText>Show Statistics</ListItemText>
					</MenuItem>
				</Menu>
			</Box>
		</Paper>
	);
};

export default SimulationControls;
