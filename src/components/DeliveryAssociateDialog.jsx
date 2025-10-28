/* eslint-disable */
import React, { useState, useEffect } from "react";
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
	Modal,
	TextField,
	Typography,
	Grid,
	Divider,
	Alert,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format, addHours } from "date-fns";
import { GetDeliveryAssociates } from "../api/worksideAPI";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

const PaperComponent = (props) => {
	return (
		<Draggable
			handle="#deliveryAssociateDialog"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
};

/**
 * DeliveryAssociateDialog Component
 *
 * A modal dialog for assigning a delivery associate to a supplier.
 * It fetches and displays a list of delivery associates based on the provided supplier ID.
 * Includes estimated delivery time calculation and workload information.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Function} props.onAssign - Callback function to handle the assignment of a delivery associate.
 * @param {string} props.supplierID - The ID of the supplier for which delivery associates are fetched.
 * @param {string} props.requestID - The ID of the request being assigned.
 * @param {string} props.deliveryDate - The desired delivery date for the request.
 * @param {string} props.requestCategory - The category of the request.
 *
 * @returns {JSX.Element} The rendered DeliveryAssociateDialog component.
 *
 * @example
 * <DeliveryAssociateDialog
 *   open={true}
 *   onClose={handleClose}
 *   onAssign={handleAssign}
 *   supplierID="12345"
 *   requestID="67890"
 *   deliveryDate="2023-05-15T10:00:00Z"
 *   requestCategory="Equipment"
 * />
 */
const DeliveryAssociateDialog = ({
	open,
	onClose,
	onAssign,
	supplierID,
	requestID,
	deliveryDate,
	requestCategory,
}) => {
	const [selectedDA, setSelectedDA] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [estimatedHours, setEstimatedHours] = useState(2);
	const [estimatedArrivalTime, setEstimatedArrivalTime] = useState(null);
	const [workloadConflict, setWorkloadConflict] = useState(false);
	const [notes, setNotes] = useState("");
	const apiURL = process.env.REACT_APP_API_URL;

	// Fetch delivery associates
	const { data: deliveryAssociatesResponse, isLoading } = useQuery({
		queryKey: ["deliveryAssociates", supplierID],
		queryFn: () => GetDeliveryAssociates(supplierID),
		enabled: !!supplierID,
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

	// Calculate estimated arrival time when delivery associate or estimated hours change
	useEffect(() => {
		if (selectedDA && estimatedHours && deliveryDate) {
			const arrivalTime = addHours(new Date(deliveryDate), estimatedHours);
			setEstimatedArrivalTime(arrivalTime);

			// Check for workload conflicts (if total hours > 12)
			if (workloadData?.totalHours) {
				const totalWorkload = workloadData.totalHours + estimatedHours;
				setWorkloadConflict(totalWorkload > 12);
			}
		}
	}, [selectedDA, estimatedHours, deliveryDate, workloadData]);

	// Handle delivery associate selection
	const handleDAChange = (event) => {
		setSelectedDA(event.target.value);
	};

	// Handle estimated hours change
	const handleHoursChange = (event) => {
		const value = Number.parseFloat(event.target.value);
		if (!Number.isNaN(value) && value > 0) {
			setEstimatedHours(value);
		}
	};

	// Handle notes change
	const handleNotesChange = (event) => {
		setNotes(event.target.value);
	};

	// Handle assignment
	const handleAssign = () => {
		if (selectedDA && estimatedHours) {
			onAssign(selectedDA, estimatedHours, notes);
		}
	};

	return (
		<Modal open={open} onClose={onClose} disableEnforceFocus disableAutoFocus>
			<Dialog
				open
				PaperComponent={PaperComponent}
				aria-labelledby="deliveryAssociateDialog"
				disableEnforceFocus
				disableAutoFocus
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle id="deliveryAssociateDialog">
					<span className="text-bold text-green-500 text-xl">WORK</span>
					<span className="text-bold text-black text-xl">SIDE</span>
					<br />
					<p className="text-bold text-black text-xl">
						Assign Delivery Associate
					</p>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2, minWidth: 300 }}>
						{errorMessage ? (
							<p className="text-red-500 text-bold mb-4">{errorMessage}</p>
						) : (
							<>
								<FormControl fullWidth sx={{ mb: 3 }}>
									<InputLabel
										sx={{
											"&.Mui-focused": {
												color: "green",
											},
										}}
									>
										Select Delivery Associate
									</InputLabel>
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
											".MuiSvgIcon-root": {
												color: "green",
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

								<Divider sx={{ my: 2 }} />

								<Typography variant="h6" gutterBottom>
									Delivery Time Estimation
								</Typography>

								<Grid container spacing={2} sx={{ mb: 2 }}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Estimated Hours"
											type="number"
											value={estimatedHours}
											onChange={handleHoursChange}
											inputProps={{ min: 0.5, step: 0.5 }}
											sx={{
												"& .MuiOutlinedInput-root": {
													"&.Mui-focused fieldset": {
														borderColor: "green",
													},
													"&:hover fieldset": {
														borderColor: "green",
													},
												},
												"& .MuiInputLabel-root.Mui-focused": {
													color: "green",
												},
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label="Estimated Arrival Time"
											value={
												estimatedArrivalTime
													? format(estimatedArrivalTime, "h:mm a")
													: ""
											}
											InputProps={{
												readOnly: true,
											}}
											sx={{
												"& .MuiOutlinedInput-root": {
													"&.Mui-focused fieldset": {
														borderColor: "green",
													},
													"&:hover fieldset": {
														borderColor: "green",
													},
												},
												"& .MuiInputLabel-root.Mui-focused": {
													color: "green",
												},
											}}
										/>
									</Grid>
								</Grid>

								{selectedDA && workloadData?.totalHours && (
									<>
										<Typography variant="subtitle1" gutterBottom>
											Workload Information
										</Typography>

										<Typography variant="body2" gutterBottom>
											Current workload: {workloadData.totalHours} hours
										</Typography>

										<Typography variant="body2" gutterBottom>
											Total after assignment:{" "}
											{workloadData.totalHours + estimatedHours} hours
										</Typography>

										{workloadConflict && (
											<Alert severity="warning" sx={{ mt: 2 }}>
												Warning: This assignment may create a workload conflict.
												The delivery associate will exceed the recommended daily
												hours.
											</Alert>
										)}
									</>
								)}

								<Grid item xs={12}>
									<Divider sx={{ my: 1 }} />
								</Grid>

								<Grid item xs={12}>
									<TextField
										fullWidth
										label="Notes"
										multiline
										rows={3}
										value={notes}
										onChange={handleNotesChange}
										placeholder="Add any notes about this assignment..."
									/>
								</Grid>
							</>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={handleAssign}
						disabled={!selectedDA || !estimatedHours || errorMessage}
						sx={{
							backgroundColor: "green",
							"&:hover": {
								backgroundColor: "darkgreen",
							},
							"&.Mui-disabled": {
								backgroundColor: "#cccccc",
							},
						}}
					>
						Assign
					</Button>
					<Button variant="contained" color="error" onClick={onClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Modal>
	);
};

export default DeliveryAssociateDialog; 