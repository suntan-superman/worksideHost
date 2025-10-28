/* eslint-disable */
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Selection,
	Filter,
	Inject,
	Page,
	Resize,
	Freeze,
} from "@syncfusion/ej2-react-grids";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
	GetAllUsers,
	GetFirmType,
	fetchWithHandling,
} from "../api/worksideAPI";
import { UseStateContext } from "../contexts/ContextProvider";
import _ from "lodash";
import UserEditModalX from "./components/UserEditModalX";

import "../index.css";
import "../App.css";
import "../styles/syncfusionStyles.css";
// import { Send } from "@mui/icons-material";

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
///////////////////////////////////////////////////////////////////

let gridPageSize = 10;
let updatedContactData = null;

/**
 * ValidateUsersTab Component
 *
 * This component is responsible for managing and validating user data within a grid interface.
 * It provides functionality for adding, updating, deleting, and validating users, as well as
 * interacting with a backend API for user and contact data management.
 *
 * Features:
 * - Displays a grid of users with options to validate, edit, or delete user records.
 * - Fetches pending user data using React Query and refreshes data periodically.
 * - Handles user validation, including email validation and status updates.
 * - Supports adding or updating contact data associated with users.
 * - Sends email notifications upon successful user validation.
 * - Provides a modal dialog for editing user details.
 *
 * Hooks:
 * - `useQueryClient`: React Query client for managing query cache.
 * - `useQuery`: Fetches pending user data from the backend.
 * - `useState`: Manages component state, including form data, dialog visibility, and flags.
 * - `useEffect`: Handles side effects, such as setting grid page size and processing user modifications.
 *
 * Props: None
 *
 * State Variables:
 * - `showDialog`: Boolean to control the visibility of the user edit modal.
 * - `insertFlag`: Boolean to track whether a new user is being added.
 * - `modifyFlag`: Boolean to track whether a user record is being modified.
 * - `selectedRecord`: Stores the ID of the currently selected user record.
 * - `selectedRecordData`: Stores the data of the currently selected user record.
 * - `contactData`: Stores contact information fetched from the backend.
 * - `contactID`: Stores the ID of the contact associated with the selected user.
 * - `newUser`: Boolean to indicate whether the selected user is new.
 * - `formData`: Object containing form data for user details.
 *
 * Functions:
 * - `GetAccessLevel`: Retrieves the user's access level from local storage.
 * - `usersActionComplete`: Handles grid actions such as adding, updating, saving, or deleting users.
 * - `rowSelectedUser`: Retrieves the selected row's user ID from the grid.
 * - `onUserLoad`: Configures grid settings on load.
 * - `resetFormData`: Resets the form data to its initial state.
 * - `recordClick`: Handles clicks on grid records and opens the user edit modal.
 * - `dialogClose`: Closes the user edit modal.
 * - `SaveUserValidation`: Saves user validation data to the backend.
 * - `GetContactInfoByEmail`: Fetches contact information by email from the backend.
 * - `UpdateContactData`: Updates contact data in the backend.
 * - `AddContactData`: Adds new contact data to the backend.
 * - `SendEmailValidation`: Sends an email notification for user validation.
 * - `dialogSave`: Saves updated contact data and triggers user validation.
 * - `dialogOpen`: Opens the user edit modal.
 *
 * Dependencies:
 * - React Query for data fetching and caching.
 * - Syncfusion Grid for displaying and managing user data.
 * - Custom hooks and utility functions for API interactions and error handling.
 *
 * Returns:
 * - A JSX element containing the user grid and modal dialog for editing user details.
 */
const ValidateUsersTab = () => {
	const queryClient = useQueryClient();
	const [showDialog, setShowDialog] = useState(false);

	let usersGridRef = useRef(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const [modifyFlag, setModifyFlag] = useState(false);

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	// const editOptions = {
	// 	// allowEditing: accessLevel > 2,
	// 	allowUpdating: accessLevel > 2,
	// 	allowAdding: accessLevel > 2,
	// 	allowDeleting: accessLevel > 2,
	// 	mode: "Dialog",
	// };

	// const toolbarOptions = ["Add", "Update", "Delete"];
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [selectedRecordData, setSelectedRecordData] = useState(null);
	const settings = { mode: "Row" };
	const position = { X: "center", Y: "center" };
	const { currentColor } = UseStateContext();
	const [contactData, setContactData] = useState(null);
	const [contactID, setContactID] = useState(null);
	const [newUser, setNewUser] = useState(true);
	// let newUser = false;

	const [formData, setFormData] = useState({
		firstname: "Mike",
		lastname: "Hunt",
		nickname: "",
		company: "",
		classification: "",
		accesslevel: "",
		email: "mhunt@gmail.com",
		primaryphone: "",
		status: "",
		comment: "",
	});

	// Query Management
	const {
		data: userList,
		// onSuccess: onGetUsersSuccess,
		isLoading: isUsersLoading,
		// refetch,
	} = useQuery({
		queryKey: ["pendingUsers"],
		queryFn: () => GetAllUsers(),
		refetchInterval: 1000 * 20, // 1 minute
		// queryFn: userAPI.getPendingUsers,
		// enabled: !!adminId && userRole?.includes("ADMIN"),
		staleTime: 60000,
		onError: (error) => handleError(error, "fetching pending users"),
	});

	// Mutation Management
	// const updateUserMutation = useMutation({
	// 	mutationFn: userAPI.updateUser,
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries(["pendingUsers"]);
	// 		setIsEditModalOpen(false);
	// 		Alert.alert("Success", "User updated successfully");
	// 	},
	// 	onError: (error) => handleError(error, "updating user"),
	// });

	// const validateMutation = useMutation({
	// 	mutationFn: userAPI.validateUser,
	// 	onSuccess: () => {
	// 		queryClient.invalidateQueries(["pendingUsers"]);
	// 		Alert.alert("Success", "User validated successfully");
	// 	},
	// 	onError: (error) => handleError(error, "validating user"),
	// });

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	const usersActionComplete = async (args) => {
		if (!usersGridRef) return;
		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Users";
			}
			if (args.requestType === "add") {
				// set insert flag
				setInsertFlag(true);
			}
			if (args.requestType === "update") {
				// set insert flag
				setInsertFlag(false);
			}
			if (args.requestType === "save") {
				// Save or Update Data
				const { data } = args;

				if (insertFlag === true) {
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
					}
				} else {
				}
				setInsertFlag(false);
			}
			if (args.requestType === "delete") {
				// Delete Data
				handleUserDelete();
				setInsertFlag(false);
			}
		}
	};

	const rowSelectedUser = () => {
		if (usersGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = usersGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(userList[selectedrowindex]?._id);
		}
	};

	const onUserLoad = () => {
		const gridElement = document.getElementById("userGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 2;
			gridInstance.pageSettings.freeze = true;
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const gridTemplate = (props) => (
		<div>
			<button
				type="button"
				style={{
					background: currentColor,
					color: "white",
					padding: "5px",
					borderRadius: "5%",
				}}
				className="userData"
			>
				Validate
			</button>
		</div>
	);

	const resetFormData = () => {
		setFormData({
			firstname: "",
			lastname: "",
			nickname: "",
			company: "",
			classification: "",
			accesslevel: "",
			email: "",
			primaryphone: "",
			status: "",
			comment: "",
		});
	};

	const recordClick = async (args) => {
		if (args.target.classList.contains("userData")) {
			if (args.rowData.isEmailValid === false) {
				showErrorDialog("Email is not Validated...");
				return;
			}
			if (
				args.rowData.isEmailValid === true &&
				args.rowData.isUserValidated === true
			) {
				showErrorDialog("User Already Validated...");
				return;
			}
			resetFormData();

			// Get Contact Info by Email
			await GetContactInfoByEmail(args.rowData.email);

			if (newUser === true) {
				setFormData({
					firstname: args.rowData?.firstName,
					lastname: args.rowData?.lastName,
					company: args.rowData?.company,
					classification: "SUPPLIER",
					accesslevel: "STANDARD",
					email: args.rowData?.email,
					primaryphone: args.rowData?.phone,
					status: "ACTIVE",
				});
			} else {
				const newContactData = {
					firstname: args.rowData?.firstName,
					lastname: args.rowData?.lastName,
					nickname: contactData?.nickname,
					company: args.rowData?.company,
					classification: contactData?.contactclass,
					accesslevel: contactData?.accesslevel,
					primaryphone: contactData?.primaryphone,
					email: args.rowData?.email,
					status: contactData?.status,
					comment: contactData?.comment,
				};
				setFormData(newContactData);
			}
			setSelectedRecordData(args.rowData);
			setSelectedRecord(args.rowData?._id);
			setShowDialog(true);
		}
	};

	const dialogClose = () => {
		setShowDialog(false);
	};

	const SaveUserValidation = useCallback(async () => {
		if (selectedRecordData === null) {
			return;
		}
		const fetchString = `${process.env.REACT_APP_API_URL}/api/user/${selectedRecordData.email}`;
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				isUserValidated: updatedContactData.status !== "DECLINED",
				status: updatedContactData.status,
				statusdate: new Date(),
				comment: updatedContactData.comment,
			}),
		};
		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
		} catch (error) {
			showErrorDialog(`Error: ${error}`);
		}
	}, [selectedRecordData, updatedContactData]);

	const GetContactInfoByEmail = async (email) => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/contact/email/${email}`;
		setContactData(null);
		setContactID(null);
		setNewUser(true);

		try {
			const response = await fetch(fetchString);
			const data = await response.json();

			// Check if the response indicates no contact found
			if (
				!response.ok ||
				data.message === "Contact not found" ||
				!data ||
				data.length === 0 ||
				data.newUser === true
			) {
				setNewUser(true);
				setContactData(null);
				setContactID(null);
				return;
			}

			// Contact found
			setContactData(data[0]);
			setContactID(data[0]?._id);
			setNewUser(false);
		} catch (error) {
			// If there's an error, treat as new user
			setNewUser(true);
			setContactData(null);
			setContactID(null);
			showErrorDialog(`Error: ${error}`);
		}
	};

	const UpdateContactData = useCallback(async () => {
		const id = contactID;
		const fetchString = `${process.env.REACT_APP_API_URL}/api/contact/${id}`;
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contactclass: formData?.classification,
				firm: formData?.company,
				accesslevel: formData?.accesslevel,
				username: selectedRecordData?.email,
				firstname: formData?.firstname,
				lastname: formData?.lastname,
				nickname: formData?.nickname,
				primaryphone: formData?.primaryphone,
				secondaryphone: formData?.primaryphone,
				primaryemail: selectedRecordData?.email,
				secondaryemail: formData?.email,
				status: formData?.status,
				statusdate: new Date(),
			}),
		};
		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
			setContactData(jsonData);
		} catch (error) {
			showErrorDialog(`Error: ${error}`);
			console.error(error);
		}
	}, [contactID, formData, selectedRecordData]);

	const AddContactData = useCallback(async () => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/contact`;
		const { firmType } = await GetFirmType(formData.company);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contactclass: firmType,
				firm: formData.company,
				accesslevel: updatedContactData.accesslevel,
				username: selectedRecordData.email,
				firstname: formData.firstname,
				lastname: formData.lastname,
				nickname: formData.nickname,
				primaryphone: formData.primaryphone,
				secondaryphone: formData.primaryphone,
				primaryemail: selectedRecordData.email,
				secondaryemail: formData.email,
				status: formData.status,
				statusdate: new Date(),
			}),
		};

		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
			setContactData(jsonData);
		} catch (error) {
			showErrorDialog(`Error: ${error}`);
		}
	}, [formData, selectedRecordData, updatedContactData]);

	const SendEmailValidation = useCallback(async (email) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				emailAddress: email,
				emailSubject: "Workside User Validated",
				emailMessage:
					"Your access has been approved by your Workside Administrator...",
			}),
		};
		const { status, data } = await fetchWithHandling(
			"/api/email",
			requestOptions,
		);
		return status;
	}, []);

	useEffect(() => {
		if (modifyFlag === false || selectedRecordData === null) return;

		setFormData((prev) => ({
			...prev,
			...updatedContactData,
		}));

		// Update User Record
		SaveUserValidation().then(() => {
			queryClient.invalidateQueries("pendingUsers");

			if (updatedContactData?.status === "DECLINED") {
				// Delete Contact Record
				// DeleteContactData();
			} else {
				// Handle contact data based on whether it's a new user or existing user
				if (newUser) {
					// Add new contact for new user
					AddContactData().then(() => {
						SendEmailValidation(selectedRecordData.email);
						showSuccessDialogWithTimer("User Validated...Check Email");
					});
				} else {
					// Update existing contact
					UpdateContactData().then(() => {
						SendEmailValidation(selectedRecordData.email);
						showSuccessDialogWithTimer("User Validated...Check Email");
					});
				}
			}
		});

		setModifyFlag(false);
	}, [
		modifyFlag,
		selectedRecordData,
		newUser,
		queryClient,
		SaveUserValidation,
		AddContactData,
		UpdateContactData,
		SendEmailValidation,
	]);

	const dialogSave = (data) => {
		updatedContactData = data;
		setModifyFlag(true);
		setShowDialog(false);
	};

	const dialogOpen = () => {
		setShowDialog(true);
	};

	const dialogButtonFormat =
		"bg-green-200 text-black p-1 rounded-lg w-24 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 text-xs";

	if (isUsersLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
			<GridComponent
				id="userGridElement"
				dataSource={userList.data}
				actionComplete={usersActionComplete}
				allowSelection
				allowFiltering
				allowPaging
				allowResizing
				filterSettings={FilterOptions}
				selectionSettings={settings}
				// toolbar={toolbarOptions}
				rowSelected={rowSelectedUser}
				recordClick={recordClick}
				// editSettings={editOptions}
				enablePersistence
				load={onUserLoad}
				width="95%"
				ref={(g) => {
					usersGridRef = g;
				}}
			>
				<ColumnsDirective>
					<ColumnDirective
						field="_id"
						headerText="Id"
						textAlign="Left"
						width="50"
						isPrimaryKey
						allowEditing={false}
						visible={false}
					/>
					<ColumnDirective
						headerText="Validate"
						textAlign="Center"
						width="80"
						template={gridTemplate}
						allowEditing="false"
					/>
					<ColumnDirective
						field="firstName"
						headerText="First"
						textAlign="Left"
						width="125"
					/>
					<ColumnDirective
						field="lastName"
						headerText="Last"
						textAlign="Left"
						width="125"
					/>
					<ColumnDirective
						field="company"
						headerText="Company"
						editType="dropdownedit"
						textAlign="Left"
						width="100"
					/>
					<ColumnDirective
						field="email"
						headerText="Email Address"
						textAlign="Left"
						width="100"
					/>
					<ColumnDirective
						field="status"
						headerText="Status"
						textAlign="Left"
						width="100"
					/>
					<ColumnDirective
						field="phone"
						headerText="phone"
						textAlign="Left"
						width="100"
						allowEditing={false}
						visible={false}
					/>
					<ColumnDirective
						field="password"
						headerText="Password"
						textAlign="Left"
						width="100"
						allowEditing={false}
						visible={false}
					/>
					<ColumnDirective
						field="isEmailValid"
						headerText="Email Validated?"
						textAlign="Left"
						width="140"
					/>
					<ColumnDirective
						field="isUserValidated"
						headerText="User Validated?"
						textAlign="Left"
						width="100"
					/>
				</ColumnsDirective>
				{/* <Inject services={[Selection, Filter, Page, Toolbar, Resize, Freeze]} /> */}
				<Inject services={[Selection, Filter, Page, Resize, Freeze]} />
			</GridComponent>
			<div className="items-center">
				{showDialog && (
					<UserEditModalX
						isOpen={showDialog}
						onClose={dialogClose}
						onSubmit={dialogSave}
						userData={formData}
					/>
				)}
			</div>
		</div>
	);
};

export default ValidateUsersTab;
