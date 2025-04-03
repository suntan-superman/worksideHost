/* eslint-disable */
import React, { useState, useEffect, useCallback } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Typography,
	Grid,
	Divider,
	Alert,
	Slider,
	Paper,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { format, addHours, subHours, parseISO } from "date-fns";
import { GetDeliveryAssociates } from "../api/worksideAPI";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/datepicker.css";

/**
 * LogisticsExpertDialog Component
 *
 * A comprehensive dialog for logistics experts to manage delivery assignments.
 * It allows assigning delivery associates, estimating travel times, and managing wait times.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Function} props.onAssign - Callback function to handle the assignment of a delivery associate.
 * @param {string} props.requestID - The ID of the request being assigned.
 * @param {string} props.deliveryDate - The desired delivery date for the request.
 * @param {string} props.requestCategory - The category of the request.
 * @param {Object} props.locationData - Object containing destination and supplier location data.
 * @param {Object} props.locationData.destination - Destination coordinates {lat, lng}.
 * @param {Object} props.locationData.supplier - Supplier coordinates {lat, lng}.
 *
 * @returns {JSX.Element} The rendered LogisticsExpertDialog component.
 */
const LogisticsExpertDialog = ({
	open,
	onClose,
	onAssign,
	requestID,
	deliveryDate,
	requestCategory,
	locationData,
}) => {
	const [selectedDA, setSelectedDA] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [estimatedHours, setEstimatedHours] = useState(2);
	const [waitTime, setWaitTime] = useState(0.5);
	const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);
	const [estimatedDepartureTime, setEstimatedDepartureTime] = useState(null);
	const [estimatedReturnTime, setEstimatedReturnTime] = useState(null);
	const [workloadConflict, setWorkloadConflict] = useState(false);
	const [notes, setNotes] = useState("");

	// Fetch delivery associates
	const { data: deliveryAssociatesResponse, isLoading } = useQuery({
		queryKey: ["deliveryAssociates"],
		queryFn: GetDeliveryAssociates,
	});

	// Extract the actual array of delivery associates from the response
	const deliveryAssociates = deliveryAssociatesResponse?.data || [];

	// Fetch workload for selected delivery associate
	const { data: workloadData } = useQuery({
		queryKey: ["deliveryAssociateWorkload", selectedDA, deliveryDate],
		queryFn: async () => {
			if (!selectedDA || !deliveryDate) return { totalHours: 0 };

			// This would be replaced with an actual API call
			// For now, returning mock data
			return { totalHours: Math.floor(Math.random() * 10) };
		},
		enabled: !!selectedDA && !!deliveryDate,
	});

	// Calculate travel time based on distance (mock implementation)
	const calculateTravelTime = useCallback((from, to) => {
		if (!from || !to) return 1; // Default 1 hour if coordinates not available

		// Simple distance calculation (Haversine formula would be better)
		const latDiff = Math.abs(from.lat - to.lat);
		const lngDiff = Math.abs(from.lng - to.lng);

		// Rough estimate: 1 hour per 50km (this is a simplification)
		const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // 111km per degree
		return Math.max(0.5, Math.min(8, distance / 50)); // Between 30 minutes and 8 hours
	}, []);

	// Calculate estimated times when inputs change
	useEffect(() => {
		if (selectedDA && deliveryDate) {
			const deliveryDateTime = new Date(deliveryDate);

			// Calculate travel time to destination
			const travelTimeToDestination =
				locationData?.destination && locationData?.supplier
					? calculateTravelTime(locationData.supplier, locationData.destination)
					: 1;

			// Calculate travel time back to supplier
			const travelTimeBack =
				locationData?.destination && locationData?.supplier
					? calculateTravelTime(locationData.destination, locationData.supplier)
					: 1;

			// Set estimated arrival time
			const arrivalTime = subHours(deliveryDateTime, waitTime);
			setEstimatedArrivalTime(arrivalTime);

			// Set estimated departure time
			const departureTime = subHours(arrivalTime, travelTimeToDestination);
			setEstimatedDepartureTime(departureTime);

			// Set estimated return time
			const returnTime = addHours(deliveryDateTime, travelTimeBack);
			setEstimatedReturnTime(returnTime);

			// Update total estimated hours
			const totalHours = travelTimeToDestination + waitTime + travelTimeBack;
			setEstimatedHours(totalHours);

			// Check for workload conflicts (if total hours > 12)
			if (workloadData?.totalHours) {
				const totalWorkload = workloadData.totalHours + totalHours;
				setWorkloadConflict(totalWorkload > 12);
			}
		}
	}, [
		selectedDA,
		deliveryDate,
		waitTime,
		workloadData,
		locationData,
		calculateTravelTime,
	]);

	// Handle delivery associate selection
	const handleDAChange = (event) => {
		setSelectedDA(event.target.value);
	};

	// Handle wait time change
	const handleWaitTimeChange = (event, newValue) => {
		setWaitTime(newValue);
	};

	// Handle notes change
	const handleNotesChange = (event) => {
		setNotes(event.target.value);
	};

	// Handle assignment
	const handleAssign = () => {
		if (selectedDA && estimatedHours) {
			onAssign(selectedDA, estimatedHours, notes, {
				estimatedArrivalTime,
				estimatedDepartureTime,
				estimatedReturnTime,
				waitTime,
			});
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					boxShadow: 3,
				},
			}}
		>
			<DialogTitle
				sx={{ bgcolor: "#f5f5f5", borderBottom: "1px solid #e0e0e0" }}
			>
				<Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
					<span className="text-green-500">WORK</span>
					<span className="text-black">SIDE</span>
				</Typography>
				<Typography variant="subtitle1" sx={{ mt: 1 }}>
					Logistics Expert Assignment
				</Typography>
			</DialogTitle>

			<DialogContent sx={{ mt: 2 }}>
				{errorMessage ? (
					<Alert severity="error" sx={{ mb: 2 }}>
						{errorMessage}
					</Alert>
				) : null}

				{workloadConflict ? (
					<Alert severity="warning" sx={{ mb: 2 }}>
						Warning: This assignment may exceed the delivery associate's daily
						workload limit.
					</Alert>
				) : null}

				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Typography variant="h6" gutterBottom>
							Request Details
						</Typography>
						<Paper elevation={0} sx={{ p: 2, bgcolor: "#f9f9f9", mb: 2 }}>
							<Typography variant="body1">
								<strong>Request ID:</strong> {requestID}
							</Typography>
							<Typography variant="body1">
								<strong>Category:</strong> {requestCategory}
							</Typography>
							<Typography variant="body1">
								<strong>Desired Delivery Date:</strong>{" "}
								{deliveryDate
									? format(parseISO(deliveryDate), "PPP")
									: "Not specified"}
							</Typography>
							<Typography variant="body1">
								<strong>Desired Delivery Time:</strong>{" "}
								{deliveryDate
									? format(parseISO(deliveryDate), "p")
									: "Not specified"}
							</Typography>
						</Paper>

						<FormControl fullWidth sx={{ mb: 3 }}>
							<InputLabel>Select Delivery Associate</InputLabel>
							<Select
								value={selectedDA}
								onChange={handleDAChange}
								label="Select Delivery Associate"
								sx={{
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
								}}
								disabled={isLoading}
							>
								{deliveryAssociates.map((da) => (
									<MenuItem key={da._id} value={da._id}>
										{da.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Typography variant="subtitle1" gutterBottom>
							Wait Time at Destination (hours)
						</Typography>
						<Slider
							value={waitTime}
							onChange={handleWaitTimeChange}
							min={0.5}
							max={4}
							step={0.5}
							marks={[
								{ value: 0.5, label: "30m" },
								{ value: 1, label: "1h" },
								{ value: 2, label: "2h" },
								{ value: 3, label: "3h" },
								{ value: 4, label: "4h" },
							]}
							sx={{
								color: "green",
								"& .MuiSlider-thumb": {
									"&:hover, &.Mui-focusVisible": {
										boxShadow: "0px 0px 0px 8px rgba(0, 128, 0, 0.16)",
									},
								},
							}}
						/>

						<TextField
							fullWidth
							label="Notes"
							multiline
							rows={3}
							value={notes}
							onChange={handleNotesChange}
							sx={{ mt: 2 }}
						/>
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="h6" gutterBottom>
							Time Estimates
						</Typography>
						<Paper elevation={0} sx={{ p: 2, bgcolor: "#f9f9f9" }}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Typography variant="subtitle2" color="textSecondary">
										Departure Time
									</Typography>
									<Typography variant="body1">
										{estimatedDepartureTime
											? format(estimatedDepartureTime, "h:mm a")
											: "Not calculated"}
									</Typography>
								</Grid>

								<Grid item xs={12}>
									<Divider sx={{ my: 1 }} />
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="textSecondary">
										Arrival Time
									</Typography>
									<Typography variant="body1">
										{estimatedArrivalTime
											? format(estimatedArrivalTime, "h:mm a")
											: "Not calculated"}
									</Typography>
								</Grid>

								<Grid item xs={12}>
									<Divider sx={{ my: 1 }} />
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="textSecondary">
										Return Time
									</Typography>
									<Typography variant="body1">
										{estimatedReturnTime
											? format(estimatedReturnTime, "h:mm a")
											: "Not calculated"}
									</Typography>
								</Grid>

								<Grid item xs={12}>
									<Divider sx={{ my: 1 }} />
								</Grid>

								<Grid item xs={12}>
									<Typography variant="subtitle2" color="textSecondary">
										Total Estimated Hours
									</Typography>
									<Typography variant="body1" fontWeight="bold">
										{estimatedHours.toFixed(1)} hours
									</Typography>
								</Grid>
							</Grid>
						</Paper>

						{locationData && (
							<Box sx={{ mt: 3 }}>
								<Typography variant="h6" gutterBottom>
									Location Data
								</Typography>
								<Paper elevation={0} sx={{ p: 2, bgcolor: "#f9f9f9" }}>
									<Typography variant="body2">
										<strong>Supplier Location:</strong>{" "}
										{locationData.supplier
											? `${locationData.supplier.lat.toFixed(4)}, ${locationData.supplier.lng.toFixed(4)}`
											: "Not available"}
									</Typography>
									<Typography variant="body2">
										<strong>Destination Location:</strong>{" "}
										{locationData.destination
											? `${locationData.destination.lat.toFixed(4)}, ${locationData.destination.lng.toFixed(4)}`
											: "Not available"}
									</Typography>
								</Paper>
							</Box>
						)}
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions
				sx={{ p: 2, bgcolor: "#f5f5f5", borderTop: "1px solid #e0e0e0" }}
			>
				<Button onClick={onClose} color="inherit">
					Cancel
				</Button>
				<Button
					onClick={handleAssign}
					variant="contained"
					color="success"
					disabled={!selectedDA || workloadConflict}
				>
					Assign Delivery Associate
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default LogisticsExpertDialog; 