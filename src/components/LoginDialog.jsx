/**
 * LoginDialog Component
 *
 * This component renders a login dialog for users to sign in to their accounts.
 * It includes functionality for user authentication, saving user credentials,
 * and handling forgotten passwords.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered LoginDialog component.
 *
 * @dependencies
 * - React: For building the component.
 * - react-icons: For rendering icons.
 * - react-router-dom: For navigation links.
 * - axios: For making HTTP requests.
 * - UseStateContext: Custom context provider for global state management.
 * - useUserStore: Custom store for managing user-related state.
 * - showErrorDialog: Utility function to display error dialogs.
 * - showSuccessDialogWithTimer: Utility function to display success dialogs with a timer.
 * - ForgotPasswordModal: Component for handling forgotten password functionality.
 *
 * @state
 * - userName {string}: Stores the entered username/email.
 * - password {string}: Stores the entered password.
 * - saveUserChecked {boolean}: Tracks whether the "Remember me" checkbox is checked.
 * - forgotPasswordChecked {boolean}: Tracks whether the "Forgot Password?" checkbox is checked.
 * - forgotPasswordFlag {boolean}: Controls the visibility of the ForgotPasswordModal.
 * - errorMsg {string}: Stores error messages to display to the user.
 *
 * @methods
 * - isFormValid: Checks if the form inputs are valid.
 * - onSaveUserName(user, email): Saves the username and email to localStorage.
 * - dialogClose(): Closes the ForgotPasswordModal.
 * - isUserValidated(userName): Validates if the user is verified via an API call.
 * - SaveContactID(contactId): Saves the contact ID to localStorage.
 * - getUserAccessLevel(userName): Fetches the user's access level from the server.
 * - onSignIn(e): Handles the sign-in process, including validation and API calls.
 * - checkSaveUserHandler(): Toggles the "Remember me" checkbox state.
 * - checkForgotPasswordHandler(): Toggles the "Forgot Password?" checkbox state.
 *
 * @effects
 * - useEffect: Retrieves the saved username from localStorage on component mount.
 *
 * @styles
 * - enabledButtonStyle: CSS class for the enabled sign-in button.
 * - disabledButtonStyle: CSS class for the disabled sign-in button.
 */
/* eslint-disable */

import React, { useState, useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { UseStateContext } from "../contexts/ContextProvider";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "../index.css";
import useUserStore from "../stores/UserStore";

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

const LoginDialog = () => {
	const { setIsLoggedIn, setGlobalUserName, setUserEmail, setCompanyName } =
		UseStateContext();
	const setUserLoggedIn = useUserStore((state) => state.setUserLoggedIn);
	const setUserAccessLevel = useUserStore((state) => state.setUserAccessLevel);

	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [saveUserChecked, setSaveUserChecked] = useState(false);
	const [forgotPasswordChecked, setForgotPasswordChecked] = useState(false);
	const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const isFormValid = userName?.trim() !== "" && password?.trim() !== "";

	const onSaveUserName = (user, email) => {
		localStorage.setItem("loginName", user);
		localStorage.setItem("email", email);
	};

	const dialogClose = () => {
		setForgotPasswordFlag(false);
		setForgotPasswordChecked(false);
	};

	const isUserValidated = async (userName) => {
		const fetchString = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/user/is-user-validated`;
		
		// Get the token that was just stored
		const token = localStorage.getItem('auth_token');
		
		const headers = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		const res = await axios.post(fetchString, {
			email: userName,
		}, { headers });
		
		if (res.data.status === false) {
			window.alert(`User Not Validated: ${userName}`);
			return false;
		}
		return true;
	};
	
	const SaveContactID = (contactId) => {
		localStorage.setItem("contactID", contactId);
	};

	const getUserAccessLevel = async (userName) => {
		const fetchString = `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/contact/email/${userName}`;
		let accessLevel = -1;
		
		// Get the token for authentication
		const token = localStorage.getItem('auth_token');
		
		const headers = {
			'Content-Type': 'application/json',
		};
		
		if (token) {
			headers['Authorization'] = `Bearer ${token}`;
		}
		
		try {
			const response = await axios.get(fetchString, { headers });
			SaveContactID(response.data._id);
			if (response.data) {
				switch (response.data.accesslevel) {
					case "GUEST":
						accessLevel = 0;
						break;
					case "STANDARD":
						accessLevel = 1;
						break;
					case "POWER":
						accessLevel = 2;
						break;
					case "ADMIN":
						accessLevel = 3;
						break;
					case "SUPERADMIN":
						accessLevel = 4;
						break;
					default:
						accessLevel = -1;
						break;
				}
			}
		} catch (error) {
			console.error("Error fetching access level:", error);
			return -1;
		}
		return accessLevel;
	};

	const onSignIn = async (e) => {
		e.preventDefault();
		if (forgotPasswordChecked) {
			setForgotPasswordFlag(true);
			return;
		}
		showSuccessDialogWithTimer("Logging In...");
		localStorage.removeItem("logInFlag");
		setErrorMsg("");
		
		// NEW: Use the updated multi-tenant authentication endpoint
		const fetchString = `${process.env.REACT_APP_API_URL || "http://localhost:4000"}/api/auth`;
		console.log('🌐 [WEB LOGIN] Using API URL:', fetchString);
		
		try {
			const response = await fetch(fetchString, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: userName.trim().toLowerCase(),
					password: password
				}),
			});

			console.log('🌐 [WEB LOGIN] Response status:', response.status);
			
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const jsonData = await response.json();
			console.log('🌐 [WEB LOGIN] Response data:', jsonData);

			if (jsonData.data && jsonData.data.user) {
				const userData = jsonData.data.user;
				
				// Store authentication token for API requests
				if (jsonData.data.token) {
					console.log('🌐 [WEB LOGIN] Storing authentication token...');
					localStorage.setItem("auth_token", jsonData.data.token);
				}

				// Map to existing web app structure
				const mappedUser = {
					user: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
					email: userData.email,
					userId: userData.id,
					company: userData.firm?.name || "Unknown",
					userToken: jsonData.data.token
				};

				// First check if user is validated
				const validationFlag = await isUserValidated(userName);
				
				if (!validationFlag) {
					await showErrorDialog("User is not validated. Please check your email for validation link.");
					return;
				}

				// Only proceed with login if user is validated
				await getUserAccessLevel(userName).then((data) => {
					setUserAccessLevel(data);
					localStorage.setItem("accessLevel", data);
					setIsLoggedIn(true);
					setUserLoggedIn(true);
					localStorage.setItem("logInFlag", "true");
					localStorage.setItem("token", mappedUser.userToken);
					setGlobalUserName(JSON.stringify(mappedUser.user));
					localStorage.setItem(
						"userName",
						JSON.stringify(mappedUser.user),
					);
					const email = JSON.stringify(mappedUser.email);
					localStorage.setItem("userEmail", email);
					localStorage.setItem("userID", JSON.stringify(mappedUser.userId));
					setUserEmail(email);
					onSaveUserName(userName, email);
					setCompanyName(mappedUser.company);
					localStorage.setItem(
						"companyName",
						JSON.stringify(mappedUser.company),
					);
				});
				window.location = "/main/dashboard";
			} else {
				await showErrorDialog("Invalid Username or Password");
			}
		} catch (error) {
			console.error('🌐 [WEB LOGIN] Error:', error);
			await showErrorDialog(`Error: ${error.message}`);
			setErrorMsg(error.message);
			localStorage.setItem("logInFlag", "false");
		}
	};

	const checkSaveUserHandler = () => {
		setSaveUserChecked(!saveUserChecked);
	};

	const checkForgotPasswordHandler = () => {
		setForgotPasswordChecked(!forgotPasswordChecked);
	};

	useEffect(() => {
		const getUserName = () => {
			const user = localStorage.getItem("loginName");
			setUserName(user);
		};
		getUserName();
	}, []);

	const enabledButtonStyle =
		"bg-green-500 border-2 border-black-500 text-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white";
	const disabledButtonStyle =
		"border-2 border-gray-500 text-gray-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-gray-500 hover:text-white";

	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black bg-opacity-25 backdrop-blur-sm">
				<div
					onClick={(e) => {
						e.stopPropagation();
					}}
					onKeyUp={(e) => {
						if (e.key === "Enter") {
							e.stopPropagation();
						}
					}}
					className="modalContainer"
				>
					<div className="bg-white rounded-2xl shadow-2xl flex flex-row w-full">
						{/* Sign In Section */}
						<div className="w-3/5 p-5">
							<div className="text-left text-4xl font-bold">
								<span className="text-green-500">WORK</span>SIDE
							</div>
							<div className="py-10 text-center">
								<h2 className="text-3xl font-bold text-green-500 mb-2">
									Sign in to Account
								</h2>
								<div className="border-2 w-full border-green-500 inline-block mb-2" />
								{/* Login Info */}
								<div className="flex flex-col items-center">
									<div className="bg-gray-200 w-72 p-2 flex items-center mb-3">
										<FaRegEnvelope className="text-black m-2" />
										<input
											type="email"
											name="email"
											placeholder="Email"
											tabIndex={1}
											value={userName}
											onChange={(e) => setUserName(e.target.value)}
											className="bg-gray-200 outline-none text-sm flex-1"
										/>
									</div>
									<div className="bg-gray-200 w-72 p-2 flex items-center mb-3">
										<MdLockOutline className="text-black m-2" />
										<input
											type="password"
											name="password"
											placeholder="Password"
											onChange={(e) => setPassword(e.target.value)}
											className="bg-gray-200 outline-none text-sm flex-1"
										/>
									</div>
									<div className="flex w-72 mb-5 justify-between">
										<label className="flex items-center text-xs">
											<input
												type="checkbox"
												name="remember"
												className="mr-1"
												checked={saveUserChecked}
												onChange={checkSaveUserHandler}
											/>
											Remember me
										</label>
										<label className="flex items-center text-xs">
											<input
												type="checkbox"
												name="forgotpw"
												className="mr-1"
												checked={forgotPasswordChecked}
												onChange={checkForgotPasswordHandler}
											/>
											Forgot Password?
										</label>
									</div>
									{errorMsg && (
										<div className="border-2 border-red-500 text-red-500 bg-white rounded-full px-12 py-2 inline-block font-semibold">
											{errorMsg}
										</div>
									)}
									<button
										type="button"
										className={
											isFormValid ? enabledButtonStyle : disabledButtonStyle
										}
										onClick={onSignIn}
										disabled={!isFormValid}
									>
										Sign In
									</button>
								</div>
							</div>
						</div>
						{/* Forgot Password */}
						{forgotPasswordFlag && (
							<ForgotPasswordModal
								open={forgotPasswordFlag}
								onOK={dialogClose}
								onClose={dialogClose}
							/>
						)}
						{/* Sign Up Section */}
						<div className="w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl p-5 py-36 px-12 justify-center items-center content-center flex-col">
							<h2 className="text-3xl font-bold mb-2 text-center">
								Hello, Workside User
							</h2>
							<div className="border-2 w-full border-white inline-block mb-2" />
							<p className="mb-10 text-xl text-center">
								Please sign up and and begin the journey with us.
							</p>
							<div className="justify-center items-center content-center flex-col">
								<Link to="/signup">
									<h2 className="border-2 border-white rounded-full px-12 py-2 font-semibold mb-2 text-center hover:bg-white hover:text-green-500">
										Sign Up
									</h2>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default LoginDialog;
