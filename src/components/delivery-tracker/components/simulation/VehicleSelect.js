import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axiosInstance from "../api/axiosConfig";

const VehicleSelect = ({ selectedVehicle, onVehicleSelect }) => {
	const [vehicles, setVehicles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchVehicles = async () => {
			try {
				setLoading(true);
				console.log("Initiating vehicle fetch...");

				const response = await axiosInstance.get("/vehicle");
				console.log("Response received:", response);

				// Extract the vehicles array from the response data
				const vehiclesList = response.data.data;
				console.log("Vehicles list:", vehiclesList);

				if (!Array.isArray(vehiclesList)) {
					console.error("Invalid response format:", vehiclesList);
					throw new Error("Invalid response format - expected array");
				}

				setVehicles(vehiclesList);

				if (!selectedVehicle && vehiclesList.length > 0) {
					console.log(
						"Auto-selecting first vehicle:",
						vehiclesList[0].vehicleId,
					);
					onVehicleSelect(vehiclesList[0].vehicleId);
				}
			} catch (err) {
				console.error("Fetch error details:", {
					message: err.message,
					response: err.response,
					request: err.request,
					config: err.config,
				});
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchVehicles();
	}, [selectedVehicle, onVehicleSelect]);

	if (loading) {
		console.log("Rendering loading state...");
		return <div>Loading vehicles...</div>;
	}
	if (error) {
		console.log("Rendering error state:", error);
		return <div>Error loading vehicles: {error}</div>;
	}
	if (!vehicles.length) {
		console.log("Rendering empty state...");
		return <div>No vehicles available</div>;
	}

	console.log(
		"Rendering select with vehicles:",
		vehicles.map((v) => ({
			id: v.vehicleId,
			name: `${v.specifications.make} ${v.specifications.model} (${v.vehicleId})`,
		})),
	);

	return (
		<FormControl fullWidth>
			<InputLabel>Select Vehicle</InputLabel>
			<Select
				value={selectedVehicle || ""}
				onChange={(e) => {
					console.log("Selected vehicle:", e.target.value);
					onVehicleSelect(e.target.value);
				}}
				label="Select Vehicle"
			>
				{vehicles.map((vehicle) => (
					<MenuItem key={vehicle.vehicleId} value={vehicle.vehicleId}>
						{`${vehicle.specifications.make} ${vehicle.specifications.model} (${vehicle.vehicleId})`}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};

export default VehicleSelect; 