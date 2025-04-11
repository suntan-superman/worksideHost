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
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
	showErrorDialog,
	showWarningDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

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
 * - `openDeleteModal` (boolean): Controls the visibility of the delete confirmation dialog.
 * - `messageText` (string): Message displayed in the confirmation dialog.
 * - `currentRecord` (object): Stores the current record being edited or added.
 * - `selectedRecord` (string|null): Stores the ID of the currently selected record.
 * - `lastCoordinates` (object): Stores the last coordinates when a firm is saved.
 * - `dialogDimensions` (object): Stores the dimensions of the dialog.
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
 * - `handleFirmSave`: Handles saving a firm with coordinates.
 * - `handleFirmAdd`: Handles adding a new firm with last coordinates.
 * - `saveDialogDimensions`: Saves dialog dimensions to localStorage.
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
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState([]);
	const [lastCoordinates, setLastCoordinates] = useState({
		lat: null,
		lng: null,
	});
	const [dialogDimensions, setDialogDimensions] = useState({
		height: 600,
		width: 600,
	});

	let firmsGridRef = useRef(null);

	const queryClient = useQueryClient();

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	const handleFormDataChange = useCallback((newData) => {
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
		[accessLevel],
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

	useEffect(() => {
		const savedDimensions = localStorage.getItem("firmDialogDimensions");
		if (savedDimensions) {
			setDialogDimensions(JSON.parse(savedDimensions));
		}
	}, []);

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

	const checkFirmExists = useCallback(async (firmName, currentId = null) => {
		try {
			const response = await GetAllFirms();
			const existingFirm = response.data.find(
				(firm) =>
					firm.name.toLowerCase() === firmName.toLowerCase() &&
					firm._id !== currentId,
			);
			return existingFirm;
		} catch (error) {
			console.error("Error checking firm existence:", error);
			return null;
		}
	}, []);

	const saveDialogDimensions = useCallback((dimensions) => {
		setDialogDimensions(dimensions);
		localStorage.setItem("firmDialogDimensions", JSON.stringify(dimensions));
	}, []);

	const actionComplete = useCallback(
		async (args) => {
			console.log(
				"actionComplete triggered with requestType:",
				args.requestType,
			);
			console.log("actionComplete args:", args);

			if (args.requestType === "beginEdit" || args.requestType === "add") {
				console.log("Opening dialog for:", args.requestType);
				const dialog = args.dialog;
				dialog.showCloseIcon = false;
				dialog.height = dialogDimensions.height;
				dialog.width = dialogDimensions.width;
				dialog.isResizable = true;
				dialog.resizeStart = (args) => {
					// Store new dimensions when resizing starts
					saveDialogDimensions({
						height: args.height,
						width: args.width,
					});
				};
				dialog.resize = (args) => {
					// Update dimensions during resize
					saveDialogDimensions({
						height: args.height,
						width: args.width,
					});
				};
				setInsertFlag(args.requestType === "add");
				dialog.header =
					args.requestType === "beginEdit"
						? `Edit ${args.rowData.name}`
						: "Workside New Firm";
			}
			if (args.requestType === "save") {
				// Prevent saving if formData is null or empty
				if (!formData) {
					showErrorDialog("Please fill in all required fields before saving.");
					args.cancel = true;
					return;
				}

				// Check if the form is valid
				if (!formData.isValid) {
					showErrorDialog("Please fill in all required fields before saving.");
					args.cancel = true;
					return;
				}

				// Check for existing firm with same name
				const existingFirm = await checkFirmExists(formData.name, formData._id);
				if (existingFirm) {
					showErrorDialog(
						`A firm with the name "${formData.name}" already exists. Please choose a different name.`,
					);
					args.cancel = true;
					return;
				}

				// If all validations pass, proceed with save
				setMessageText(`Update Firm ${formData.name} Details?`);
				setCurrentRecord(formData);
				setOpenUpdateModal(true);
			}
			if (args.requestType === "delete") {
				console.log("Delete action triggered");
				console.log("Full args.data:", args.data);
				if (args.data && args.data.length > 0) {
					const selectedFirm = args.data[0];
					console.log("Selected firm for deletion:", selectedFirm);
					console.log("Selected firm ID:", selectedFirm._id);
					console.log("Expected ID: 67f6e33d5c7361330107d436");
					setMessageText(
						`Are you sure you want to delete the firm "${selectedFirm.name}"?`,
					);
					// Store the entire firm object in state
					setCurrentRecord(selectedFirm);
					setOpenDeleteModal(true);
					args.cancel = true;
				} else {
					console.log("No firm data available for deletion");
				}
			}
			if (args.requestType === "refresh") {
				console.log("Refresh action triggered");
				// Force a refetch of the firms data
				queryClient.invalidateQueries(["firms"]);
			}
		},
		[
			formData,
			checkFirmExists,
			queryClient,
			dialogDimensions,
			saveDialogDimensions,
		],
	);

	const handleFirmDelete = async () => {
		console.log("handleFirmDelete called with currentRecord:", currentRecord);
		console.log("Current record ID:", currentRecord?._id);
		console.log("Expected ID: 67f6e33d5c7361330107d436");
		setOpenDeleteModal(false);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/firm/${currentRecord._id}`,
				{
					method: "DELETE",
				},
			);
			const json = await response.json();
			console.log("Delete response:", json);

			if (response.ok) {
				console.log("Delete successful, invalidating query");
				showSuccessDialogWithTimer("Record Successfully Deleted...");
				// Force a refetch of the firms data
				queryClient.invalidateQueries(["firms"]);
				// Clear the current record
				setCurrentRecord(null);
			} else {
				console.log("Delete failed:", json.message);
				showErrorDialog(`Delete Failed: ${json.message}`);
			}
		} catch (error) {
			console.log("Delete error:", error);
			showErrorDialog("Error deleting firm. Please try again.");
		}
	};

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
		console.log("SaveFirmsData called with currentRecord:", currentRecord);

		// Additional validation before saving
		if (
			!currentRecord ||
			!currentRecord.name ||
			currentRecord.name.trim() === ""
		) {
			showErrorDialog("Cannot save a firm without a name.");
			return;
		}

		// Close Modal
		setOpenUpdateModal(false);

		// Save or Update Data
		if (insertFlag === true) {
			console.log("Inserting new firm");
			const response = await fetch(
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
			console.log("Insert response:", json);

			if (response.ok) {
				console.log("Insert successful, invalidating query");
				showSuccessDialogWithTimer("Record Successfully Added...");
				queryClient.invalidateQueries(["firms"]);
			} else {
				console.log("Insert failed:", json.message);
				showErrorDialog(`Record Add Failed...${json.message}`);
			}
		} else {
			console.log("Updating existing firm");
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
			console.log("Update response:", json);
			if (response.ok) {
				console.log("Update successful, invalidating query");
				showSuccessDialogWithTimer("Record Successfully Updated...");
				SaveLatestDefaults();
				queryClient.invalidateQueries(["firms"]);
			} else {
				console.log("Update failed:", json.message);
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

	const handleFirmSave = async (formData) => {
		try {
			// Store coordinates before saving
			if (formData.lat && formData.lng) {
				setLastCoordinates({ lat: formData.lat, lng: formData.lng });
			}

			// ... rest of the save logic ...
		} catch (error) {
			console.error("Error saving firm:", error);
		}
	};

	const handleFirmAdd = () => {
		// Restore last coordinates when adding a new firm
		const initialData = {
			...defaultFirmData,
			lat: lastCoordinates.lat,
			lng: lastCoordinates.lng,
		};
		setFormData(initialData);
		setOpenDialog(true);
	};

	const handleActionBegin = (args) => {
		if (args.requestType === "save") {
			// Ensure we have valid form data
			if (!formData) {
				args.cancel = true;
				showErrorDialog("Please fill in all required fields.");
				return;
			}
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
					actionBegin={handleActionBegin}
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
			{openDeleteModal && (
				<ConfirmationDialog
					open={openDeleteModal}
					message={messageText}
					onConfirm={handleFirmDelete}
					onCancel={() => setOpenDeleteModal(false)}
				/>
			)}
		</div>
	);
};

export default FirmsTab;
