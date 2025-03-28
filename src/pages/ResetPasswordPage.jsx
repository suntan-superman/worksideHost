/* eslint-disable */

import React from 'react'
import ResetPassword from '../components/ResetPassword'
import { UseStateContext } from "../contexts/ContextProvider";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useSearchParams } from "react-router-dom";

/**
 * ResetPasswordPage component handles the reset password functionality.
 * It retrieves the email and token from the URL search parameters and stores them in localStorage.
 * Additionally, it ensures the user is logged out by clearing relevant localStorage items and updating the global state.
 *
 * The component renders a draggable dialog box with a ResetPassword form inside it.
 *
 * @component
 * @returns {JSX.Element} A dialog containing the reset password form.
 *
 * @example
 * // Usage in a route
 * <Route path="/reset-password" element={<ResetPasswordPage />} />
 */
const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	const { setIsLoggedIn, setGlobalUserName } = UseStateContext();

	setIsLoggedIn(false);
	setGlobalUserName("");
	localStorage.removeItem("token");
	localStorage.removeItem("userName");
	localStorage.setItem("logInFlag", "false");

	localStorage.setItem("email", email);
	localStorage.setItem("resetToken", token);

	function PaperComponent(props) {
		return (
			<Draggable
				handle="forgotPasswordDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	return (
		<Dialog
			open={open}
			aria-labelledby="forgotPasswordDialog"
			PaperComponent={PaperComponent}
		>
			<DialogTitle id="forgotPasswordDialog">
				<span className="text-bold text-green-300">WORK</span>SIDE Reset
				Password
			</DialogTitle>
			<DialogContent>
				<div>
					{/* <div className="text-center text-xl font-bold pb-1">
				<span className="text-green-500">Current User</span>{name}
			</div> */}
					<ResetPassword />
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ResetPasswordPage;
