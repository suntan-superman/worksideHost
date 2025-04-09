/* eslint-disable */
import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
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
import { MaskedTextBox } from "@syncfusion/ej2-inputs";
import { DataManager, Query } from "@syncfusion/ej2-data";
import FirmEditTemplate from "../components/FirmEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Header } from "../components/Header";
import { areaOptions } from "../data/worksideOptions";
import { GetAllFirms } from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

import {
	showErrorDialog,
	showWarningDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

// TODO Delete
// TODO Update
// TODO Create

/**
 * FirmsTab Component
 *
 * This component renders a grid interface for managing firm data. It includes functionalities
 * for viewing, adding, editing, deleting, and exporting firm records. The grid is powered by
 * Syncfusion's GridComponent and supports features like filtering, paging, and frozen columns.
 *
 * @component
 *
 * @returns {JSX.Element} The FirmsTab component.
 *
 * @description
 * - Fetches firm data using `react-query` and displays it in a grid.
 * - Provides CRUD operations for firm records with appropriate access control based on user access level.
 * - Includes custom dialog templates for editing and adding records.
 * - Supports exporting data to Excel format.
 * - Implements custom input fields for phone numbers and other fields.
 *
 * @state
 * - `isLoading` (boolean): Indicates whether data is being loaded.
 * - `firmList` (array|null): Stores the list of firms fetched from the server.
 * - `insertFlag` (boolean): Tracks whether a new record is being added.
 * - `openUpdateModal` (boolean): Controls the visibility of the update confirmation dialog.
 * - `messageText` (string): Message displayed in the confirmation dialog.
 * - `currentRecord` (object): Stores the current record being edited or added.
 * - `selectedRecord` (string|null): Stores the ID of the currently selected record.
 *
 * @functions
 * - `GetAccessLevel`: Retrieves the user's access level from localStorage.
 * - `toolbarClick`: Handles toolbar actions like exporting data.
 * - `handleFirmDelete`: Deletes a selected firm record.
 * - `actionComplete`: Handles actions like editing, adding, saving, and deleting records.
 * - `firmsActionComplete`: Handles additional actions specific to the firms grid.
 * - `rowSelectedFirm`: Updates the selected record when a row is selected.
 * - `SaveFirmsData`: Saves or updates firm data based on the current operation.
 * - `SaveLatestDefaults`: Saves the latest defaults for firm fields to localStorage.
 * - `onFirmLoad`: Configures grid settings on load.
 *
 * @dependencies
 * - `react-query`: For fetching and caching firm data.
 * - `Syncfusion`: For the grid and related components.
 * - `localStorage`: For storing user preferences and defaults.
 *
 * @example
 * <FirmsTab />
 */
const FirmsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState(null);
	const [firmList, setFirmList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState([]);

	let firmsGridRef = useRef(null);

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	const handleFormDataChange = useCallback((newData) => {
		console.log("Form data updated:", newData);
		setFormData(newData);
	}, []);

	const editOptions = useMemo(
		() => ({
			allowEditing: accessLevel > 2,
			allowAdding: accessLevel > 2,
			allowDeleting: accessLevel > 2,
			mode: "Dialog",
			template: (props) => (
				<FirmEditTemplate {...props} onChange={handleFormDataChange} />
			),
		}),
		[accessLevel, handleFormDataChange],
	);

	const toolbarOptions = ["Add", "Edit", "Delete", "ExcelExport"];
	// const { firmData, dispatch: firmDispatch } = useFirmContext();

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };

	// Set Firm Type Selection Options
	const firmOptions = [
		{ firmType: "CUSTOMER", firmId: "1" },
		{ firmType: "RIGCOMPANY", firmId: "2" },
		{ firmType: "SUPPLIER", firmId: "3" },
		{ firmType: "DELIVERYASSOC", firmId: "4" },
	];

	const firmSelections = {
		params: {
			actionComplete: () => false,
			allowFiltering: true,
			dataSource: new DataManager(firmOptions),
			fields: { text: "firmType", value: "firmType" },
			query: new Query(),
		},
	};

	const locationSelections = {
		params: {
			actionComplete: () => false,
			allowFiltering: true,
			dataSource: new DataManager(areaOptions),
			fields: { text: "location", value: "location" },
			query: new Query(),
		},
	};

	// Get the firms data
	const {
		data: firmsData,
		isLoading: firmsLoading,
		isError: reqError,
		isSuccess: reqSuccess,
	} = useQuery({
		queryKey: ["firms"],
		queryFn: () => GetAllFirms(),
		refetchInterval: 1000 * 10 * 60, // 1 minute refetch
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		// staleTime: 1000 * 60 * 60 * 24, // 1 Day
		retry: 3,
	});

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		if (firmsData) {
			// Now filter the data
			const data = firmsData.data;
			setFirmList(data);
		}
	}, [firmsData]);

	const toolbarClick = (args) => {
		if (firmsGridRef && args.item.id === "firmGridElement_excelexport") {
			if (accessLevel <= 2) {
				showWarningDialog("You do not have permission to export data.");
				return;
			}
			const excelExportProperties = {
				fileName: "worksideFirms.xlsx",
			};
			console.log("Excel Export");
			firmsGridRef.excelExport(excelExportProperties);
		}
	};

	const handleFirmDelete = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/firm/${selectedRecord}`,
			{
				method: "DELETE",
			},
		);
		const json = await response.json();

		if (response.ok) {
			showSuccessDialogWithTimer("Record Successfully Deleted...");
		}
	};

	const actionComplete = useCallback(
		async (args) => {
			console.log("Action Complete - Request Type:", args.requestType);
			console.log("Action Complete - Args:", args);

			if (args.requestType === "beginEdit" || args.requestType === "add") {
				console.log("Opening dialog for:", args.requestType);
				const dialog = args.dialog;
				dialog.showCloseIcon = false;
				dialog.height = 500;
				dialog.width = 600;
				setInsertFlag(args.requestType === "add");
				dialog.header =
					args.requestType === "beginEdit"
						? `Edit ${args.rowData.name}`
						: "Workside New Firm";
			}
			if (args.requestType === "save") {
				console.log("Save action triggered");
				// Use the formData state instead of trying to get values from form elements
				const data = formData || {};
				console.log("Save data:", data);

				// Check each required field and build a list of missing ones
				const missingFields = [];
				if (!data.name) missingFields.push("Name");
				if (!data.area) missingFields.push("Area");
				if (!data.type) missingFields.push("Type");
				if (!data.city) missingFields.push("City");
				if (!data.state) missingFields.push("State");

				if (missingFields.length > 0) {
					console.log("Missing required fields:", missingFields);
					showErrorDialog(
						`Please fill in the following required fields: ${missingFields.join(", ")}`,
					);
					// Prevent the dialog from closing
					args.cancel = true;
					return;
				}

				console.log("All required fields present, proceeding with save");
				setMessageText(`Update Firm ${data.name} Details?`);
				setCurrentRecord(data);
				setOpenUpdateModal(true);
			}
			if (args.requestType === "delete") {
				console.log("Delete action triggered");
				handleFirmDelete();
				setInsertFlag(false);
			}
		},
		[formData, handleFirmDelete],
	);

	const firmsActionComplete = async (args) => {
		if (!firmsGridRef) return;

		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Firms";
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
						`${process.env.REACT_APP_MONGO_URI}/api/firm/`,
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
				handleFirmDelete();
				setInsertFlag(false);
			}
		}
	};

	const rowSelectedFirm = () => {
		if (firmsGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = firmsGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(firmList[selectedrowindex]._id);
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const SaveFirmsData = async () => {
		// Close Modal
		setOpenUpdateModal(false);
		// Save or Update Data
		if (insertFlag === true) {
			const response = await fetch(
				// "http://localhost:4000/api/firm/",
				`${process.env.REACT_APP_MONGO_URI}/api/firm/`,
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
				showSuccessDialogWithTimer("Record Successfully Added...");
			} else {
				showErrorDialog(`Record Add Failed...${json.message}`);
			}
		} else {
			currentRecord.statusdate = new Date();
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/firm/${currentRecord._id}`,
				{
					method: "PATCH",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();
			if (response.ok) {
				showSuccessDialogWithTimer("Record Successfully Updated...");
				SaveLatestDefaults();
			} else {
				showErrorDialog(`Record Update Failed...${json.message}`);
			}
			setInsertFlag(false);
		}
	};

	const SaveLatestDefaults = async () => {
		localStorage.setItem("firmsLatestArea", currentRecord.area);
		localStorage.setItem("firmsLatestType", currentRecord.type);
		localStorage.setItem("firmsLatestCity", currentRecord.city);
		localStorage.setItem("firmsLatestState", currentRecord.state);
	};

	// *******************************************************
	// This is for custom phone and email editing in dialog
	// *******************************************************
	let phElem;
	let phObject;
	const createcusphonemaskinputn = () => {
		phElem = document.createElement("input");
		return phElem;
	};
	const destroycusphonemaskinputFn = () => {
		phObject.destroy();
	};
	const readcusphonemaskinputFn = () => phObject.value;
	const writecusphonemaskinputFn = (args) => {
		phObject = new MaskedTextBox({
			// value: args.rowData[args.column.field].toString(),
			value: args.rowData[args.column.field],
			mask: "000-000-0000",
			placeholder: "Phone",
			floatLabelType: "Always",
		});
		phObject.appendTo(phElem);
	};

	const custphonemaskinput = {
		create: createcusphonemaskinputn,
		destroy: destroycusphonemaskinputFn,
		read: readcusphonemaskinputFn,
		write: writecusphonemaskinputFn,
	};

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

	if (firmsLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		<div>
			{/* Companies Tab */}
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="firmGridElement"
					dataSource={firmsData?.data}
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
					rowSelected={rowSelectedFirm}
					editSettings={editOptions}
					enablePersistence
					frozenColumns={2}
					load={onFirmLoad}
					width="95%"
					ref={(g) => {
						firmsGridRef = g;
					}}
				>
					<ColumnsDirective>
						<ColumnDirective
							field="_id"
							headerText="Id"
							textAlign="Left"
							width="10"
							isPrimaryKey
							allowEditing={false}
							visible={false}
						/>
						<ColumnDirective
							field="firm_id"
							headerText="Id"
							textAlign="Left"
							width="10"
							allowEditing={false}
							visible={false}
						/>
						<ColumnDirective
							field="name"
							headerText="Name"
							textAlign="Left"
							width="125"
							freeze="left"
						/>
						<ColumnDirective
							field="type"
							headerText="Type"
							editType="dropdownedit"
							edit={firmSelections}
							textAlign="Left"
							width="125"
						/>
						<ColumnDirective
							field="area"
							headerText="Area"
							editType="dropdownedit"
							edit={locationSelections}
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="address1"
							headerText="Address 1"
							textAlign="Left"
							width="25"
						/>
						<ColumnDirective
							field="address2"
							headerText="Address 2"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="city"
							headerText="City"
							editType="dropdownedit"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="state"
							headerText="State"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="zipcode"
							headerText="Zip"
							textAlign="Left"
							width="100"
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
					onConfirm={() => SaveFirmsData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}
		</div>
	);
};

export default FirmsTab;
