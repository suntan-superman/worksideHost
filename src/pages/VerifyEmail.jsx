/* eslint-disable */

import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
	Alert,
	CircularProgress,
	Box,
	Typography,
	Button,
} from "@mui/material";
import axios from "axios";
import {
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
// import { AuthContext } from "../context/AuthContext";
// import { baseUrl, postRequest } from "../utils/service";

/**
 * VerifyEmail Component
 *
 * This component handles the email verification process for users. It retrieves
 * the verification token and email from the URL query parameters and performs
 * the following steps:
 * - Checks if the user is already verified.
 * - If not verified, attempts to verify the user's email using the provided token.
 * - Displays appropriate messages based on the verification status.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * // Usage in a React Router setup
 * <Route path="/verify-email" element={<VerifyEmail />} />
 *
 * @dependencies
 * - React hooks: useState, useEffect
 * - React Router hooks: useSearchParams, useNavigate
 * - Axios for HTTP requests
 * - Material-UI components: Box, CircularProgress, Alert, Typography, Button
 *
 * @state
 * - `isLoading` (boolean): Indicates whether the verification process is ongoing.
 * - `isUserVerified` (boolean): Indicates whether the user's email is verified.
 * - `error` (object): Contains error state and message if verification fails.
 *
 * @hooks
 * - `useEffect`: Triggers the email verification process on component mount.
 * - `useSearchParams`: Retrieves query parameters from the URL.
 * - `useNavigate`: Navigates to different routes after verification.
 *
 * @functions
 * - `verifyEmail`: An asynchronous function that performs the email verification process.
 *
 * @errorHandling
 * - Displays an error message if the verification fails or if required parameters are missing.
 *
 * @loadingState
 * - Displays a loading spinner while the verification process is ongoing.
 *
 * @successState
 * - Displays a success message if the email is successfully verified.
 *
 * @redirects
 * - Redirects the user to the login page after a successful verification or error.
 */
const VerifyEmail = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [isUserVerified, setIsUserVerified] = useState(false);
	const [error, setError] = useState({ error: false, message: "" });
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const token = searchParams.get("token");
	const email = searchParams.get("email");

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				if (!token || !email) {
					setError({ error: true, message: "Missing token or email" });
					setIsLoading(false);
					return;
				}

				const apiUrl =
					process.env.REACT_APP_API_URL || "http://localhost:8081";

				// First check if user is already verified
				const checkVerifiedUrl = `${apiUrl}/api/user/is-user-validated`;
				const checkResponse = await axios.post(checkVerifiedUrl, { email });

				if (checkResponse.data.status === true) {
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
				const verifyResponse = await axios.get(verifyUrl);

				if (verifyResponse?.data?.success) {
					setIsUserVerified(true);
					setIsLoading(false);
					await showSuccessDialogWithTimer(
						"Email successfully verified! Your account is now pending administrator validation. You will receive an email once your account is fully validated.",
						5000,
					);
					setTimeout(() => navigate("/login"), 5000);
				} else {
					throw new Error(
						verifyResponse?.data?.message || "Verification failed",
					);
				}
			} catch (err) {
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

	if (isLoading) {
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
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								You will be redirected to the login page shortly...
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => navigate("/login")}
								sx={{ mt: 2 }}
							>
								Go to Login
							</Button>
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
							<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
								Please contact support if this issue persists.
							</Typography>
							<Button
								variant="contained"
								color="primary"
								onClick={() => navigate("/login")}
								sx={{ mt: 2 }}
							>
								Return to Login
							</Button>
						</Box>
					</Box>
				) : (
					<Box>
						<Alert severity="info" sx={{ mb: 2 }}>
							Verifying your email...
						</Alert>
						<Box sx={{ mt: 2 }}>
							<Typography variant="h6" gutterBottom color="primary">
								From Workside Software
							</Typography>
							<Typography variant="body1" paragraph>
								Please wait while we verify your email address.
							</Typography>
							<CircularProgress size={24} />
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default VerifyEmail;
