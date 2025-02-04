/* eslint-disable */
import React, { useState } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import axios from "axios";
import { showErrorDialog, showSuccessDialog } from "../utils/useSweetAlert";

const ForgotPasswordModal = ({
	open, 
	onOK,
	onClose,
}) => {
	if (!open ) return null;

	const [email, setEmail] = useState("");

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

	const handleEmailChange = ({ currentTarget: input }) => {
		setEmail(input.value);
	};

	const ValidateData = async () => {
		if (email.length < 6 || email.length > 50) {
			await showErrorDialog("Email must be between 6 and 50 characters");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const email = data.get("email");
		// window.alert(`Email: ${email}`);
	};

	const onSaveData = async () => {
		if (ValidateData() === true) {
			// Check if User exists
			const userEmail = email.replace(/"/g, "");
			const getUserFetchString = `${process.env.REACT_APP_MONGO_URI}api/user/does-user-exist/${userEmail}`;
	    await axios.post(getUserFetchString).then((res) => {
				if( res.status !== 200 ) {
		      showErrorDialog(`User Does Not Exist: ${userEmail}`).then(() => {
									return;
								});
				}}).catch((err) => {
		      showErrorDialog(`Error Status: ${JSON.stringify(err.status)}`);
				});

			window.alert(`Data is valid. Email: ${email}`);
			const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/forgotPassword`;
	    const res = await axios.post(fetchString, {
				email: email.replace(/"/g, ''),
			});
			
	    if (res.data.status === false) {
				await showErrorDialog(res.data.message);
	    } else {
				await showSuccessDialog(res.data.message);
	    }
			onOK();
		}
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="forgotPasswordDialog"
			PaperComponent={PaperComponent}
		>
			<DialogTitle id="forgotPasswordDialog">
				<span className="text-bold text-green-300">WORK</span>SIDE Forgot Password</DialogTitle>
			<DialogContent>
        <Box component="form"
           onSubmit={handleSubmit} 
           sx={{ mt: 1 }}>
          <TextField
            margin="normal"
						size="small"
            required
            fullWidth
            type="email"
            name="email"
            id="email"
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
				<div className="text-center">
					<p className="text-black text-sm font-bold pt-2 pb-2">
						Link will be sent your email to reset your password
					</p>
					</div>
					</Box>
				{/* </Stack> */}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="success" onClick={onSaveData}>
					OK
				</Button>
				<Button variant="contained" color="error" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ForgotPasswordModal
