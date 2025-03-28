/* eslint-disable */

import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
} from "@mui/material";

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
		<Dialog
			open={open}
			onClose={onCancel}
			aria-labelledby="confirmation-dialog-title"
			disableEnforceFocus
			disableRestoreFocus
		>
			<DialogTitle id="confirmation-dialog-title">
				<span className="text-bold text-green-300 text-xl">WORK</span>
				<span className="text-bold text-black text-xl">SIDE</span>
			</DialogTitle>
			<DialogContent style={{ width: "300px" }}>
				<Typography>{message}</Typography>
			</DialogContent>
			<DialogActions>
				<button
					type="button"
					className="bg-red-500 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-20 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
					onClick={onCancel}
				>
					No
				</button>
				<button
					type="button"
					className="bg-green-300 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-20 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
					onClick={onConfirm}
				>
					Yes
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationDialog;
