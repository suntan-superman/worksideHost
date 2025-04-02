/* eslint-disable */

import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";
import { green } from "@mui/material/colors";

/**
 * ConfirmationDialog component renders a modal dialog box to confirm or cancel an action.
 *
 * @param {Object} props - The props for the component.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {string} props.message - The message to display in the dialog content.
 * @param {Function} props.onConfirm - Callback function triggered when the "Yes" button is clicked.
 * @param {Function} props.onCancel - Callback function triggered when the "No" button or the dialog is closed.
 *
 * @returns {JSX.Element} The rendered ConfirmationDialog component.
 */
const ConfirmationDialog = ({ open, message, onConfirm, onCancel }) => {
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle>Confirm Action</DialogTitle>
			<DialogContent>
				<p>{message}</p>
			</DialogContent>
			<DialogActions>
				<Button onClick={onCancel} sx={{ color: green[800] }}>
					Cancel
				</Button>
				<Button
					onClick={onConfirm}
					variant="contained"
					sx={{
						backgroundColor: green[800],
						"&:hover": { backgroundColor: green[600] },
					}}
				>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;
