import React from "react";
import { Box, Slider, Typography } from "@mui/material";
import useDeliveryStore from "../../stores/deliveryStore";

const SimulationSpeedControl = () => {
	const { simulationSpeed, setSimulationSpeed } = useDeliveryStore();

	const handleSpeedChange = (_, newValue) => {
		setSimulationSpeed(newValue);
	};

	return (
		<Box
			sx={{
				position: "absolute",
				top: 80,
				right: 20,
				zIndex: 400,
				backgroundColor: "white",
				padding: 2,
				borderRadius: 1,
				boxShadow: 2,
				width: 200,
			}}
		>
			<Typography variant="subtitle2" gutterBottom>
				Simulation Speed: {simulationSpeed}x
			</Typography>
			<Slider
				value={simulationSpeed}
				onChange={handleSpeedChange}
				min={1}
				max={10}
				step={1}
				marks
				valueLabelDisplay="auto"
			/>
		</Box>
	);
};

export default SimulationSpeedControl; 