/* eslint-disable */

import React, { useState } from "react";
import { Dialog, TextField, DialogTitle, Button, Box } from "@mui/material";
import { useToast } from "../contexts/ToastContext";
import NotificationService from "../services/notification-service";	

/**
 * NotificationDialog component allows users to send notifications to specified recipients.
 * It provides a form for entering recipient emails, a title, a message, and optional additional data.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to close the dialog.
 *
 * @example
 * <NotificationDialog open={true} onClose={handleClose} />
 *
 * @returns {JSX.Element} The rendered NotificationDialog component.
 */
const NotificationDialog = ({ open, onClose }) => {
	const toast = useToast();
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
			// const response = await fetch("http://localhost:4000/api/notifications/realtime", {

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/notifications/realtime`,
				{
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
				},
			);

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
			toast.error("Error sending notification:", error);
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
