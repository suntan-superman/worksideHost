/* eslint-disable */

import React, { useEffect, useState } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Inject,
	Edit,
	Toolbar,
} from "@syncfusion/ej2-react-grids";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import CustomerSupplierMSAEditTemplate from "../components/CustomerSupplierMSAEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";
import axios from "axios";

import { UseStateContext } from "../contexts/ContextProvider";
import { useToast } from "../contexts/ToastContext";

import "../index.css";

/**
 * CustomerSupplierMSATabX Component
 *
 * This component is responsible for managing and displaying the Customer-Supplier MSA (Master Service Agreement) data.
 * It provides functionalities to add, edit, delete, and view MSA records using a Syncfusion Grid.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered CustomerSupplierMSATabX component.
 *
 * @description
 * - Fetches and displays Customer-Supplier MSA data from the backend.
 * - Allows users with sufficient access levels to perform CRUD operations on the data.
 * - Integrates with Syncfusion Grid for data display and editing.
 * - Includes custom templates for editing MSA records.
 *
 * @dependencies
 * - React
 * - Syncfusion Grid components (GridComponent, ColumnsDirective, ColumnDirective, Inject)
 * - Axios for API requests
 * - Custom components: ConfirmationDialog, CustomerSupplierMSAEditTemplate
 *
 * @state
 * - `messageText` (string): Text for confirmation dialogs.
 * - `currentCustomerId` (string): ID of the currently selected customer.
 * - `insertFlag` (boolean): Indicates whether a new record is being added.
 * - `abortFlag` (boolean): Indicates whether an operation was aborted.
 * - `openUpdateModal` (boolean): Controls the visibility of the confirmation dialog.
 * - `currentRecord` (object): The record currently being edited or deleted.
 * - `customerSupplierMSAData` (array): The dataset of Customer-Supplier MSA records.
 *
 * @context
 * - `setCompanyID` (function): Sets the current company ID.
 * - `setCompanyName` (function): Sets the current company name.
 *
 * @methods
 * - `GetCustomerSupplierMSAData(id)`: Fetches MSA data for a given customer ID.
 * - `GetSupplierId(supplierName)`: Retrieves the supplier ID by name.
 * - `addRecord(record)`: Adds a new MSA record.
 * - `updateRecord(record)`: Updates an existing MSA record.
 * - `deleteRecord(record)`: Deletes an MSA record.
 * - `GetAccessLevel()`: Retrieves the user's access level from local storage.
 * - `handleActionBegin(args)`: Handles actions initiated in the Syncfusion Grid.
 * - `actionComplete(args)`: Handles completion of actions in the Syncfusion Grid.
 * - `doesSupplierExist(dataset, supplierName)`: Checks if a supplier exists in the dataset.
 *
 * @grid
 * - `toolbarOptions`: Configures toolbar actions (Add, Edit, Delete).
 * - `editOptions`: Configures editing options based on user access level.
 * - `customEditTemplate`: Provides a custom template for editing MSA records.
 *
 * @modals
 * - `ConfirmationDialog`: Displays a confirmation dialog for delete actions.
 *
 * @example
 * <CustomerSupplierMSATabX />
 */
const CustomerSupplierMSATabX = () => {
	const toast = useToast();
	const { setCompanyID, setCompanyName } = UseStateContext();
	const [messageText, setMessageText] = useState("");
	const [currentCustomerId, setCurrentCustomerId] = useState("");
	const [insertFlag, setInsertFlag] = useState(false);
	const [abortFlag, setAbortFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);

	const [customerSupplierMSAData, setCustomerSupplierMSAData] = useState([]);

	useEffect(() => {
		// Set the current customer name and id
		// TODO Need to get the current customer id and name from the context
		setCurrentCustomerId("65423d5c240388c1594e7b76");
		setCompanyID("65423d5c240388c1594e7b76");
		setCompanyName("CRC");

		setCustomerSupplierMSAData([]);
		setCompanyID(currentCustomerId);
		GetCustomerSupplierMSAData(currentCustomerId);
	}, [currentCustomerId]);

	const GetCustomerSupplierMSAData = async (id) => {
		if (id) {
			// TODO Fix This
			const fetchString = `${process.env.REACT_APP_API_URL}/api/customersuppliermsa/${id}`;
			// const fetchString = `${process.env.REACT_APP_API_URL}/api/suppliergroup/${id}`;
			
			// Get authentication token
			const token = localStorage.getItem('auth_token');
			const requestOptions = {
				method: "GET",
				headers: { 
					"Content-Type": "application/json",
					...(token && { "Authorization": `Bearer ${token}` })
				},
			};
			try {
				fetch(fetchString, requestOptions).then((response) => {
					if (response.status === 200) {
						response.json().then((data) => {
							if (data) {
								setCustomerSupplierMSAData(data);
							} else {
								console.log("Customer-Supplier MSA Not Found");
							}
						});
					} else if (response.status === 300) {
						console.log("No Data Found");
					} else {
						console.log("Error: ", response.status);
					}
				});
			} catch (error) {
				setIsLoading(false);
				window.alert(`Error: ${error}`);
				console.error(error);
			}
		}
	};

	const GetSupplierId = async (supplierName) => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/firm/getSupplierIdByName/${supplierName}`;
		let supplierId = "";
		try {
			await axios.get(fetchString).then((response) => {
				if (response.status === 200) {
					if (response.data) {
						supplierId = response.data._id;
					} else {
						console.log("Supplier Not Found");
					}
				} else if (response.status === 300) {
					console.log("No Data Found");
				} else {
					console.log("Error: ", response.status);
				}
			});
		} catch (error) {
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		return supplierId;
	};

	// Function to add a record
	const addRecord = async (record) => {
		// Get Supplier ID
		const supplierId = await GetSupplierId(record.suppliername);
		const fetchString = `${process.env.REACT_APP_API_URL}/api/customersuppliermsa/`;
		const requestOptions = {
			method: "POST",
			body: JSON.stringify({
				customername: record.customername,
				customerid: record.customerid,
				suppliername: record.suppliername,
				supplierid: supplierId,
				msastatus: record.msastatus,
				msastatusdate: record.msastatusdate,
				msarenewaldate: record.msarenewaldate,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			fetch(fetchString, requestOptions).then((response) => {
				if (response.ok) {
					toast.success("Record Successfully Added...");
				} else {
					toast.error(`Record Add Failed...${response.status}`);
				}
			});
		} catch (error) {
			toast.error(`Record Add Failed...${error}`);
		}
	};

	// Function to update a record
	const updateRecord = async (record) => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/customersuppliermsa/${record._id}`;
		const requestOptions = {
			method: "PATCH",
			body: JSON.stringify({
				customername: record.customername,
				customerid: record.customerid,
				suppliername: record.suppliername,
				supplierid: record.supplierid,
				msastatus: record.msastatus,
				msastatusdate: record.msastatusdate,
				msarenewaldate: record.msarenewaldate,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			fetch(fetchString, requestOptions).then((response) => {
				if (response.ok) {
					toast.success("Record Successfully Updated...");
				} else {
					toast.error(`Record Update Failed...${response.status}`);
				}
			});
		} catch (error) {
			toast.error(`Error: ${error}`);
		}
	};

	const DeleteRecord = async () => {
		setOpenUpdateModal(false);
		await deleteRecord(currentRecord);
	};

	// Function to delete a record
	const deleteRecord = async (record) => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/customersuppliermsa/${record._id}`;
		const requestOptions = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		};
		try {
			fetch(fetchString, requestOptions).then((response) => {
				if (response.ok) {
					toast.success("Record Successfully Deleted...");
				} else {
					toast.error(`Record Delete Failed...${response.status}`);
				}
			});
		} catch (error) {
			toast.error(`Error: ${error}`);
		}
	};

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	const editOptions = {
		allowEditing: accessLevel > 2,
		allowAdding: accessLevel > 2,
		allowDeleting: accessLevel > 2,
		mode: "Dialog",
		template: (props) => <CustomerSupplierMSAEditTemplate {...props} />,
	};
	const toolbarOptions = ["Add", "Edit", "Delete"];

	// Syncfusion Grid settings
	// const toolbarOptions = ["Add", "Edit", "Delete", "Update", "Cancel"];
	// const editSettings = {
	// 	allowEditing: true,
	// 	allowAdding: true,
	// 	allowDeleting: true,
	// 	mode: "Dialog",
	// };
	const msastatusValues = ["ACTIVE", "INACTIVE"];
	const statusValues = ["ACTIVE", "INACTIVE"];

	// Custom edit template
	const customEditTemplate = (args) => {
		return (
			<div>
				<div className="form-group">
					<label>MSA Status:</label>
					<DropDownListComponent
						dataSource={msastatusValues}
						value={args.msastatus}
						placeholder="Select MSA Status"
						floatLabelType="Always"
						change={(e) => (args.msastatus = e.value)}
					/>
				</div>
				<div className="form-group">
					<label>MSA Status Date:</label>
					<DatePickerComponent
						value={new Date(args.msastatusdate)}
						placeholder="Select Date"
						floatLabelType="Always"
						change={(e) => (args.msastatusdate = e.value)}
					/>
				</div>
				<div className="form-group">
					<label>MSA Renewal Date:</label>
					<DatePickerComponent
						value={new Date(args.msarenewaldate)}
						placeholder="Select Renewal Date"
						floatLabelType="Always"
						change={(e) => (args.msarenewaldate = e.value)}
					/>
				</div>
				<div className="form-group">
					<label>Status:</label>
					<DropDownListComponent
						dataSource={statusValues}
						value={args.status}
						placeholder="Select Status"
						floatLabelType="Always"
						change={(e) => (args.status = e.value)}
					/>
				</div>
			</div>
		);
	};

	// Action begin callback
	const handleActionBegin = async (args) => {
		if (args.requestType === "save") {
			const data = args.data;
			if (
				data.isAdd &&
				doesSupplierExist(customerSupplierMSAData, data.suppliername)
			) {
				alert(`Supplier ${data.suppliername} already exists`);
				args.cancel = true;
				return;
			}
			if (args.action === "add" && args.cancel !== true) {
				await addRecord(args.data);
			} else if (args.action === "edit") {
				await updateRecord(args.data);
			}
		} else if (args.requestType === "delete") {
			setCurrentRecord(args.data[0]);
			setMessageText(`Delete Supplier ${args.data.suppliername}MSA Data?`);
			setOpenUpdateModal(true);
			// await deleteRecord(args.data[0]);
		}
	};

	const actionComplete = async (args) => {
		setAbortFlag(false);
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			// dialog.height = 600;
			// dialog.width = 600;
			// Set Insert Flag
			setInsertFlag(args.requestType === "add");
			if (args.requestType !== "beginEdit")
				args.data.customerid = currentCustomerId;
			// change the header of the dialog
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit MSA Record of ${args.rowData.customername}/${args.rowData.suppliername}`
					: "Workside New MSA Record";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
		}
		if (args.requestType === "delete") {
			// Save or Update Data
			const data = args.data;
		}
	};

	const doesSupplierExist = (dataset, supplierName) => {
		return dataset.some((item) => item.suppliername === supplierName);
	};

	return (
		<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
			<GridComponent
				dataSource={customerSupplierMSAData}
				toolbar={toolbarOptions}
				editSettings={editOptions}
				actionBegin={handleActionBegin}
				actionComplete={actionComplete}
				// editTemplate={customEditTemplate}
			>
				<ColumnsDirective>
					<ColumnDirective
						field="customername"
						headerText="Customer Name"
						width="150"
					/>
					<ColumnDirective
						field="suppliername"
						headerText="Supplier Name"
						width="150"
					/>
					<ColumnDirective
						field="msastatus"
						headerText="MSA Status"
						width="150"
					/>
					<ColumnDirective
						field="msastatusdate"
						headerText="MSA Status Date"
						width="150"
						type="date"
						format="MM/dd/yyy"
					/>
					<ColumnDirective
						field="msarenewaldate"
						headerText="MSA Renewal Date"
						width="150"
						type="date"
						format="MM/dd/yyy"
					/>
					<ColumnDirective field="status" headerText="Status" width="150" />
				</ColumnsDirective>
				<Inject services={[Edit, Toolbar]} />
			</GridComponent>
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => DeleteRecord()}
					onCancel={() => {
						setAbortFlag(true);
						setOpenUpdateModal(false);
					}}
				/>
			)}
		</div>
	);
};

export default CustomerSupplierMSATabX;
