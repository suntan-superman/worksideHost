/* eslint-disable */

import { useContext, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, CircularProgress, Box } from "@mui/material";
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

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				console.log("Frontend verification started");
				console.log("Token:", token);
				console.log("Email:", email);

				if (!token || !email) {
					console.log("Missing token or email");
					setError({ error: true, message: "Missing token or email" });
					setIsLoading(false);
					return;
				}

				// First check if user is already verified
				console.log("Checking if user is already verified");
				const checkVerifiedUrl = `${process.env.REACT_APP_MONGO_URI}/api/user/is-user-validated`;
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
				console.log("Proceeding with email verification");
				// Handle both frontend and API endpoint formats
				const verifyUrl = `${process.env.REACT_APP_MONGO_URI}/api/user/verify-email/${token}`;
				console.log("Verification URL:", verifyUrl);

				const verifyResponse = await axios.get(verifyUrl);
				console.log("Verification response:", verifyResponse.data);

				if (verifyResponse?.data?.success) {
					console.log("Verification successful");
					setIsUserVerified(true);
					await showSuccessDialogWithTimer(
						"Email successfully verified, redirecting...",
					);
					setTimeout(() => navigate("/login"), 3000);
				} else {
					console.log("Verification failed:", verifyResponse?.data?.message);
					throw new Error(
						verifyResponse?.data?.message || "Verification failed",
					);
				}
			} catch (err) {
				console.error("Verification error:", err);
				console.error("Error response:", err.response?.data);
				setError({
					error: true,
					message:
						err.response?.data?.message ||
						err.message ||
						"Error verifying email",
				});
			} finally {
				setIsLoading(false);
			}
		};

		verifyEmail();
	}, [token, email, navigate]);

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
				minWidth={300}
				textAlign="center"
			>
				{isLoading ? (
					<CircularProgress />
				) : (
					<>
						{isUserVerified && (
							<Alert severity="success">
								Email successfully verified, redirecting...
							</Alert>
						)}
						{error.error && <Alert severity="error">{error.message}</Alert>}
					</>
				)}
			</Box>
		</Box>
	);
};

export default VerifyEmail;
