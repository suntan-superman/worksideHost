/* eslint-disable */
import React, { useEffect } from "react";
import { MdOutlineCancel } from 'react-icons/md';
import { BsCheck } from 'react-icons/bs';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import axios from "axios";

import { themeColors } from '../data/dummy';
import { UseStateContext } from "../contexts/ContextProvider";
import Select from "react-select";
import ResetPassword from "./ResetPassword";

/**
 * ThemeSettings Component
 *
 * This component provides a user interface for managing theme settings,
 * including theme mode, theme colors, grid row settings, profile avatar,
 * and password reset functionality.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered ThemeSettings component.
 *
 * @description
 * - Allows users to toggle between light and dark themes.
 * - Enables users to select a theme color from predefined options.
 * - Provides a dropdown to select the number of grid rows, with the selection
 *   saved in localStorage.
 * - Allows users to upload and preview a profile avatar, with the avatar
 *   uploaded to the server and saved in localStorage.
 * - Includes a reset password feature that toggles a reset password form.
 *
 * @example
 * <ThemeSettings />
 *
 * @dependencies
 * - React
 * - lodash (for `_.findIndex`)
 * - axios (for avatar upload requests)
 * - react-select (for dropdown selection)
 * - TooltipComponent (for theme color tooltips)
 * - MdOutlineCancel (for close button icon)
 * - BsCheck (for theme color selection checkmark)
 * - ResetPassword (for password reset form)
 *
 * @hooks
 * - `useState` for managing component state:
 *   - `resetPasswordFlag`: Toggles the reset password form.
 *   - `selectedOption`: Stores the selected grid row option.
 *   - `numGridRowsIndex`: Tracks the index of the selected grid row option.
 *   - `avatar`: Stores the uploaded avatar data.
 *   - `avatarPreview`: Stores the preview of the uploaded avatar.
 * - `useEffect` for initializing grid row settings from localStorage.
 *
 * @functions
 * - `handleResetPassword`: Toggles the reset password form.
 * - `handleSelectionChange`: Updates the selected grid row option and saves it to localStorage.
 * - `handleAvatarChange`: Handles avatar file selection and generates a preview.
 * - `handleAvatarUpload`: Uploads the avatar to the server and updates localStorage.
 */
const ThemeSettings = () => {
	const { setColor, setMode, currentMode, currentColor, setThemeSettings } =
		UseStateContext();
	const [resetPasswordFlag, setResetPasswordFlag] = React.useState(false);
	const [selectedOption, setSelectedOption] = React.useState(0);
	const [numGridRowsIndex, setNumGridRowsIndex] = React.useState(0);
	const [avatar, setAvatar] = React.useState(null);
	const [avatarPreview, setAvatarPreview] = React.useState(null);

	const numRowsOptions = [
		{ value: 8, label: "8" },
		{ value: 10, label: "10" },
		{ value: 12, label: "12" },
		{ value: 14, label: "14" },
		{ value: 16, label: "16" },
	];

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) {
			setSelectedOption(numGridRows);
			const index = _.findIndex(numRowsOptions, { value: numGridRows });
			setNumGridRowsIndex(index);
			// window.alert(
			// 	`Selected Rows: ${numGridRows} Index: ${index} Grid Rows: ${numRowsOptions[index].value}`,
			// );
		}
	}, [numRowsOptions, numGridRowsIndex]);

	const handleResetPassword = () => {
		setResetPasswordFlag(!resetPasswordFlag);
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);

		const index = _.findIndex(numRowsOptions, { value: selected.value });
		setNumGridRowsIndex(index);

		// window.alert(`Selected Rows: ${selectedOption} Index: ${index}`);
		localStorage.setItem("numGridRows", selected.value);
	};

	const handleAvatarChange = async (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setAvatarPreview(reader.result);
				setAvatar(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleAvatarUpload = async () => {
		if (!avatar) return;

		try {
			const contactId = localStorage.getItem("contactID")?.replace(/"/g, "");
			if (!contactId) {
				console.error("No user ID found");
				return;
			}
			const url = `${process.env.REACT_APP_MONGO_URI}/api/contact/${contactId}/avatar`;
			console.log("url ", url);
			const response = await axios.patch(url, { avatar });

			if (response.status === 200) {
				// Update local storage with new avatar
				localStorage.setItem("userAvatar", avatar);
				// Force a page reload to update the navbar
				window.location.reload();
			}
		} catch (error) {
			console.error("Error uploading avatar:", error);
		}
	};

	return (
		<div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
			<div className="float-right h-screen dark:text-gray-200  bg-white dark:bg-[#484B52] w-400">
				<div className="flex justify-between items-center p-4 ml-4">
					<p className="font-semibold text-lg">Settings</p>
					<button
						type="button"
						onClick={() => setThemeSettings(false)}
						style={{ color: "rgb(153, 171, 180)", borderRadius: "50%" }}
						className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
					>
						<MdOutlineCancel />
					</button>
				</div>
				{resetPasswordFlag === false && (
					<>
						<div className="flex-col border-t-1 border-color p-4 ml-4">
							<p className="font-semibold text-xl ">Theme Option</p>

							<div className="mt-4">
								<input
									type="radio"
									id="light"
									name="theme"
									value="Light"
									className="cursor-pointer"
									onChange={setMode}
									checked={currentMode === "Light"}
								/>
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
								<label htmlFor="light" className="ml-2 text-md cursor-pointer">
									Light
								</label>
							</div>
							<div className="mt-2">
								<input
									type="radio"
									id="dark"
									name="theme"
									value="Dark"
									onChange={setMode}
									className="cursor-pointer"
									checked={currentMode === "Dark"}
								/>
								{/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
								<label htmlFor="dark" className="ml-2 text-md cursor-pointer">
									Dark
								</label>
							</div>
						</div>
						<div className="p-4 border-t-1 border-color ml-4">
							<p className="font-semibold text-xl ">Theme Colors</p>
							<div className="flex gap-3">
								{themeColors.map((item, index) => (
									<TooltipComponent
										key={index}
										content={item.name}
										position="TopCenter"
									>
										<div
											className="relative mt-2 cursor-pointer flex gap-5 items-center"
											key={item.name}
										>
											<button
												type="button"
												className="h-10 w-10 rounded-full cursor-pointer"
												style={{ backgroundColor: item.color }}
												onClick={() => setColor(item.color)}
											>
												<BsCheck
													className={`ml-2 text-2xl text-white ${item.color === currentColor ? "block" : "hidden"}`}
												/>
											</button>
										</div>
									</TooltipComponent>
								))}
							</div>
						</div>
					</>
				)}
				{resetPasswordFlag === false && (
					<div className="p-4 border-t-1 border-color ml-4">
						<div style={{ width: "200px" }}>
							<p className="font-semibold text-xl ">Number of Grid Rows</p>
							<Select
								className="basic-single"
								classNamePrefix="select"
								value={numRowsOptions[numGridRowsIndex]}
								onChange={handleSelectionChange}
								name="numrows"
								options={numRowsOptions}
							/>
						</div>
					</div>
				)}
				<div className="p-4 border-t-1 border-color ml-4">
					<div style={{ width: "200px" }}>
						<p className="font-semibold text-xl">Profile Avatar</p>
						<div className="flex items-center gap-2 mt-2">
							{avatarPreview && (
								<img
									src={avatarPreview}
									alt="Avatar preview"
									className="w-8 h-8 rounded-full"
								/>
							)}
							<input
								type="file"
								accept="image/*"
								onChange={handleAvatarChange}
								className="hidden"
								id="avatar-input"
							/>
							<label
								htmlFor="avatar-input"
								className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-1 px-4 rounded cursor-pointer"
							>
								Choose Image
							</label>
							{avatar && (
								<button
									type="button"
									className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-1 px-4 rounded"
									onClick={handleAvatarUpload}
								>
									Upload
								</button>
							)}
						</div>
					</div>
				</div>
				<div className="p-4 border-t-1 border-color ml-4">
					<div style={{ width: "200px" }}>
						<p className="font-semibold text-xl ">Reset Password</p>
					</div>
					<button
						className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-1 px-4 rounded mt-1"
						type="button"
						onClick={handleResetPassword}
					>
						{resetPasswordFlag === false ? "Reset Password" : "Cancel Reset"}
					</button>
				</div>
				{resetPasswordFlag === true && <ResetPassword />}
			</div>
		</div>
	);
};

export default ThemeSettings;
