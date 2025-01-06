/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Selection,
	Edit,
	Filter,
	Inject,
	Page,
	Toolbar,
	Resize,
	Freeze,
} from "@syncfusion/ej2-react-grids";
import MuiPhoneNumber from "material-ui-phone-number";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Stack,
	IconButton,
	TextField,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Select from "react-select";
import { toast } from "react-toastify";
import { UseStateContext } from "../contexts/ContextProvider";
import _ from "lodash";

import "../index.css";
import "../App.css";
import "../styles/syncfusionStyles.css";

//////////////////////////////////////////////////////////////////
const customStyles = {
	control: (provided) => ({
		...provided,
		backgroundColor: "white",
		// padding: "5px 10px",
		border: "1px solid gray",
		// boxShadow: "0 2px 4px rgba(0,0,0,.2)",
	}),
	option: (provided, state) => ({
		...provided,
		// borderBottom: "1px dotted pink",
		color: state.isSelected ? "white" : "black",
		backgroundColor: state.isSelected ? "gray" : "white",
	}),
};
///////////////////////////////////////////////////////////////////

let gridPageSize = 10;

const ValidateUsersTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showDialog, setShowDialog] = useState(false);

	let usersGridRef = useRef(null);
	const [userList, setUserList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	const editOptions = {
		// allowEditing: accessLevel > 2,
		allowUpdating: accessLevel > 2,
		allowAdding: accessLevel > 2,
		allowDeleting: accessLevel > 2,
		mode: "Dialog",
	};

	const toolbarOptions = ["Add", "Update", "Delete"];
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [selectedRecordData, setSelectedRecordData] = useState(null);
	const settings = { mode: "Row" };
	const position = { X: "center", Y: "center" };
	const { currentColor } = UseStateContext();
	const [contactData, setContactData] = useState(null);
	const [contactID, setContactID] = useState(null);

	const [formData, setFormData] = useState({
		firstname: "Mike",
		lastname: "Hunt",
		nickname: "",
		company: "",
		classification: "",
		accesslevel: "",
		email: "mhunt@gmail.com",
		cellnumber: "",
		status: "",
		comment: "",
	});

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/user`,
			);
			const json = await response.json();
			setUserList(json);
			setIsLoading(false);
		};
		fetchUsers();
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
						// console.log('Insert: ' + JSON.stringify(args.data));
						// dispatch({ type: 'CREATE_PRODUCT', payload: json });
					}
				} else {
					// dispatch({ type: 'CREATE_PRODUCT', payload: args.data });
					// console.log('Update: ' + JSON.stringify(args.data));
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
			setSelectedRecord(userList[selectedrowindex]._id);
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
			cellnumber: "",
			status: "",
			comment: "",
		});
	};

	const recordClick = (args) => {
		if (args.target.classList.contains("userData")) {
			if (args.rowData.isEmailValid === false) {
				toast.error("Email is not Validated...");
				return;
			}
			if (
				args.rowData.isEmailValid === true &&
				args.rowData.isUserValidated === true
			) {
				toast.error("User Already Validated...", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
				return;
			}
			resetFormData();

			// Get Contact Info by Email
			GetContactInfoByEmail(args.rowData.email).then(() => {
				if (contactData === null) {
					setFormData({
						firstname: args.rowData.firstName,
						lastname: args.rowData.lastName,
						company: args.rowData.company,
						classification: "SUPPLIER",
						accesslevel: "STANDARD",
						email: args.rowData.email,
						status: "ACTIVE",
					});
				} else {
					const newContactData = {
						firstname: args.rowData.firstName,
						lastname: args.rowData.lastName,
						nickname: contactData.nickname,
						company: args.rowData.company,
						classification: contactData.contactclass,
						accesslevel: contactData.accesslevel,
						email: args.rowData.email,
						status: contactData.status,
						comment: contactData.comment,
					};
					setFormData(newContactData);
				}
				setSelectedRecordData(args.rowData);
				setSelectedRecord(args.rowData._id);
				setShowDialog(true);
			});
		}
	};

	const dialogClose = () => {
		setShowDialog(false);
	};

	const SaveUserValidation = async () => {
		setIsLoading(true);
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/${selectedRecordData.email}`;
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: selectedRecordData.email,
				firstName: selectedRecordData.firstName,
				lastName: selectedRecordData.lastName,
				company: formData.company, // selectedRecordData.company, This should be the exact same as the company name in the database
				isUserValidated: true,
			}),
		};
		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
	};

	const GetContactInfoByEmail = async (email) => {
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact/email/${email}`;
		setContactData(null);
		setContactID(null);
		try {
			const response = await fetch(fetchString);
			const jsonData = await response.json().then((data) => {
				setContactData(data[0]);
				setContactID(data[0]._id);
			});
		} catch (error) {
			window.alert(`Error: ${error}`);
		}
		return;
	};

	const UpdateContactData = async () => {
		setIsLoading(true);

		if (contactData === null) {
			window.alert("Contact Data is Null");
			return;
		}
		const id = contactID;
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact/${id}`;
		const requestOptions = {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contactclass: formData.classification,
				firm: formData.company,
				accesslevel: formData.accesslevel,
				username: selectedRecordData.email,
				firstname: formData.firstname,
				lastname: formData.lastname,
				nickname: formData.nickname,
				primaryphone: formData.cellnumber,
				secondaryphone: formData.cellnumber,
				primaryemail: selectedRecordData.email,
				secondaryemail: formData.email,
				status: formData.status,
				statusdate: new Date(),
			}),
		};
		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
			setIsLoading(false);
			setContactData(jsonData);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
	};

	const AddContactData = async () => {
		setIsLoading(true);

		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/contact`;
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				contactclass: formData.classification,
				firm: formData.company,
				accesslevel: formData.accesslevel,
				username: selectedRecordData.email,
				firstname: formData.firstname,
				lastname: formData.lastname,
				nickname: formData.nickname,
				primaryphone: formData.cellnumber,
				secondaryphone: formData.cellnumber,
				primaryemail: selectedRecordData.email,
				secondaryemail: formData.email,
				status: formData.status,
				statusdate: new Date(),
			}),
		};
		try {
			const response = await fetch(fetchString, requestOptions);
			const jsonData = await response.json();
			setIsLoading(false);
			setContactData(jsonData);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
	};

	const dialogSave = () => {
		// Update User Record with updated company and isUserValidated = true
		SaveUserValidation();
		// Update User Record with updated nickname, company, cell number, access level, status
		if (contactData === null) {
			AddContactData();
		} else {
			UpdateContactData();
		}
		setShowDialog(false);
	};

	const dialogOpen = () => {
		setShowDialog(true);
	};

	const dialogButtonFormat =
		"bg-green-200 text-black p-1 rounded-lg w-24 items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 text-xs";

	return (
		<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
			<GridComponent
				id="userGridElement"
				dataSource={userList}
				actionComplete={usersActionComplete}
				allowSelection
				allowFiltering
				allowPaging
				allowResizing
				filterSettings={FilterOptions}
				selectionSettings={settings}
				toolbar={toolbarOptions}
				rowSelected={rowSelectedUser}
				recordClick={recordClick}
				editSettings={editOptions}
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
						headerText="email"
						textAlign="Left"
						width="100"
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
				<Inject services={[Selection, Filter, Page, Toolbar, Resize, Freeze]} />
			</GridComponent>
			<div className="items-center">
				{showDialog && (
					<MaterialValidationModal
						recordID={selectedRecord}
						open={showDialog}
						onOK={dialogSave}
						onClose={dialogClose}
						data={formData}
						onUpdateData={setFormData}
					/>
				)}
			</div>
		</div>
	);
};

const MaterialValidationModal = ({
	recordID,
	open,
	onOK,
	onClose,
	data,
	onUpdateData,
}) => {
	if (!open || !recordID) return null;

	const [showRecord, setShowRecord] = useState(false);
	const [statusMenuIsOpen, setStatusMenuIsOpen] = useState(false);
	const [companyMenuIsOpen, setCompanyMenuIsOpen] = useState(false);
	const [classificationMenuIsOpen, setClassificationMenuIsOpen] =
		useState(false);
	const [accessMenuIsOpen, setAccessMenuIsOpen] = useState(false);
	const [companyOptions, setCompanyOptions] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");

	const [selectedCompanyOption, setSelectedCompanyOption] = useState(null);
	const [selectedClassificationOption, setSelectedClassificationOption] =
		useState(null);
	const [selectedAccessOption, setSelectedAccessOption] = useState(null);
	const [selectedStatusOption, setSelectedStatusOption] = useState(null);
	const [companyIndex, setCompanyIndex] = useState(0);
	const [classificationIndex, setClassificationIndex] = useState(0);
	const [accessIndex, setAccessIndex] = useState(0);
	const [statusIndex, setStatusIndex] = useState(0);

	const accessLevelOptions = [
		{ value: "ADMIN", label: "ADMIN" },
		{ value: "GUEST", label: "GUEST" },
		{ value: "STANDARD", label: "STANDARD" },
	];

	const classificationOptions = [
		{ value: "CUSTOMER", label: "CUSTOMER" },
		{ value: "SUPPLIER", label: "SUPPLIER" },
		{ value: "DELIVERYASSOC", label: "DELIVERYASSOC" },
	];

	const statusOptions = [
		{ value: "ACTIVE", label: "ACTIVE" },
		{ value: "IN-ACTIVE", label: "IN-ACTIVE" },
	];

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#userValidationDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	useEffect(() => {
		setSelectedCompanyOption(data.company);
		setSelectedClassificationOption(data.classification);
		setSelectedAccessOption(data.accesslevel);
		setSelectedStatusOption(data.status);
	}, [data]);

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
				setCompanyOptions(options);

				let index = _.findIndex(options, { label: data.company });
				setCompanyIndex(index);

				index = _.findIndex(classificationOptions, { label: data.class });
				if (index === -1) setClassificationIndex(0);
				else setClassificationIndex(index);

				index = _.findIndex(accessLevelOptions, { label: data.accesslevel });
				if (index === -1) setAccessIndex(0);
				else setAccessIndex(index);

				index = _.findIndex(statusOptions, { label: data.status });
				if (index === -1) setStatusIndex(0);
				else setStatusIndex(index);
			}
		};
		fetchCompanyNames();
	}, []);

	const handleStatusMenuOpen = () => {
		setStatusMenuIsOpen(true);
	};

	const handleStatusMenuClose = () => {
		setStatusMenuIsOpen(false);
	};

	const handleCompanyMenuOpen = () => {
		setCompanyMenuIsOpen(true);
	};

	const handleCompanyMenuClose = () => {
		setCompanyMenuIsOpen(false);
	};

	const handleClassificationMenuOpen = () => {
		setClassificationMenuIsOpen(true);
	};

	const handleClassificationMenuClose = () => {
		setClassificationMenuIsOpen(false);
	};

	const handleAccessMenuOpen = () => {
		setAccessMenuIsOpen(true);
	};

	const handleAccessMenuClose = () => {
		setAccessMenuIsOpen(false);
	};

	const handleChange = ({ currentTarget: input }) => {
		onUpdateData({ ...data, [input.name]: input.value });
	};

	const showID = () => {
		setShowRecord(!showRecord);
	};

	const inputFormat =
		"bg-gray-200 w-[100%] pt-1 pb-1 flex items-center mb-1 rounded-8xs shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border border-[1px] border-solid border-black border-r-2 border-b-2 px-1";

	const handleDataChange = ({ currentTarget: input }) => {
		const updatedData = { ...data, [input.name]: input.value };
		onUpdateData(updatedData);
	};

	const handleCellChange = (value) => {
		const updatedData = { ...data, cellnumber: value };
		onUpdateData(updatedData);
	};

	const trimData = (data) => {
		const updatedData = { ...data };
		for (const key of Object.keys(updatedData)) {
			if (typeof updatedData[key] === "string") {
				updatedData[key] = updatedData[key].trim();
			}
		}
		return updatedData;
	};

	const ValidateData = () => {
		setErrorMsg("");

		const updatedData = trimData(data);
		onUpdateData(updatedData);

		if (data.firstname.length < 2 || data.firstname.length > 20) {
			toast.error("First Name must be between 2 and 20 characters...");
			return false;
		}
		if (data.lastname.length < 2 || data.lastname.length > 20) {
			toast.error("Last Name must be between 2 and 20 characters");
			return false;
		}
		if (data.company.length < 2 || data.company.length > 30) {
			toast.error("Company must be between 2 and 30 characters");
			return false;
		}
		if (data.accesslevel.length < 2 || data.accesslevel.length > 30) {
			toast.error("Access Level must be selected");
			return false;
		}
		if (data.email.length < 6 || data.email.length > 50) {
			toast.error("Email must be between 6 and 50 characters");
			return false;
		}
		if (data.cellnumber !== null || data.cellnumber !== "") {
			if (data.cellnumber.length < 10 || data.cellnumber.length > 17) {
				toast.error(
					`Invalid Cell number.. ${data.cellnumber} Length: ${data.cellnumber.length}`,
				);
				return false;
			}
		} else {
			toast.error("Cell Number must be entered");
			return false;
		}
		if (data.status.length < 3 || data.status.length > 20) {
			toast.error("Status must be selected");
			return false;
		}
		if (data.nickname.length < 1 || data.nickname.length > 20) {
			data.nickname = data.firstname;
		}
		return true;
	};

	const onSaveData = () => {
		if (ValidateData() === true) {
			setErrorMsg("");
			// TODO Save or Update Contact Collection
			// TODO Update User to Validated
			onOK();
		}
	};

	const handleCompanySelectionChange = (selected) => {
		setSelectedCompanyOption(selected.value);
		const updatedData = { ...data, company: selected.value };
		const index = _.findIndex(options, { label: selected.value });
		setCompanyIndex(index);

		onUpdateData(updatedData);
	};

	const handleClassificationSelectionChange = (selected) => {
		setSelectedClassificationOption(selected.value);
		const updatedData = { ...data, classification: selected.value };

		const index = _.findIndex(classificationOptions, { label: selected.value });
		setClassificationIndex(index);
		onUpdateData(updatedData);
	};

	const handleAccessSelectionChange = (selected) => {
		setSelectedAccessOption(selected.value);
		const updatedData = { ...data, accesslevel: selected.value };

		const index = _.findIndex(accessLevelOptions, { label: selected.value });
		setAccessIndex(index);
		onUpdateData(updatedData);
	};

	const handleStatusSelectionChange = (selected) => {
		setSelectedStatusOption(selected.value);
		const updatedData = { ...data, status: selected.value };

		const index = _.findIndex(statusOptions, { label: selected.value });
		setStatusIndex(index);
		onUpdateData(updatedData);
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="userValidationDialog"
			PaperComponent={PaperComponent}
		>
			<DialogTitle id="userValidationDialog">
				<span className="text-bold text-green-300">WORK</span>SIDE User
				Validation
			</DialogTitle>
			<DialogContent>
				<Stack spacing={2} margin={3}>
					<TextField
						size="small"
						variant="outlined"
						label="First Name"
						name="firstname"
						value={data.firstname}
						onChange={handleDataChange}
					/>
					<TextField
						size="small"
						variant="outlined"
						label="Last Name"
						name="lastname"
						value={data.lastname}
						onChange={handleDataChange}
					/>
					<TextField
						size="small"
						variant="outlined"
						label="Nickname"
						name="nickname"
						value={data.nickname}
						onChange={handleDataChange}
					/>
					<div style={{ width: "300px" }}>
						<p className="text-sm font-bold">Company</p>
						<Select
							className="basic-single"
							classNamePrefix="select"
							value={companyOptions[companyIndex]}
							onChange={handleCompanySelectionChange}
							onMenuOpen={handleCompanyMenuOpen}
							onMenuClose={handleCompanyMenuClose}
							name="company"
							options={companyOptions}
							styles={customStyles}
						/>
					</div>
					<div style={{ width: "300px" }}>
						<p className="text-sm font-bold">Classification</p>
						<Select
							className="basic-single"
							classNamePrefix="select"
							value={classificationOptions[classificationIndex]}
							isDisabled={false}
							onChange={handleClassificationSelectionChange}
							onMenuOpen={handleClassificationMenuOpen}
							onMenuClose={handleClassificationMenuClose}
							name="classification"
							options={classificationOptions}
							styles={customStyles}
						/>
					</div>
					{classificationMenuIsOpen === true && (
						<div>
							<p className="mb-36"> </p>
						</div>
					)}
					{companyMenuIsOpen === false && (
						<>
							<div style={{ width: "300px" }}>
								<p className="text-sm font-bold">Access Level</p>
								<Select
									className="basic-single"
									classNamePrefix="select"
									defaultValue={selectedAccessOption}
									value={accessLevelOptions[accessIndex]}
									isDisabled={false}
									onChange={handleAccessSelectionChange}
									onMenuOpen={handleAccessMenuOpen}
									onMenuClose={handleAccessMenuClose}
									name="accesslevel"
									options={accessLevelOptions}
									styles={customStyles}
								/>
							</div>
						</>
					)}{" "}
					{companyMenuIsOpen === true && (
						<div>
							<p className="mb-36"> </p>
						</div>
					)}
					{accessMenuIsOpen === false && (
						<>
							{companyMenuIsOpen === false && (
								<TextField
									size="small"
									variant="outlined"
									type="email"
									label="Email"
									name="email"
									value={data.email}
									onChange={handleDataChange}
								/>
							)}
							<p className="text-sm font-bold">Cell Number</p>
							<MuiPhoneNumber
								defaultCountry={"us"}
								value={data.cellnumber}
								onChange={handleCellChange}
							/>
							<div style={{ width: "300px" }}>
								<p className="text-sm font-bold">Status</p>
								<Select
									className="basic-single"
									classNamePrefix="select"
									defaultValue={selectedStatusOption}
									value={statusOptions[statusIndex]}
									isDisabled={false}
									onChange={handleStatusSelectionChange}
									onMenuOpen={handleStatusMenuOpen}
									onMenuClose={handleStatusMenuClose}
									name="status"
									options={statusOptions}
									styles={customStyles}
								/>
							</div>
						</>
					)}{" "}
					{accessMenuIsOpen === true && (
						<div>
							<p className="mb-40"> </p>
						</div>
					)}
					{statusMenuIsOpen === false && (
						<>
							<TextField
								size="small"
								variant="outlined"
								label="Comment"
								name="comment"
								value={data.comment}
								onChange={handleDataChange}
							/>
						</>
					)}
					{statusMenuIsOpen === true && (
						<div>
							<p className="mb-12"> </p>
						</div>
					)}
					{errorMsg.length > 0 && (
						<div className="text-center">
							<p className="text-red-700 text-xs font-bold pt-2 pb-2">
								{errorMsg}
							</p>
						</div>
					)}
				</Stack>
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

export default ValidateUsersTab;
