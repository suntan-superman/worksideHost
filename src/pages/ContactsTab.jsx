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
import { toast } from "react-toastify";
import ContactEditTemplate from "../components/ContactEditTemplate";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

// TODO Delete
// TODO Update
// TODO Create

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
				toast.error("You do not have permission to export data.");
				return;
			}
			console.log("Excel Export");
			contactsGridRef.excelExport();
		}
	};

	const handleContactDelete = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/contact/${selectedRecord}`,
			{
				method: "DELETE",
			},
		);
		const json = await response.json();

		if (response.ok) {
			toast.success("Record Successfully Deleted...");
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
					? `Edit Record of ${args.rowData.firstname} ${args.rowData.lastname}`
					: "New Contact";
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

	const contactsActionComplete = async (args) => {
		if (!contactsGridRef) return;
		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Contacts";
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
				const data = args.data;
				// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
				setMessageText(
					`Update User ${args.data.firstname} ${args.data.lastname} Details?`,
				);
				setCurrentRecord(data);
				setOpenUpdateModal(true);
			}
			if (args.requestType === "delete") {
				// Delete Data
				handleContactDelete();
				setInsertFlag(false);
			}
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
				toast.success("Record Successfully Added...");
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
				toast.success("Record Successfully Updated...");
				setOpenUpdateModal(false);
			}
		}
	};

	const onFirmLoad = () => {
		const gridElement = document.getElementById("firmGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 3;
			gridInstance.pageSettings.freeze = true;
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

	// const rowDataBound = (args) => {
	// 	if (args.data.OrderID === 10249) {
	// 		args.rowHeight = 90;
	// 	}
	// };
	// <GridComponent dataSource={gridData} height={315} rowDataBound={rowDataBound}>

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
							editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="firm"
							headerText="Firm"
							editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="accesslevel"
							headerText="Access"
							editType="dropdownedit"
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
							editType="dropdownedit"
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
