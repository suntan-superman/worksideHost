/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	TextField,
	Box,
} from "@mui/material";
import { green } from "@mui/material/colors";

/**
 * HelpDialog component provides a modal dialog for submitting user feedback.
 * It allows users to select a feedback type and provide a description.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to close the dialog.
 *
 * @returns {JSX.Element} The rendered HelpDialog component.
 *
 * @example
 * <HelpDialog open={isDialogOpen} onClose={handleDialogClose} />
 */
const HelpDialog = ({ open, onClose }) => {
	const [feedbackType, setFeedbackType] = useState("idea");
	const [description, setDescription] = useState("");

	// Clear form when dialog opens
	useEffect(() => {
		if (open) {
			setFeedbackType("idea");
			setDescription("");
		}
	}, [open]);

	const handleSubmit = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/feedback`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						type: feedbackType,
						description,
						status: "open",
					}),
				},
			);
			if (response.ok) {
				setDescription("");
				onClose();
			}
		} catch (error) {
			console.error("Error submitting feedback:", error);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<span className="text-bold text-green-500">WORK</span>SIDE Feedback
			</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					<FormControl component="fieldset">
						<RadioGroup
							value={feedbackType}
							onChange={(e) => setFeedbackType(e.target.value)}
							sx={{ color: green[800] }}
						>
							<FormControlLabel
								value="idea"
								control={
									<Radio
										sx={{
											color: green[800],
											"&.Mui-checked": {
												color: green[800],
											},
										}}
									/>
								}
								label="Idea"
							/>
							<FormControlLabel
								value="small-bug"
								control={
									<Radio
										sx={{
											color: green[800],
											"&.Mui-checked": {
												color: green[800],
											},
										}}
									/>
								}
								label="Small Bug"
							/>
							<FormControlLabel
								value="urgent-bug"
								control={
									<Radio
										sx={{
											color: green[800],
											"&.Mui-checked": {
												color: green[800],
											},
										}}
									/>
								}
								label="Urgent Bug"
							/>
						</RadioGroup>
					</FormControl>
				</Box>
				<Box sx={{ mt: 2 }}>
					<TextField
						fullWidth
						multiline
						rows={8}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe your feedback..."
						variant="outlined"
						sx={{
							"& .MuiOutlinedInput-root": {
								"& fieldset": {
									borderColor: green[800],
								},
								"&:hover fieldset": {
									borderColor: green[600],
								},
							},
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} sx={{ color: green[800] }}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant="contained"
					sx={{
						backgroundColor: green[800],
						"&:hover": { backgroundColor: green[600] },
					}}
					disabled={!description.trim()}
				>
					Submit
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default HelpDialog; 