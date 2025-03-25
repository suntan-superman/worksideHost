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
				if (!token || !email) {
					setError({ error: true, message: "Missing token or email" });
					setIsLoading(false);
					return;
				}

				// First check if user is already verified
				const checkVerifiedUrl = `${process.env.REACT_APP_MONGO_URI}/api/user/is-user-validated`;
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
				const verifyUrl = `${process.env.REACT_APP_MONGO_URI}/api/user/verify-email/${token}`;
				const verifyResponse = await axios.post(verifyUrl);

				if (verifyResponse.data && verifyResponse.data.success) {
					setIsUserVerified(true);
					await showSuccessDialogWithTimer(
						"Email successfully verified, redirecting...",
					);
					setTimeout(() => navigate("/login"), 3000);
				} else {
					throw new Error(
						verifyResponse.data?.message || "Verification failed",
					);
				}
			} catch (err) {
				console.error("Verification error:", err);
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
