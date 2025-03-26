/* eslint-disable */

import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Box, Typography } from "@mui/material";
import axios from "axios";
import {
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
// import { AuthContext } from "../context/AuthContext";
// import { baseUrl, postRequest } from "../utils/service";

const VerifyEmail = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isUserVerified, setIsUserVerified] = useState(false);
	const [error, setError] = useState({ error: false, message: "" });
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	console.log("Component mounted with:", { token, email });
	console.log("Initial state:", { isLoading, isUserVerified, error });

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				if (!token || !email) {
					console.log("Missing token or email");
					setError({ error: true, message: "Missing token or email" });
					setIsLoading(false);
					return;
				}

				const apiUrl =
					process.env.REACT_APP_MONGO_URI || "http://localhost:8081";
				console.log("Using API URL:", apiUrl);

				// First check if user is already verified
				const checkVerifiedUrl = `${apiUrl}/api/user/is-user-validated`;
				console.log("Checking verification status at:", checkVerifiedUrl);
				const checkResponse = await axios.post(checkVerifiedUrl, { email });
				console.log("Check verification response:", checkResponse.data);

				if (checkResponse.data.status === true) {
					console.log("User already verified");
					setIsUserVerified(true);
					setIsLoading(false);
					await showSuccessDialogWithTimer(
						"Email already verified, redirecting...",
					);
					setTimeout(() => navigate("/login"), 3000);
					return;
				}

				// If not verified, proceed with verification
				const verifyUrl = `${apiUrl}/api/user/verify-email/${token}`;
				console.log("Proceeding with verification at:", verifyUrl);
				const verifyResponse = await axios.get(verifyUrl);
				console.log("Verification response:", verifyResponse.data);

				if (verifyResponse?.data?.success) {
					console.log("Verification successful, updating state");
					setIsUserVerified(true);
					setIsLoading(false);
					await showSuccessDialogWithTimer(
						"Email successfully verified! Your account is now pending administrator validation. You will receive an email once your account is fully validated.",
						5000,
					);
					setTimeout(() => navigate("/login"), 5000);
				} else {
					console.log("Verification failed:", verifyResponse?.data?.message);
					throw new Error(
						verifyResponse?.data?.message || "Verification failed",
					);
				}
			} catch (err) {
				console.error("Error in verifyEmail:", err);
				console.error("Error response:", err.response?.data);
				setError({
					error: true,
					message:
						err.response?.data?.message ||
						err.message ||
						"Error verifying email",
				});
				setIsLoading(false);
			}
		};

		verifyEmail();
	}, [token, email, navigate]);

	// Log state changes
	useEffect(() => {
		console.log("State updated:", { isLoading, isUserVerified, error });
	}, [isLoading, isUserVerified, error]);

	if (isLoading) {
		console.log("Rendering loading state");
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="100vh"
				bgcolor="#f5f5f5"
			>
				<CircularProgress />
			</Box>
		);
	}

	console.log("Rendering main content with state:", { isUserVerified, error });
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			minHeight="100vh"
			bgcolor="#f5f5f5"
		>
			<Box
				bgcolor="white"
				p={4}
				borderRadius={2}
				boxShadow={3}
				minWidth={400}
				textAlign="center"
			>
				{isUserVerified ? (
					<Box>
						<Alert severity="success" sx={{ mb: 2 }}>
							Email successfully verified!
						</Alert>
						<Box sx={{ mt: 2 }}>
							<Typography variant="h6" gutterBottom color="primary">
								From Workside Software
							</Typography>
							<Typography variant="body1" paragraph>
								Your email has been successfully verified. Your account is now
								pending administrator validation.
							</Typography>
							<Typography variant="body1" paragraph>
								You will receive an email once your account is fully validated.
							</Typography>
							<Typography variant="body2" color="text.secondary">
								You will be redirected to the login page shortly...
							</Typography>
						</Box>
					</Box>
				) : error.error ? (
					<Box>
						<Alert severity="error" sx={{ mb: 2 }}>
							Verification Error
						</Alert>
						<Box sx={{ mt: 2 }}>
							<Typography variant="h6" gutterBottom color="primary">
								From Workside Software
							</Typography>
							<Typography variant="body1" paragraph>
								{error.message}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Please contact support if this issue persists.
							</Typography>
						</Box>
					</Box>
				) : null}
			</Box>
		</Box>
	);
};

export default VerifyEmail;
