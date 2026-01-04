/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Select from "react-select";

import { useToast } from "../contexts/ToastContext";
import { APP_INFO } from "../constants/appInfo";

// Initial form state
const INITIAL_FORM_STATE = {
	firstName: "",
	lastName: "",
	company: "",
	phone: "",
	email: "",
	password: "",
};

// Validation rules
const VALIDATION_RULES = {
	firstName: { min: 2, max: 20, message: "First Name must be between 2 and 20 characters" },
	lastName: { min: 2, max: 20, message: "Last Name must be between 2 and 20 characters" },
	company: { min: 2, max: 20, message: "Company must be between 2 and 20 characters" },
	phone: { length: 10, message: "Phone number must be 10 characters" },
	email: { min: 6, max: 50, message: "Email must be between 6 and 50 characters" },
	password: { min: 6, max: 20, message: "Password must be between 6 and 20 characters" },
};

/**
 * SignupDialog Component - Handles user registration
 * @component
 */
/**
 * SignupDialog Component
 *
 * This component renders a signup dialog for creating a new user account. It includes
 * form fields for user details, a company selection dropdown, and buttons for submitting,
 * clearing, or canceling the form. The component also handles form validation, data submission,
 * and error handling.
 *
 * Features:
 * - Fetches and displays a list of companies for selection.
 * - Validates user input based on predefined rules.
 * - Submits the form data to the server for account creation.
 * - Displays success or error messages based on the server response.
 * - Provides options to clear the form or cancel the signup process.
 *
 * State Variables:
 * - `data`: Stores the form data entered by the user.
 * - `options`: Stores the list of company options for the dropdown.
 * - `selectedOption`: Stores the currently selected company option.
 * - `error`: Stores error messages for form validation or submission failures.
 * - `isLoading`: Indicates whether the form submission is in progress.
 *
 * Refs:
 * - `emailRef`: Reference to the email input field.
 * - `passwordRef`: Reference to the password input field.
 *
 * Hooks:
 * - `useEffect`: Fetches company names on mount and resets the form.
 * - `useCallback`: Memoizes the function for fetching company names.
 *
 * Props:
 * - None
 *
 * Dependencies:
 * - `react-select` for the company dropdown.
 * - `useNavigate` for navigation after successful signup.
 *
 * @returns {JSX.Element} The rendered signup dialog component.
 */
const SignupDialog = () => {
	const toast = useToast();
	const [data, setData] = useState(INITIAL_FORM_STATE);
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const navigate = useNavigate();

	// Memoized company names fetcher
	const getCompanyNames = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/firm`,
			);
			if (!response.ok) {
				throw new Error("Failed to fetch company names");
			}
			return await response.json();
		} catch (error) {
			console.error("Error fetching company names:", error);
			toast.error("Failed to load company list");
			return [];
		}
	}, [toast]);

	// Fetch company names on mount
	useEffect(() => {
		const fetchCompanyNames = async () => {
			const companyNames = await getCompanyNames();
			if (companyNames?.length) {
				const formattedOptions = companyNames.map((company) => ({
					value: company.name,
					label: company.name,
				}));
				setOptions(formattedOptions);
			}
		};
		fetchCompanyNames();
	}, [getCompanyNames]);

	// Reset form on mount
	useEffect(() => {
		if (emailRef.current) emailRef.current.value = "";
		if (passwordRef.current) passwordRef.current.value = "";
		setData(INITIAL_FORM_STATE);
	}, []);

	const handleChange = ({ currentTarget: input }) => {
		setData((prev) => ({ ...prev, [input.name]: input.value }));
		setError(""); // Clear error when user starts typing
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected);
		setData((prev) => ({ ...prev, company: selected.value }));
	};

	const validateForm = () => {
		for (const [field, value] of Object.entries(data)) {
			const rule = VALIDATION_RULES[field];
			if (!rule) continue;

			if (rule.length && value.length !== rule.length) {
				setError(rule.message);
				return false;
			}
			if (rule.min && (value.length < rule.min || value.length > rule.max)) {
				setError(rule.message);
				return false;
			}
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!validateForm()) return;

		setIsLoading(true);
		console.log(`Data: ${JSON.stringify(data, null, 2)}`);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/user/`,
				{
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			const json = await response.json();

			if (response.ok) {
				toast.success("Check Email to Validate...");
				setTimeout(() => navigate("/login"), 2000);
			} else {
				throw new Error(json.message || "Registration failed");
			}
		} catch (error) {
			toast.error(`Registration failed: ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearForm = () => {
		setData(INITIAL_FORM_STATE);
		setSelectedOption(null);
		setError("");
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
							{APP_INFO.COPYRIGHT_WITH_COMPANY}
						</h2>
					</div>
					{/* Sign Up Section */}
					<div className="w-3/5 p-5 bg-black">
						<div className="bg-black rounded-2xl shadow-2xl flex flex-col items-center w-full align-middle">
							<div className="bg-black w-72 p-2 flex flex-col items-center mb-3">
								<form
									className="flex flex-col items-center"
									onSubmit={handleSubmit}
									autoComplete="off"
								>
									<input type="text" name="dummy" style={{ display: "none" }} />
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
											value={selectedOption}
											isDisabled={isLoading}
											onChange={handleSelectionChange}
											name="company"
											options={options}
											isLoading={!options.length}
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
										// autoComplete="off"
										ref={emailRef}
									/>
									<input
										type="password"
										placeholder="Password"
										name="password"
										onChange={handleChange}
										value={data.password}
										required
										className={styles.input}
										autoComplete="new-password"
										// autoComplete="off"
										ref={passwordRef}
									/>
									{error && <div className={styles.error_msg}>{error}</div>}
									<button
										type="submit"
										disabled={isLoading}
										className={`bg-green-700 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-lg ${
											isLoading ? "opacity-50 cursor-not-allowed" : ""
										}`}
									>
										{isLoading ? "Signing up..." : "Sign Up"}
									</button>
									<button
										type="button"
										className="bg-green-700 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
										onClick={handleClearForm}
									>
										Clear Form
									</button>
									<button
										type="button"
										className="bg-green-700 hover:drop-shadow-xl hover:bg-white p-1 rounded-lg w-40 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 mt-2 font-bold text-sm"
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
