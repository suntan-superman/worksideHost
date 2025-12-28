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

import React, { useState, useEffect, useRef } from "react";
import { FaRegEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { UseStateContext } from "../contexts/ContextProvider";
import { useToast } from "../contexts/ToastContext";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "../index.css";
import useUserStore from "../stores/UserStore";

const LoginDialog = () => {
	const { setIsLoggedIn, setGlobalUserName, setUserEmail, setCompanyName } =
		UseStateContext();
	const toast = useToast();
	const setUserLoggedIn = useUserStore((state) => state.setUserLoggedIn);
	const setUserAccessLevel = useUserStore((state) => state.setUserAccessLevel);

	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [saveUserChecked, setSaveUserChecked] = useState(false);
	const [forgotPasswordChecked, setForgotPasswordChecked] = useState(false);
	const [forgotPasswordFlag, setForgotPasswordFlag] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	// Refs for tab navigation
	const emailInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const signInButtonRef = useRef(null);

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
		toast.loading("Logging In...", "Please Wait");
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
				// Try to get error message from response body
				let errorMessage = "Login failed";
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch {
					// If we can't parse JSON, use status text
					errorMessage = response.status === 401 
						? "Invalid email or password" 
						: `Server error (${response.status})`;
				}
				throw new Error(errorMessage);
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
					userToken: jsonData.data.token,
					role: userData.role || "STANDARD"
				};

				// First check if user is validated
				const validationFlag = await isUserValidated(userName);
				
				if (!validationFlag) {
					toast.error("User is not validated. Please check your email for validation link.");
					return;
				}

				// Convert role to access level number
				const roleToAccessLevel = {
					"GUEST": 0,
					"STANDARD": 1,
					"POWER": 2,
					"ADMIN": 3,
					"SUPERADMIN": 4
				};
				const accessLevelNum = roleToAccessLevel[mappedUser.role] ?? 1;
				console.log('🌐 [WEB LOGIN] User role:', mappedUser.role, '-> Access Level:', accessLevelNum);

				// Store user data in localStorage
				setUserAccessLevel(accessLevelNum);
				localStorage.setItem("accessLevel", accessLevelNum);
				localStorage.setItem("userRole", mappedUser.role);
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
				localStorage.setItem("companyName", mappedUser.company);
				// Store firm info for multi-tenant routing
				localStorage.setItem("firmId", userData.firm?.id || "");
				localStorage.setItem("firmType", userData.firm?.type || "");
				console.log('🌐 [WEB LOGIN] Stored firm info:', userData.firm);
				
				// Also try to get contact ID (non-blocking)
				getUserAccessLevel(userName).catch(err => console.log('Contact lookup failed (non-critical):', err));
				
				window.location = "/main/dashboard";
			} else {
				toast.error("Unable to complete login. Please try again.");
			}
		} catch (error) {
			console.error('🌐 [WEB LOGIN] Error:', error);
			// Show user-friendly error message
			const userMessage = error.message.includes("Invalid email or password")
				? "Invalid email or password. Please check your credentials and try again."
				: error.message.includes("Network") || error.message.includes("fetch")
				? "Unable to connect to the server. Please check your internet connection."
				: error.message || "An unexpected error occurred. Please try again.";
			toast.error(userMessage);
			setErrorMsg(userMessage);
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
		// Focus on email input when component mounts
		if (emailInputRef.current) {
			emailInputRef.current.focus();
		}
	}, []);

	// Handle keyboard navigation
	const handleKeyDown = (e, nextRef) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (nextRef && nextRef.current) {
				nextRef.current.focus();
			} else if (isFormValid) {
				onSignIn(e);
			}
		}
	};

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
									<div className="bg-gray-200 w-72 p-2 flex items-center mb-3 rounded-md focus-within:ring-2 focus-within:ring-green-500">
										<FaRegEnvelope className="text-black m-2" />
										<input
											ref={emailInputRef}
											type="email"
											name="email"
											placeholder="Email"
											tabIndex={1}
											value={userName}
											onChange={(e) => setUserName(e.target.value)}
											onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
											className="bg-gray-200 outline-none text-sm flex-1"
											autoComplete="email"
										/>
									</div>
									<div className="bg-gray-200 w-72 p-2 flex items-center mb-3 rounded-md focus-within:ring-2 focus-within:ring-green-500">
										<MdLockOutline className="text-black m-2" />
										<input
											ref={passwordInputRef}
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Password"
											tabIndex={2}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											onKeyDown={(e) => handleKeyDown(e, signInButtonRef)}
											className="bg-gray-200 outline-none text-sm flex-1"
											autoComplete="current-password"
										/>
										<button
											type="button"
											tabIndex={3}
											onClick={() => setShowPassword(!showPassword)}
											className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1 transition-colors"
											aria-label={showPassword ? "Hide password" : "Show password"}
										>
											{showPassword ? (
												<FaEyeSlash className="w-5 h-5" />
											) : (
												<FaEye className="w-5 h-5" />
											)}
										</button>
									</div>
									<div className="flex w-72 mb-5 justify-between">
										<label className="flex items-center text-xs cursor-pointer">
											<input
												type="checkbox"
												name="remember"
												tabIndex={4}
												className="mr-1 cursor-pointer"
												checked={saveUserChecked}
												onChange={checkSaveUserHandler}
											/>
											Remember me
										</label>
										<label className="flex items-center text-xs cursor-pointer">
											<input
												type="checkbox"
												name="forgotpw"
												tabIndex={5}
												className="mr-1 cursor-pointer"
												checked={forgotPasswordChecked}
												onChange={checkForgotPasswordHandler}
											/>
											Forgot Password?
										</label>
									</div>
									{errorMsg && (
										<div className="border-2 border-red-500 text-red-500 bg-white rounded-full px-12 py-2 inline-block font-semibold mb-3">
											{errorMsg}
										</div>
									)}
									<button
										ref={signInButtonRef}
										type="button"
										tabIndex={6}
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
