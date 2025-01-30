/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
	showWarningDialog,
	showSuccessDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
///////////////////////////////////////////////////////////////////

let gridPageSize = 10;
let updatedContactData = null;

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
	const [newUser, setNewUser] = useState(false);
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

	const recordClick = (args) => {
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
			GetContactInfoByEmail(args.rowData.email).then(() => {
				if (newUser === true) {
					setFormData({
						firstname: args.rowData?.firstName,
						lastname: args.rowData?.lastName,
						company: args.rowData?.company,
						// Need to get classification from FIRM
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
			});
		}
	};

	const dialogClose = () => {
		setShowDialog(false);
	};

	const SaveUserValidation = async () => {
		if (selectedRecordData === null) {
			return;
		}
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/${selectedRecordData.email}`;
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
	};

	const GetContactInfoByEmail = async (email) => {
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact/email/${email}`;
		setContactData(null);
		setContactID(null);
		setNewUser(false);

		try {
			const response = await fetch(fetchString);
			const jsonData = await response.json().then((data) => {
				if (data.length === 0) {
					setNewUser(true);
					setContactData(null);
					setContactID(null);
					return;
				}
				setContactData(data[0]);
				setContactID(data[0]?._id);
				setNewUser(false);
			});
		} catch (error) {
			showErrorDialog(`Error: ${error}`);
		}
		return;
	};

	const UpdateContactData = async () => {
		const id = contactID;
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact/${id}`;
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
	};

	const AddContactData = async () => {
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact`;
		const { firmType } = await GetFirmType(formData.company);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contactclass: firmType,
				firm: formData.company,
				accesslevel: formData.accesslevel,
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
	};

	const SendEmailValidation = async (email) => {
		console.log(`SendEmailValidation: ${email}`);

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
		console.log(`SendEmailValidation: ${status}`);
		return status;
	};

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
				// Update User Record with updated nickname, company, cell number, access level, status
				if (newUser === true) {
					AddContactData();
				} else {
					UpdateContactData();
				}
				const status = SendEmailValidation(selectedRecordData.email);
				showSuccessDialogWithTimer("User Validated...Check Email");
			}
		});
		setModifyFlag(false);
	}, [modifyFlag === true && selectedRecordData !== null]);

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
		return <div>Loading...</div>;
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
