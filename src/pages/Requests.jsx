/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { closest } from "@syncfusion/ej2-base";
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

import RequestInfoModal from "../components/RequestInfoModal";
import { UseStateContext } from "../contexts/ContextProvider";
import RequestEditTemplate from "../components/RequestEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { toast } from "react-toastify";

import { Header } from "../components";

let gridPageSize = 8;

const Requests = () => {
	let requestGridRef = useRef(null);

	const [isLoading, setIsLoading] = useState(false);
	const { currentColor } = UseStateContext();
	const [requestList, setRequestList] = useState(null);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [insertFlag, setInsertFlag] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);

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
		allowEditOnDblClick: accessLevel > 2,
		allowDeleting: accessLevel > 2,
		mode: "Dialog",
		template: (props) => <RequestEditTemplate {...props} />,
	};

	const toolbarOptions = ["Add", "Edit", "ExcelExport"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const settings = { mode: "Row" };
	const position = { X: "center", Y: "center" };
	const dialogAnimationSettings = {
		effect: "FlipX",
		duration: 3000,
		delay: 1000,
	};

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		const fetchRequests = async () => {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/request`,
			);
			const json = await response.json();

			setRequestList(json);
			setIsLoading(false);
		};
		fetchRequests();
	}, []);

	const FilterOptions = {
		type: "Menu",
	};

	const toolbarClick = (args) => {
		if (requestGridRef && args.item.id === "requestGridElement_excelexport") {
			if (accessLevel <= 2) {
				toast.error("You do not have permission to export data.");
				return;
			}
			const excelExportProperties = {
				fileName: "worksideRequests.xlsx",
			};
			requestGridRef.excelExport(excelExportProperties);
			toast.success("Request Data Exported...");
		}
	};

	const dialogClose = () => {
		setShowDialog(false);
	};

	const dialogOpen = () => {
		setShowDialog(true);
	};

	// TODO Get Company Options from DB
	// Set Location Type Selection Options
	const companyOptions = [
		{ name: "Aera Energy", nameId: "1" },
		{ name: "Berry", nameId: "2" },
		{ name: "Chevron", nameId: "3" },
		{ name: "CRC", nameId: "4" },
	];

	const companySelections = {
		params: {
			actionComplete: () => false,
			allowFiltering: true,
			dataSource: new DataManager(companyOptions),
			fields: { text: "name", value: "name" },
			query: new Query(),
		},
	};

	const onRequestLoad = () => {
		const gridElement = document.getElementById("requestGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
		}
	};

	const rowSelectedRequest = () => {
		if (requestGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = requestGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(requestList[selectedrowindex]._id);
			// setEmptyFields([]);
		}
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
				className="requestData"
			>
				Details
			</button>
		</div>
	);

	const actionBegin = (args) => {
		if (args.requestType === "save" && args.form) {
			/** cast string to integer value */
			// setValue("data.area", args.form.querySelector("#area").value, args);
		}
	};

	const actionComplete = async (args) => {
		// console.log(`Action Complete: ${args.requestType}`);
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			// dialog.height = 600;
			// dialog.width = 600;
			// Set Insert Flag
			setInsertFlag(args.requestType === "add");
			// change the header of the dialog
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit Record of ${args.rowData.projectname} ${args.rowData.requestname}`
					: "Workside New Request";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
			setMessageText(`Update Request ${args.data.requestname} Details?`);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
	};

	const SaveRequestData = async () => {
		setOpenUpdateModal(false);
		if (insertFlag) {
			// Insert Record
			window.alert(`Insert Request: ${JSON.stringify(currentRecord)}`);
			const response = await fetch(
				// `${localHost}/api/request/`,
				`${process.env.REACT_APP_MONGO_URI}/api/request/`,
				{
					method: "POST",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const jsonData = await response.json();
			if (response.status === 200) {
				toast.success("Record Successfully Added...");
			} else {
				toast.error("Record Add Failed...");
			}
			setInsertFlag(false);
		} else {
			const requestOptions = {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					requestorid: currentRecord?.requestorid,
					requestcategory: currentRecord?.requestcategory,
					requestname: currentRecord?.requestname,
					customername: currentRecord?.customername,
					customercontact: currentRecord?.customercontact,
					projectname: currentRecord?.projectname,
					rigcompany: currentRecord?.rigcompany,
					rigcompanycontact: currentRecord?.rigcompanycontact,
					creationdate: currentRecord?.creationdate,
					quantity: currentRecord?.quantity,
					vendortype: currentRecord?.vendortype,
					ssrVendorId: currentRecord?.ssrVendorId,
					datetimerequested: currentRecord?.datetimerequested,
					status: currentRecord?.status,
					statusdate: currentRecord?.statusdate,
					comment: currentRecord?.comment,
					project_id: currentRecord?.project_id,
				}),
			};

			const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/request/${currentRecord._id}`;
			try {
				const response = await fetch(fetchString, requestOptions);
				const jsonData = await response.json();
				if (response.status === 200) {
					toast.success("Record Successfully Updated...");
				} else {
					toast.error("Record Update Failed...");
				}
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				window.alert(`Error: ${error}`);
				console.error(error);
			}
		}
	};

	const recordClick = (args) => {
		if (args.target.classList.contains("requestData")) {
			const rowObj = requestGridRef.getRowObjectFromUID(
				closest(args.target, ".e-row").getAttribute("data-uid"),
			);
			setSelectedRecord(rowObj._id);
			setShowDialog(true);
		}
	};

	const SaveRequestsData = async () => {};

	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<Header category="Workside" title="Requests" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			<div className="absolute top-[75px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="requestGridElement"
					dataSource={requestList}
					allowSelection
					allowFiltering
					allowPaging
					allowResizing
					allowExcelExport
					frozenColumns={2}
					actionBegin={actionBegin}
					actionComplete={actionComplete}
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					toolbarClick={toolbarClick}
					rowSelected={rowSelectedRequest}
					recordClick={recordClick}
					editSettings={editOptions}
					enablePersistence
					load={onRequestLoad}
					// width="auto"
					width="95%"
					// eslint-disable-next-line no-return-assign
					ref={(g) => {
						requestGridRef = g;
					}}
				>
					<ColumnsDirective>
						<ColumnDirective
							field="_id"
							headerText="Id"
							textAlign="Left"
							width="50"
							isPrimaryKey="true"
							allowEditing="false"
							visible={false}
						/>
						<ColumnDirective
							field="request_id"
							headerText="Id"
							textAlign="Left"
							width="50"
							allowEditing="false"
							visible={false}
						/>
						<ColumnDirective
							headerText="Details"
							textAlign="Center"
							width="80"
							template={gridTemplate}
							allowEditing="false"
						/>
						<ColumnDirective
							field="requestname"
							headerText="Request"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="customername"
							headerText="Customer"
							editType="dropdownedit"
							textAlign="Left"
							width="100"
							edit={companySelections}
						/>
						<ColumnDirective
							field="customercontact"
							headerText="Cust Contact"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="projectname"
							headerText="Project"
							textAlign="Left"
							width="200"
						/>
						<ColumnDirective
							field="rigcompany"
							headerText="Rig Company"
							textAlign="left"
							width="50"
						/>
						<ColumnDirective
							field="rigcompanycontact"
							headerText="RC Contact"
							textAlign="left"
							width="50"
						/>
						<ColumnDirective
							field="creationdate"
							headerText="Date Created"
							type="date"
							editType="datepickeredit"
							format="MM/dd/yyy"
							textAlign="Right"
							width="140"
						/>
						<ColumnDirective
							field="quantity"
							headerText="Quantity"
							textAlign="Right"
							width="100"
						/>
						<ColumnDirective
							field="vendortype"
							headerText="Vendor Type"
							editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="datetimerequested"
							headerText="Date Requested"
							type="date"
							editType="datepickeredit"
							format="MM/dd/yyyy-hh:mm"
							textAlign="Right"
							width="140"
						/>
						<ColumnDirective
							field="comments"
							headerText="Comments"
							textAlign="left"
							width="100"
						/>
						<ColumnDirective
							field="status"
							headerText="Status"
							editType="dropdownedit"
							width="100"
						/>
						<ColumnDirective
							field="statusdate"
							headerText="Status Date"
							type="date"
							editType="datepickeredit"
							format="MM/dd/yyy"
							textAlign="Right"
							width="140"
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
			<div>
				{showDialog && (
					<RequestInfoModal
						recordID={selectedRecord}
						open={dialogOpen}
						onClose={dialogClose}
					/>
				)}
				{openUpdateModal && (
					<ConfirmationDialog
						open={openUpdateModal}
						message={messageText}
						onConfirm={() => SaveRequestData()}
						onCancel={() => setOpenUpdateModal(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default Requests;
