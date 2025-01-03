/* eslint-disable */

import React, { useState, useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../contexts/ContextProvider";
import ForgotPasswordModal from "./ForgotPasswordModal";
import "../index.css";
import useUserStore from "../stores/UserStore";

const LoginDialog = () => {
	const {
		setIsLoggedIn,
		setGlobalUserName,
		setUserEmail,
		setAccessLevel,
		setCompanyName,
	} = useStateContext();
	// const accessLevel = useUserStore((state) => state.accessLevel);
	// const setAccessLevel = useUserStore((state) => state.setAccessLevel);
	const setUserLoggedIn = useUserStore((state) => state.setUserLoggedIn);

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
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/is-user-validated`;
		const res = await axios.post(fetchString, {
			email: userName,
		});
		if (res.data.status === false) {
			window.alert(`User Not Validated: ${userName}`);
			return false;
		}
		return true;
	};

	const getUserAccessLevel = async (userName) => {
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact/email/${userName}`;
		let accessLevel = -1;

		try {
			const response = await fetch(fetchString);
			const jsonData = await response.json().then((data) => {
				switch (data[0].accesslevel) {
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
					default:
						accessLevel = -1;
						break;
				}
			});
		} catch (error) {
			console.error(error);
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
		toast.info("Logging In...");
		localStorage.removeItem("logInFlag");
		setErrorMsg("");
		// Set Wait Cursor
		document.getElementById("root").style.cursor = "wait";
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/${userName}?password=${password}`;
		try {
			const response = await fetch(fetchString);
			const jsonData = await response.json();
			if (jsonData.status === true) {
				const validationFlag = await isUserValidated(userName);
				if (validationFlag === true) {
					const userAccessLevel = await getUserAccessLevel(userName).then(
						(data) => {
							setAccessLevel(data);
							localStorage.setItem("accessLevel", data);
							setIsLoggedIn(true);
							setUserLoggedIn(true);
							localStorage.setItem("logInFlag", "true");
							localStorage.setItem("token", jsonData.user.userToken);
							setGlobalUserName(JSON.stringify(jsonData.user.user));
							localStorage.setItem(
								"userName",
								JSON.stringify(jsonData.user.user),
							);
							localStorage.setItem(
								"userID",
								JSON.stringify(jsonData.user.userId),
							);
							const email = JSON.stringify(jsonData.user.email);
							setUserEmail(email);
							onSaveUserName(userName, email);
							setCompanyName(jsonData.user.company);
							console.log("Company: ", jsonData.user.company);
						},
					);
				}
			}
			else {
				window.alert(jsonData.message);
				document.getElementById("root").style.cursor = "default";
				window.location = "/login";
			}
		} catch (error) {
			// setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
			document.getElementById("root").style.cursor = "default";
			setErrorMsg(error.response.data.message);
			localStorage.setItem("logInFlag", "false");
			window.location = "/login";
		}
		document.getElementById("root").style.cursor = "default";
		window.location = "/main/dashboard";
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
				<ToastContainer />
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
	);
};

export default LoginDialog;
