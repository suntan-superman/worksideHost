/* eslint-disable */
import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
} from "@mui/material";
import { green } from "@mui/material/colors";

/**
 * AboutDialog component displays information about the application, including
 * build number, last build date, browser information, and operating system details.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open.
 * @param {Function} props.onClose - Callback function to handle closing the dialog.
 *
 * @returns {JSX.Element} The rendered AboutDialog component.
 */
const AboutDialog = ({ open, onClose }) => {
	const buildNumber = process.env.REACT_APP_BUILD_NUMBER || "1.0.0";
	const lastBuildDate =
		process.env.REACT_APP_LAST_BUILD_DATE || new Date().toISOString();
	const browserInfo = `${window.navigator.userAgent}`;
	const osInfo = `${window.navigator.platform} - ${window.navigator.language}`;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<span className="text-bold text-green-500">WORK</span>SIDE Host
			</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					<Typography variant="body1" gutterBottom>
						<strong>Build Number:</strong> {buildNumber}
					</Typography>
					<Typography variant="body1" gutterBottom>
						<strong>Last Build Date:</strong>{" "}
						{new Date(lastBuildDate).toLocaleString()}
					</Typography>
					<Typography variant="body1" gutterBottom>
						<strong>Browser Info:</strong> {browserInfo}
					</Typography>
					<Typography variant="body1" gutterBottom>
						<strong>Operating System:</strong> {osInfo}
					</Typography>
				</Box>
			</DialogContent>
			<DialogActions sx={{ p: 2 }}>
				<Button
					variant="contained"
					color="success"
					onClick={onClose}
					sx={{
						backgroundColor: green[800],
						"&:hover": { backgroundColor: green[600] },
					}}
				>
					OK
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default AboutDialog; 