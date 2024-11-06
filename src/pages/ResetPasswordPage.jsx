/* eslint-disable */

import React from 'react'
import ResetPassword from '../components/ResetPassword'
import { useStateContext } from '../contexts/ContextProvider';
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import {
    useSearchParams,
    useNavigate
} from "react-router-dom";

const ResetPasswordPage = () => {
	const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get("name");
  const email = searchParams.get("email");
  const token = searchParams.get("token");

	const {
    setIsLoggedIn,
    setGlobalUserName,
  } = useStateContext();

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
				<span className="text-bold text-green-300">WORK</span>SIDE Reset Password</DialogTitle>
			<DialogContent>
		<div>
			{/* <div className="text-center text-xl font-bold pb-1">
				<span className="text-green-500">Current User</span>{name}
			</div> */}
			<ResetPassword />
		</div>
			</DialogContent>
		</Dialog>
	)
}

export default ResetPasswordPage;
