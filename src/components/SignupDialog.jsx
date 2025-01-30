/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Select from "react-select";

import { showErrorDialog, showSuccessDialog } from "../utils/useSweetAlert";

const SignupDialog = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		company: "",
		phone: "",
		email: "",
		password: "",
	});

	const [options, setOptions] = useState([]);

	const [selectedOption, setSelectedOption] = useState(null);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);
		setData({ ...data, company: selected.value });
	};

	const GetCompanyNames = async () => {
		const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/firm`);
		const json = await response.json();
		if (response.ok) {
			return json;
		}
		return;
	};

	useEffect(() => {
		const fetchCompanyNames = async () => {
			const companyNames = await GetCompanyNames();
			if (companyNames) {
				const options = companyNames.map((company) => {
					return { value: company.name, label: company.name };
				});
				setOptions(options);
			}
		};
		fetchCompanyNames();
	}, []);

	const containsWord = (inputString, word) => {
		if (typeof inputString !== "string") {
			console.error("Invalid input: expected a string");
			return false;
		}
		return inputString.toLowerCase().includes(word.toLowerCase());
	};
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (data.firstName.length < 2 || data.firstName.length > 20) {
			setError("First Name must be between 2 and 20 characters");
			return;
		}
		if (data.lastName.length < 2 || data.lastName.length > 20) {
			setError("Last Name must be between 2 and 20 characters");
			return;
		}
		if (data.company.length < 2 || data.company.length > 20) {
			setError("Company must be between 2 and 20 characters");
			return;
		}
		if (data.phone.length < 10 || data.phone.length > 10) {
			setError("Phone number must be 10 characters");
			return;
		}
		if (data.email.length < 6 || data.email.length > 50) {
			setError("Email must be between 6 and 50 characters");
			return;
		}
		if (data.password.length < 6 || data.password.length > 20) {
			setError("Password must be between 6 and 20 characters");
			return;
		}
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/user/`,
			{
				method: "POST",
				body: JSON.stringify(data),
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		const json = await response.json();
		const { status } = response;
		if (status < 300) {
			await showSuccessDialog("Check Email to Validate...");
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} else {
			console.log(`Status: ${status}`);
			console.log("Error Creating User. User Exists");
			await showErrorDialog(`User Exists: ${data.email}`);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-black bg-opacity-25 backdrop-blur-sm">
			<div
				onClick={(e) => {
					e.stopPropagation();
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.stopPropagation();
					}
				}}
				className="modalContainer"
			>
				<div className="bg-white rounded-2xl shadow-2xl flex flex-row w-full align-middle">
					{/* Sign In Section */}
					<div className="w-2/5 p-10">
						<div className="font-bold text-4xl text-center">
							<span className="text-green-500">WORK</span>SIDE
							<h2 className="text-4xl font-bold text-black mb-2 mt-3">
								Welcome!!
							</h2>
						</div>
						<img
							src={`${process.env.PUBLIC_URL}background.jpg`}
							alt="Background"
							className="w-[100%] h-[70%]"
							// className="w-full h-full object-cover"
						/>
						<h2 className="text-xs font-bold text-black mb-2 text-center">
							Copyright Workside Software 2025
						</h2>
					</div>
					{/* Sign Up Section */}
					<div className="w-3/5 p-5 bg-black">
						<div className="bg-black rounded-2xl shadow-2xl flex flex-col items-center w-full align-middle">
							<div className="bg-black w-72 p-2 flex flex-col items-center mb-3">
								<form
									className="flex flex-col items-center"
									onSubmit={handleSubmit}
								>
									<h2 className="text-2xl font-bold text-green-500 mb-2">
										Create Account
									</h2>
									<input
										type="text"
										placeholder="First Name"
										name="firstName"
										onChange={handleChange}
										value={data.firstName}
										required
										className={styles.input}
									/>
									<input
										type="text"
										placeholder="Last Name"
										name="lastName"
										onChange={handleChange}
										value={data.lastName}
										required
										className={styles.input}
									/>
									<div style={{ width: "300px" }}>
										<Select
											className="basic-single"
											classNamePrefix="select"
											defaultValue={selectedOption}
											isDisabled={false}
											onChange={handleSelectionChange}
											// isLoading={isLoading}
											// isClearable={isClearable}
											// isRtl={isRtl}
											// isSearchable={isSearchable}
											name="company"
											options={options}
										/>
									</div>
									<input
										type="text"
										placeholder="Phone"
										name="phone"
										onChange={handleChange}
										value={data.phone}
										required
										className={styles.input}
									/>
									<input
										type="email"
										placeholder="Email"
										name="email"
										onChange={handleChange}
										value={data.email}
										required
										className={styles.input}
									/>
									<input
										type="password"
										placeholder="Password"
										name="password"
										onChange={handleChange}
										value={data.password}
										required
										className={styles.input}
									/>
									{error && <div className={styles.error_msg}>{error}</div>}
									<button
										type="submit"
										className="bg-green-300 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-lg"
									>
										Sign Up
									</button>
									<button
										type="button"
										className="bg-green-300 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
										onClick={() => {
											setData({
												firstName: "",
												lastName: "",
												company: "",
												phone: "",
												email: "",
												password: "",
											});
											setError("");
										}}
									>
										Clear Form
									</button>
									<button
										type="button"
										className="bg-green-300 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
										onClick={() => {
											window.location = "/login";
										}}
									>
										Cancel
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignupDialog;
