/* eslint-disable */

import { React } from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Card, CardContent } from "@mui/material";

import { showErrorDialog } from "../utils/useSweetAlert";

/**
 * ResetPassword Component
 *
 * This component renders a form for users to reset their password. It includes
 * input fields for the new password and confirmation password, and validates
 * the inputs before submitting the data to the server.
 *
 * Features:
 * - Validates that the new password and confirmation password match.
 * - Ensures the new password is at least 8 characters long.
 * - Sends a POST request to the server to update the user's password.
 * - Displays error messages for validation or server-side errors.
 * - Redirects the user to the login page upon successful password reset.
 *
 * @component
 * @returns {JSX.Element} The rendered ResetPassword component.
 *
 * @example
 * <ResetPassword />
 */
const ResetPassword = () => {
	const userEmail = localStorage.getItem("email");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const newpassword = data.get("newpassword");
		const confirmpassword = data.get("confirmpassword");
		if (newpassword !== confirmpassword) {
			await showErrorDialog("New Password and Confirm Password do not match!");
		} else if (newpassword.length < 8) {
			await showErrorDialog("Password must be at least 8 characters long");
		} else {
			const fetchString = `${process.env.REACT_APP_API_URL}/api/user/resetpassword`;
			const res = await axios.post(fetchString, {
				email: userEmail.replace(/"/g, ""),
				password: newpassword,
			});
			if (res.data.status === false) {
				await showErrorDialog(res.data.message);
			} else {
				await showErrorDialog(res.data.message);
				setTimeout(() => {
					window.location = "/login";
				}, 2000);
			}
		}
	};

	return (
		<Container maxWidth="sm">
			<Box
				sx={{
					marginTop: 10,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Card sx={{ boxShadow: "4" }}>
					<CardContent sx={{ m: 3 }}>
						<Avatar sx={{ m: "auto", bgcolor: "primary.main" }}>
							<LockResetIcon />
						</Avatar>
						<Typography component="h1" variant="h5" sx={{ mt: 1 }}>
							Reset Password
						</Typography>

						<Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
							<TextField
								margin="normal"
								required
								fullWidth
								type="password"
								name="newpassword"
								id="newpassword"
								label="New Password"
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								type="password"
								name="confirmpassword"
								id="confirmpassword"
								label="Confirm Password"
							/>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Submit
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
};

export default ResetPassword;
