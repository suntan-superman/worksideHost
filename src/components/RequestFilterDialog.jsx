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
	List,
	ListItem,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import ClearIcon from "@mui/icons-material/Clear";

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

	// Update selectedFilters when dialog opens to stay in sync with chips
	useEffect(() => {
		if (open) {
			const saved = localStorage.getItem(STORAGE_KEY);
			setSelectedFilters(saved ? JSON.parse(saved) : []);
		}
	}, [open]);

	const handleToggleFilter = (status) => {
		setSelectedFilters((prev) =>
			prev.includes(status)
				? prev.filter((s) => s !== status)
				: [...prev, status],
		);
	};

	const handleSelectAll = () => {
		setSelectedFilters([...requestStatusOptions]);
	};

	const handleClearAll = () => {
		setSelectedFilters([]);
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
			maxWidth="xs"
			fullWidth
			PaperProps={{
				sx: {
					width: "75%",
					maxWidth: "400px",
				},
			}}
		>
			<DialogTitle sx={{ pb: 1 }}>
				<div className="flex justify-between items-center">
					<span className="text-lg font-medium">Filter Requests</span>
					<div className="flex gap-2">
						<Button
							variant="outlined"
							size="small"
							onClick={handleSelectAll}
							startIcon={<SelectAllIcon />}
							sx={{
								color: "#2f8842",
								borderColor: "#2f8842",
								"&:hover": {
									borderColor: "#2f8842",
									backgroundColor: "rgba(47, 136, 66, 0.04)",
								},
								fontSize: "0.75rem",
							}}
						>
							Select All
						</Button>
						<Button
							variant="outlined"
							size="small"
							onClick={handleClearAll}
							startIcon={<ClearIcon />}
							sx={{
								color: "#2f8842",
								borderColor: "#2f8842",
								"&:hover": {
									borderColor: "#2f8842",
									backgroundColor: "rgba(47, 136, 66, 0.04)",
								},
								fontSize: "0.75rem",
							}}
						>
							Clear All
						</Button>
					</div>
				</div>
			</DialogTitle>
			<DialogContent sx={{ pt: 1 }}>
				<List dense>
					{requestStatusOptions.map((status) => (
						<ListItem key={status} sx={{ py: 0.5 }}>
							<FormControlLabel
								control={
									<Checkbox
										checked={selectedFilters.includes(status)}
										onChange={() => handleToggleFilter(status)}
										sx={{
											color: "#2f8842",
											"&.Mui-checked": {
												color: "#2f8842",
											},
										}}
									/>
								}
								label={<span className="text-sm">{status}</span>}
							/>
						</ListItem>
					))}
				</List>
			</DialogContent>
			<DialogActions sx={{ px: 3, py: 2 }}>
				<Button
					onClick={onClose}
					sx={{
						color: "#2f8842",
						"&:hover": {
							backgroundColor: "rgba(47, 136, 66, 0.04)",
						},
					}}
				>
					Cancel
				</Button>
				<Button
					onClick={handleApply}
					variant="contained"
					sx={{
						backgroundColor: "#2f8842",
						"&:hover": {
							backgroundColor: "#256e33",
						},
					}}
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RequestFilterDialog; 