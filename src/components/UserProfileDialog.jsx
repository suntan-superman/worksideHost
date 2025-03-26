/* eslint-disable */
import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	Typography,
	Avatar,
	Divider,
} from "@mui/material";
import { green } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import avatar from "../data/avatar.jpg";

const UserProfileDialog = ({ open, onClose }) => {
	const navigate = useNavigate();
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const userName = localStorage.getItem("userName")?.replace(/"/g, "") || "";
	const userEmail = localStorage.getItem("userEmail")?.replace(/"/g, "") || "";
	const companyName =
		localStorage.getItem("companyName")?.replace(/"/g, "") || "";
	const accessLevel = Number(localStorage.getItem("accessLevel")) || 0;
	const userAvatar = localStorage.getItem("userAvatar") || avatar;

	const getAccessLabel = (level) => {
		switch (level) {
			case 0:
				return "GUEST";
			case 1:
				return "STANDARD";
			case 2:
				return "POWER";
			case 3:
				return "ADMIN";
			case 4:
				return "SUPERADMIN";
			default:
				return "GUEST";
		}
	};

	const handleLogout = () => {
		localStorage.clear();
		navigate("/login");
		onClose();
	};

	const handleLogoutClick = () => {
		setShowLogoutConfirm(true);
	};

	const handleCancelLogout = () => {
		setShowLogoutConfirm(false);
	};

	return (
		<>
			<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
				<DialogTitle>
					<span className="text-bold text-green-500">WORK</span>SIDE Software
				</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							mt: 2,
						}}
					>
						<Avatar
							src={userAvatar}
							alt={userName}
							sx={{
								width: 100,
								height: 100,
								border: `2px solid ${green[800]}`,
							}}
						/>
						<Box sx={{ mt: 2, textAlign: "center" }}>
							<Typography
								variant="h6"
								sx={{
									color: green[800],
									fontWeight: "bold",
									fontSize: "1.2em",
								}}
							>
								{userName}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: "black",
									mt: 1,
								}}
							>
								{userEmail}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: "black",
									mt: 0.5,
								}}
							>
								{companyName}
							</Typography>
							<Typography
								variant="body2"
								sx={{
									color: green[800],
									fontWeight: "bold",
									mt: 1,
								}}
							>
								{getAccessLabel(accessLevel)}
							</Typography>
						</Box>
						<Divider sx={{ width: "100%", my: 2 }} />
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} sx={{ color: green[800] }}>
						Close
					</Button>
					<Button
						onClick={handleLogoutClick}
						variant="contained"
						sx={{
							backgroundColor: green[800],
							"&:hover": { backgroundColor: green[600] },
						}}
					>
						Logout
					</Button>
				</DialogActions>
			</Dialog>

			{/* Logout Confirmation Dialog */}
			<Dialog
				open={showLogoutConfirm}
				onClose={handleCancelLogout}
				maxWidth="xs"
				fullWidth
			>
				<DialogTitle>Confirm Logout</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to logout?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelLogout} sx={{ color: green[800] }}>
						Cancel
					</Button>
					<Button
						onClick={handleLogout}
						variant="contained"
						sx={{
							backgroundColor: green[800],
							"&:hover": { backgroundColor: green[600] },
						}}
					>
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default UserProfileDialog; 