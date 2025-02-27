/* eslint-disable */

import React, { useState } from "react";
import {
	Dialog,
	TextField,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
} from "@mui/material";
import { showErrorDialog } from "../utils/useSweetAlert";
import NotificationService from "../services/notification-service";	

const NotificationDialog = ({ open, onClose }) => {
	const [formData, setFormData] = useState({
		recipients: "",
		title: "",
		message: "",
		additionalData: "",
	});

	// Example function to send a bid notification
async function sendBidNotification(userToken, bidData) {
	try {
		await NotificationService.sendPushNotification(
			userToken,
			"New Bid Received", // title
			`New bid of $${bidData.amount} received`, // body
			{
				type: "New Bid",
				bidId: bidData.id,
				amount: bidData.amount,
				listingId: bidData.listingId,
				timestamp: new Date().toISOString(),
			},
		);
	} catch (error) {
		console.error("Failed to send bid notification:", error);
	}
}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:4000/api/notifications/realtime", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					recipients: formData.recipients
						.split(",")
						.map((email) => email.trim()),
					title: formData.title,
					message: formData.message,
					data: {
						additionalInfo: formData.additionalData,
					},
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to send notification");
			}

			onClose();
			setFormData({
				recipients: "",
				title: "",
				message: "",
				additionalData: "",
			});
		} catch (error) {
			showErrorDialog("Error sending notification:", error);
			// Show error toast
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle id="notificationDialog">
				<span className="text-bold text-green-400 text-xl">WORK</span>
				<span className="text-bold text-black text-xl">SIDE Notification</span>
			</DialogTitle>
			<Box sx={{ p: 1 }}>
				{/* <Typography variant="h6" mb={2}>
					Send Notification
				</Typography> */}
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Recipients (comma-separated emails)"
						value={formData.recipients}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, recipients: e.target.value }))
						}
						margin="normal"
						required
					/>
					<TextField
						fullWidth
						label="Title"
						value={formData.title}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, title: e.target.value }))
						}
						margin="normal"
						required
					/>
					<TextField
						fullWidth
						label="Message"
						value={formData.message}
						onChange={(e) =>
							setFormData((prev) => ({ ...prev, message: e.target.value }))
						}
						margin="normal"
						multiline
						rows={3}
						required
					/>
					<TextField
						fullWidth
						label="Additional Data (optional)"
						value={formData.additionalData}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								additionalData: e.target.value,
							}))
						}
						margin="normal"
					/>
					<Box
						sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 2 }}
					>
						<Button onClick={onClose} sx={{ color: "red" }}>
							Cancel
						</Button>
						<Button
							type="submit"
							variant="contained"
							sx={{
								bgcolor: "green",
								"&:hover": {
									bgcolor: "darkgreen",
								},
							}}
						>
							Send
						</Button>
					</Box>
				</form>
			</Box>
		</Dialog>
	);
};

export default NotificationDialog;
