/* eslint-disable */
// "use client";

import React, { useState, useEffect } from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useStateContext } from "../contexts/ContextProvider";
import "../index.css";
// import CookieConsent from "./CookieConsent";
// import { useCookies } from "react-cookie";

const LoginDialog = () => {
	const { setIsLoggedIn, setGlobalUserName } = useStateContext();
	const [userName, setUserName] = useState("");
	const [password, setPassword] = useState("");
	const [saveUserChecked, setSaveUserChecked] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	// const [cookies] = useCookies(["cookieConsent"]);

	const onSaveUserName = (user) => {
		localStorage.setItem("loginName", user);
	};

	const onSignIn = async (e) => {
		e.preventDefault();
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
				// window.alert(`User: ${JSON.stringify(jsonData.user)}`);
				// TODO - Need to validate password
				setIsLoggedIn(true);
				localStorage.setItem("logInFlag", "true");
				localStorage.setItem("token", jsonData.user.userToken);
				setGlobalUserName(JSON.stringify(jsonData.user.user));
				localStorage.setItem("userName", JSON.stringify(jsonData.user.user));
				localStorage.setItem("userID", JSON.stringify(jsonData.user.userId));
				onSaveUserName(userName);
				// Set Default Cursor
				document.getElementById("root").style.cursor = "default";
			}
		} catch (error) {
			// setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
			document.getElementById("root").style.cursor = "default";
			setIsLoggedIn(false);
			setErrorMsg(error.response.data.message);
			localStorage.setItem("logInFlag", "false");
			window.location = "/login";
		}

		document.getElementById("root").style.cursor = "default";
		window.location = "/dashboard";
	};

	const checkSaveUserHandler = () => {
		setSaveUserChecked(!saveUserChecked);
	};

	useEffect(() => {
		const getUserName = () => {
			const user = localStorage.getItem("loginName");
			setUserName(user);
		};
		getUserName();
	}, []);

	const enabledButtonStyle =
		"border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white";
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
										<input type="checkbox" name="forgotpw" className="mr-1" />
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
									// className={
									// 	!userName || !password ||
									// 		? disabledButtonStyle
									// 		: enabledButtonStyle
									// }
									className={
										!userName || !password
											? disabledButtonStyle
											: enabledButtonStyle
									}
									onClick={onSignIn}
									// disabled={!userName || !password || !cookies.cookieConsent}
									disabled={!userName.length > 6 || !password.length > 6}
								>
									Sign In
								</button>
							</div>
						</div>
						{/* {!cookies.cookieConsent && <CookieConsent />}{" "} */}
					</div>
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
