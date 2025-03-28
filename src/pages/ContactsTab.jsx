/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Selection,
	Edit,
	ExcelExport,
	Filter,
	Inject,
	Page,
	Toolbar,
	Resize,
	Freeze,
} from "@syncfusion/ej2-react-grids";
import ContactEditTemplate from "../components/ContactEditTemplate";

import {
	showWarningDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

/**
 * ContactsTab Component
 *
 * This component renders a grid-based interface for managing contact information.
 * It provides functionalities such as adding, editing, exporting, and filtering contacts.
 *
 * Features:
 * - Fetches contact data from a backend API and displays it in a grid.
 * - Allows editing and adding new contacts through a dialog interface.
 * - Supports Excel export with custom headers.
 * - Applies conditional styling to grid cells based on contact class.
 * - Handles user access levels to restrict certain actions.
 * - Includes confirmation dialogs for saving or updating contact data.
 *
 * Hooks:
 * - `useRef`: Used to reference the grid component for programmatic interactions.
 * - `useState`: Manages state for contact list, modals, messages, and current record.
 * - `useEffect`: Fetches contact data on component mount and initializes grid settings.
 *
 * Props: None
 *
 * State Variables:
 * - `contactList`: Stores the list of contacts fetched from the API.
 * - `insertFlag`: Indicates whether the current operation is an insert.
 * - `openUpdateModal`: Controls the visibility of the update confirmation dialog.
 * - `messageText`: Stores the message text for the confirmation dialog.
 * - `currentRecord`: Holds the data of the currently edited or added record.
 * - `selectedRecord`: Stores the ID of the currently selected contact.
 *
 * Functions:
 * - `GetAccessLevel`: Retrieves the user's access level from localStorage.
 * - `toolbarClick`: Handles toolbar actions such as Excel export.
 * - `excelQueryCellInfo` & `queryCellInfo`: Apply conditional styling to grid cells.
 * - `actionComplete`: Handles actions like editing, adding, and saving data.
 * - `rowSelectedContact`: Updates the selected record based on grid selection.
 * - `SaveContactsData`: Sends POST or PUT requests to save or update contact data.
 * - `onContactLoad`: Configures grid settings on load.
 *
 * Dependencies:
 * - Syncfusion GridComponent and related services (Selection, Edit, Filter, etc.).
 * - Environment variable `REACT_APP_MONGO_URI` for API endpoint.
 *
 * @component
 */
const ContactsTab = () => {
	let contactsGridRef = useRef(null);

	const [contactList, setContactList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

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
		mode: "Dialog",
		template: (props) => <ContactEditTemplate {...props} />,
	};

	const toolbarOptions = ["Add", "Edit", "ExcelExport"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };

	useEffect(() => {
		const fetchContacts = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/contact`,
			);
			const json = await response.json();
			setContactList(json);
		};
		fetchContacts();
	}, []);

	const toolbarClick = (args) => {
		console.log(`Toolbar Click: ${args.item.id}`);
		if (contactsGridRef && args.item.id === "contactGridElement_excelexport") {
			if (accessLevel <= 2) {
				showWarningDialog("You do not have permission to export data.");
				return;
			}
			const excelExportProperties = {
				fileName: "worksideContacts.xlsx",
				header: {
					headerRows: 3,
					rows: [
						{
							cells: [
								{
									colSpan: 4,
									value: "Workside Software Contacts",
									style: {
										fontColor: "#DC2626",
										fontSize: 20,
										hAlign: "Center",
										bold: true,
									},
								},
							],
						},
						{
							cells: [
								{
									colSpan: 4,
									value: "Copyright 2025",
									style: {
										fontColor: "#0C0A09",
										fontSize: 15,
										hAlign: "Center",
										bold: true,
									},
								},
							],
						},
					],
				},
				// footer: {
				// 	footerRows: 4,
				// 	rows: [
				// 		{
				// 			cells: [
				// 				{
				// 					colSpan: 4,
				// 					value: "Thank you for your business!",
				// 					style: { hAlign: "Center", bold: true },
				// 				},
				// 			],
				// 		},
				// 		{
				// 			cells: [
				// 				{
				// 					colSpan: 4,
				// 					value: "!Visit Again!",
				// 					style: { hAlign: "Center", bold: true },
				// 				},
				// 			],
				// 		},
				// 	],
				// },
			};
			console.log("Excel Export");
			contactsGridRef.excelExport(excelExportProperties);
		}
	};

	const excelQueryCellInfo = (args) => {
		if (args.column.field === "contactclass") {
			const contactClass = args.data[args.column.field];
			console.log(`Contact Class: ${contactClass}`);
			if (contactClass === "SUPPLIER") {
				args.style = { backColor: "#FCA5A5" };
			} else if (contactClass === "DELIVERYASSOC") {
				args.style = { backColor: "#ffffb3" };
			} else if (contactClass === "RIGCOMPANY") {
				args.style = { backColor: "#7DD3FC" };
			} else {
				args.style = { backColor: "#86EFAC" };
			}
		}
	};

	const queryCellInfo = (args) => {
		if (args.column.field === "contactclass") {
			const contactClass = args.data[args.column.field];
			if (contactClass === "SUPPLIER") {
				args.style = { backColor: "#FCA5A5" };
			} else if (contactClass === "DELIVERYASSOC") {
				args.style = { backColor: "#ffffb3" };
			} else if (contactClass === "RIGCOMPANY") {
				args.style = { backColor: "#7DD3FC" };
			} else {
				args.style = { backColor: "#86EFAC" };
			}
		}
	};

	const actionComplete = async (args) => {
		// console.log(`Action Complete: ${args.requestType}`);
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			dialog.height = 600;
			dialog.width = 600;
			// Set Insert Flag
			setInsertFlag(args.requestType === "add");
			// change the header of the dialog
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit User: ${args.rowData.firstname} ${args.rowData.lastname}`
					: "Workside New Contact";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			setMessageText(
				`Update Firm ${args.data.firstname} ${args.rowData.lastname} Details?`,
			);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
	};

	const rowSelectedContact = () => {
		if (contactsGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = contactsGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(contactList[selectedrowindex]._id);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const SaveContactsData = async () => {
		if (insertFlag === true) {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/contact/${currentRecord._id}`,
				{
					method: "POST",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok) {
				await showSuccessDialogWithTimer("Record Successfully Added...");
				setOpenUpdateModal(false);
			}
		} else {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/contact/${currentRecord._id}`,
				{
					method: "PUT",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok) {
				await showSuccessDialogWithTimer("Record Successfully Updated...");
				setOpenUpdateModal(false);
			}
		}
	};

	const onContactLoad = () => {
		const gridElement = document.getElementById("contactGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 2;
			gridInstance.pageSettings.freeze = true;
		}
	};

	return (
		<div>
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="contactGridElement"
					dataSource={contactList}
					actionComplete={actionComplete}
					allowSelection
					allowFiltering
					allowPaging
					allowResizing
					allowExcelExport
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					toolbarClick={toolbarClick}
					rowSelected={rowSelectedContact}
					editSettings={editOptions}
					enablePersistence
					excelQueryCellInfo={excelQueryCellInfo}
					queryCellInfo={queryCellInfo}
					load={onContactLoad}
					width="95%"
					ref={(g) => {
						contactsGridRef = g;
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
							field="contact_id"
							headerText="ID"
							textAlign="Left"
							width="25"
							allowEditing={false}
							visible={false}
						/>
						<ColumnDirective
							field="firstname"
							headerText="First"
							textAlign="Left"
							width="125"
						/>
						<ColumnDirective
							field="lastname"
							headerText="Last"
							textAlign="Left"
							width="125"
						/>
						<ColumnDirective
							field="nickname"
							headerText="Nickname"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="contactclass"
							headerText="Class"
							// editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="firm"
							headerText="Firm"
							// editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="accesslevel"
							headerText="Access"
							// editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="username"
							headerText="User Name"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="userpassword"
							headerText="Password"
							textAlign="Left"
							width="100"
							visible={false}
						/>
						<ColumnDirective
							field="primaryphone"
							headerText="Phone 1"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="secondaryphone"
							headerText="Phone 2"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="primaryemail"
							headerText="Email 1"
							textAlign="Left"
							width="150"
						/>
						<ColumnDirective
							field="secondaryemail"
							headerText="Email 2"
							textAlign="Left"
							width="150"
						/>
						<ColumnDirective
							field="status"
							headerText="Status"
							// editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="statusdate"
							headerText="Date"
							type="date"
							editType="datepickeredit"
							format="MM/dd/yyy"
							textAlign="Right"
							width="140"
						/>
						<ColumnDirective
							field="comment"
							headerText="Comment"
							textAlign="Left"
							width="200"
						/>
					</ColumnsDirective>
					<Inject
						services={[
							Selection,
							Edit,
							Filter,
							Page,
							Toolbar,
							Resize,
							Freeze,
							ExcelExport,
						]}
					/>
				</GridComponent>
			</div>
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => SaveContactsData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}
		</div>
	);
};

export default ContactsTab;
