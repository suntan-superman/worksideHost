/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Stack,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

const STORAGE_KEY = 'requestFilterSelections';
const DIALOG_POSITION_KEY = 'requestFilterDialogPosition';

const PaperComponent = (props) => {
	return (
		<Draggable
			handle="#requestFilterDialog"
			cancel={'[class*="MuiDialogContent-root"]'}
			defaultPosition={JSON.parse(localStorage.getItem(DIALOG_POSITION_KEY)) || { x: 0, y: 0 }}
			onStop={(e, data) => {
				localStorage.setItem(DIALOG_POSITION_KEY, JSON.stringify({ x: data.x, y: data.y }));
			}}
		>
			<Paper {...props} />
		</Draggable>
	);
};

/**
 * RequestFilterDialog Component
 *
 * A dialog component that allows users to filter requests based on their status.
 * The selected filters are saved to localStorage and can be applied or cleared.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to handle closing the dialog.
 * @param {Function} props.onApply - Callback function to handle applying the selected filters.
 * @param {string[]} props.requestStatusOptions - Array of request status options to display as filter checkboxes.
 *
 * @example
 * const requestStatusOptions = ['Pending', 'Approved', 'Rejected'];
 * const handleApply = (filters) => console.log(filters);
 * const handleClose = () => console.log('Dialog closed');
 *
 * <RequestFilterDialog
 *   open={true}
 *   onClose={handleClose}
 *   onApply={handleApply}
 *   requestStatusOptions={requestStatusOptions}
 * />
 */
const RequestFilterDialog = ({
	open,
	onClose,
	onApply,
	requestStatusOptions,
}) => {
	const [selectedFilters, setSelectedFilters] = useState(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : [];
	});

	useEffect(() => {
		// Load saved filters on component mount
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			setSelectedFilters(JSON.parse(saved));
		}
	}, []);

	const handleToggle = (status) => {
		setSelectedFilters((prev) =>
			prev.includes(status)
				? prev.filter((item) => item !== status)
				: [...prev, status],
		);
	};

	const handleApply = () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedFilters));
		onApply(selectedFilters);
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperComponent={PaperComponent}
			aria-labelledby="requestFilterDialog"
		>
			<DialogTitle id="requestFilterDialog">
				<span className="text-bold text-green-500 text-xl">WORK</span>
				<span className="text-bold text-black text-xl">SIDE</span>
				<br />
				<p className="text-bold text-black text-xl">Filter Requests</p>
			</DialogTitle>
			<DialogContent>
				<Stack spacing={2}>
					<FormGroup>
						{requestStatusOptions.map((status) => (
							<FormControlLabel
								key={status}
								control={
									<Checkbox
										checked={selectedFilters.includes(status)}
										onChange={() => handleToggle(status)}
										sx={{
											color: "green",
											"&.Mui-checked": {
												color: "green",
											},
										}}
									/>
								}
								label={status}
							/>
						))}
					</FormGroup>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={handleApply}
					sx={{
						backgroundColor: "green",
						"&:hover": {
							backgroundColor: "darkgreen",
						},
					}}
				>
					Apply
				</Button>
				<Button variant="contained" color="error" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RequestFilterDialog; 