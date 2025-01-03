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
import { toast } from "react-toastify";
import { MaskedTextBox } from "@syncfusion/ej2-inputs";
import ContactEditTemplate from "../components/ContactEditTemplate";
import useUserStore from "../stores/UserStore";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

// TODO Delete
// TODO Update
// TODO Create

const ContactsTab = () => {
	const accessLevel = useUserStore((state) => state.accessLevel);

	let contactsGridRef = useRef(null);

	const [contactList, setContactList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);

	const editOptions = {
		allowEditing: accessLevel > 2,
		allowAdding: accessLevel > 2,
		mode: "Dialog",
		template: (props) => <ContactEditTemplate {...props} />,
	};

	const toolbarOptions = ["Add", "Edit"];

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

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

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
			// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
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
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
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

	// *******************************************************
	// This is for custom phone and email editing in dialog
	// *******************************************************
	// let phElem;
	// let phObject;
	// const createcusphonemaskinputn = () => {
	// 	phElem = document.createElement("input");
	// 	return phElem;
	// };
	// const destroycusphonemaskinputFn = () => {
	// 	phObject.destroy();
	// };
	// const readcusphonemaskinputFn = () => phObject.value;
	// const writecusphonemaskinputFn = (args) => {
	// 	phObject = new MaskedTextBox({
	// 		// value: args.rowData[args.column.field].toString(),
	// 		value: args.rowData[args.column.field],
	// 		mask: "000-000-0000",
	// 		placeholder: "Phone",
	// 		floatLabelType: "Always",
	// 	});
	// 	phObject.appendTo(phElem);
	// };

	// const custphonemaskinput = {
	// 	create: createcusphonemaskinputn,
	// 	destroy: destroycusphonemaskinputFn,
	// 	read: readcusphonemaskinputFn,
	// 	write: writecusphonemaskinputFn,
	// };

	// const mailidRules = { email: [true, 'Enter valid Email'] };
	// *******************************************************
	// End of custom code
	// *******************************************************
	const onFirmLoad = () => {
		const gridElement = document.getElementById("firmGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			/** height of the each row */
			// const rowHeight = gridInstance.getRowHeight();
			/** Grid height */
			// const gridHeight = gridInstance.height;
			/** initial page size */
			// const pageSize = gridInstance.pageSettings.pageSize;
			/** new page size is obtained here */
			// const pageResize = (gridHeight - (pageSize * rowHeight)) / rowHeight;
			// gridInstance.pageSettings.pageSize = pageSize + Math.round(pageResize);
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
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					rowSelected={rowSelectedContact}
					editSettings={editOptions}
					enablePersistence
					// pageSize={gridPageSize}
					// frozenColumns={2}
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
						/>
						<ColumnDirective
							field="primaryphone"
							headerText="Phone 1"
							textAlign="Left"
							width="100"
							// edit={custphonemaskinput}
						/>
						<ColumnDirective
							field="secondaryphone"
							headerText="Phone 2"
							textAlign="Left"
							width="100"
							// edit={custphonemaskinput}
						/>
						{/* <ColumnDirective field='primaryemail' headerText='Email 1' textAlign='Left' width='150' validationRules={mailidRules} />
                <ColumnDirective field='secondaryemail' headerText='Email 2' textAlign='Left' width='150' validationRules={mailidRules} /> */}
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
						services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
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
