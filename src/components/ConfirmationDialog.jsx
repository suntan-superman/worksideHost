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

const ConfirmationDialog = ({ open, message, onConfirm, onCancel }) => {
	return (
		<Dialog open={open} onClose={onCancel}>
			<DialogTitle id="requestDetailsDialog">
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
