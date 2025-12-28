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

import { useToast } from "../contexts/ToastContext";

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
	const toast = useToast();
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
	const [dialogDimensions, setDialogDimensions] = useState(() => {
		const savedDimensions = localStorage.getItem("firmDialogDimensions");
		return savedDimensions
			? JSON.parse(savedDimensions)
			: { height: 480, width: 480 };
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
		console.log("FirmsTab handleFormDataChange - newData:", newData);
		setFormData((prevData) => {
			const updatedData = { ...prevData, ...newData };
			console.log("FirmsTab handleFormDataChange - updatedData:", updatedData);
			return updatedData;
		});
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
				toast.warning("You do not have permission to export data.");
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
		console.log("Saving dialog dimensions:", dimensions);
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

				// Use saved dimensions or defaults
				const savedDimensions = localStorage.getItem("firmDialogDimensions");
				const dimensions = savedDimensions
					? JSON.parse(savedDimensions)
					: { height: 480, width: 480 };

				console.log("Setting dialog dimensions:", dimensions);
				dialog.height = dimensions.height;
				dialog.width = dimensions.width;
				dialog.isResizable = true;
				dialog.enableResize = true;

				dialog.resizeStart = (args) => {
					console.log("Dialog resize start - new dimensions:", {
						height: args.height,
						width: args.width,
					});
					saveDialogDimensions({
						height: args.height,
						width: args.width,
					});
				};

				dialog.resize = (args) => {
					console.log("Dialog resize - new dimensions:", {
						height: args.height,
						width: args.width,
					});
					saveDialogDimensions({
						height: args.height,
						width: args.width,
					});
				};

				setInsertFlag(args.requestType === "add");
				dialog.header =
					args.requestType === "beginEdit"
						? `Edit ${args.rowData.name} Record`
						: "Workside New Firm Record";

				const formObj = args.form["ej2_instances"][0];

				formObj.addRules("name", { required: true });
				formObj.addRules("area", { required: true });
				formObj.addRules("type", { required: true });
				formObj.addRules("city", { required: true });
				formObj.addRules("state", { required: true });
				formObj.addRules("status", { required: true });
				formObj.addRules("statusdate", { required: true });
			}
			if (args.requestType === "save") {
				const data = formData || args.data;
				console.log("ActionComplete - Received data:", data);
				console.log("ActionComplete - Name field value:", data.name);

				const cleanData = {
					_id: data._id,
					name: data.name,
					area: data.area,
					type: data.type,
					city: data.city,
					state: data.state,
					status: data.status,
					statusdate: data.statusdate,
					address1: data.address1,
					address2: data.address2,
					zipCode: data.zipCode,
					lat: data.lat,
					lng: data.lng,
				};

				console.log("ActionComplete - Clean data:", cleanData);
				setMessageText(`Update Firm: ${data.name} Record?`);
				setCurrentRecord(cleanData);
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
					setCurrentRecord(selectedFirm);
					setOpenDeleteModal(true);
					args.cancel = true;
				} else {
					console.log("No firm data available for deletion");
				}
			}
			if (args.requestType === "refresh") {
				console.log("Refresh action triggered");
				queryClient.invalidateQueries(["firms"]);
			}
		},
		[formData, checkFirmExists, queryClient, saveDialogDimensions],
	);

	const handleFirmDelete = async () => {
		console.log("handleFirmDelete called with currentRecord:", currentRecord);
		console.log("Current record ID:", currentRecord?._id);
		console.log("Expected ID: 67f6e33d5c7361330107d436");
		setOpenDeleteModal(false);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/firm/${currentRecord._id}`,
				{
					method: "DELETE",
				},
			);
			const json = await response.json();
			console.log("Delete response:", json);

			if (response.ok) {
				console.log("Delete successful, invalidating query");
				toast.success("Record Successfully Deleted...");
				queryClient.invalidateQueries(["firms"]);
				setCurrentRecord(null);
			} else {
				console.log("Delete failed:", json.message);
				toast.error(`Delete Failed: ${json.message}`);
			}
		} catch (error) {
			console.log("Delete error:", error);
			toast.error("Error deleting firm. Please try again.");
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
				setInsertFlag(true);
			}
			if (args.requestType === "update") {
				setInsertFlag(false);
			}
			if (args.requestType === "save") {
				const { data } = args;

				if (insertFlag === true) {
					const response = await fetch(
						`${process.env.REACT_APP_API_URL}/api/firm/`,
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
				handleFirmDelete();
				setInsertFlag(false);
			}
		}
	};

	const rowSelectedFirm = () => {
		if (firmsGridRef) {
			const selectedrowindex = firmsGridRef.getSelectedRowIndexes();
			setSelectedRecord(firmList[selectedrowindex]._id);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const SaveFirmsData = async () => {
		console.log("SaveFirmsData called with currentRecord:", currentRecord);
		console.log("SaveFirmsData - Name field value:", currentRecord?.name);

		if (!currentRecord) {
			console.log("SaveFirmsData - No current record");
			toast.error("Cannot save a firm without a name.");
			return;
		}

		if (!currentRecord.name || currentRecord.name.trim() === "") {
			console.log("SaveFirmsData - Name is empty or whitespace");
			toast.error("Cannot save a firm without a name.");
			return;
		}

		setOpenUpdateModal(false);

		if (insertFlag === true) {
			console.log("Inserting new firm");
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/firm/`,
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
				toast.success("Record Successfully Added...");
				queryClient.invalidateQueries(["firms"]);
			} else {
				console.log("Insert failed:", json.message);
				toast.error(`Record Add Failed...${json.message}`);
			}
		} else {
			console.log("Updating existing firm");

			// Get the current firm data to ensure we have the supplier_id
			const currentFirm = firmList.find(
				(firm) => firm._id === currentRecord._id,
			);
			if (!currentFirm) {
				console.log("Could not find firm with _id:", currentRecord._id);
				console.log("Available firms:", firmList);
				toast.error("Could not find the firm to update.");
				return;
			}

			// Create update data with supplier_id if it exists
			const updateData = {
				...currentRecord,
				supplier_id: currentFirm.supplier_id || currentRecord.supplier_id,
			};

			// Store coordinates if they exist
			if (updateData.lat && updateData.lng) {
				setLastCoordinates({ lat: updateData.lat, lng: updateData.lng });
				localStorage.setItem(
					"lastCoordinates",
					JSON.stringify({ lat: updateData.lat, lng: updateData.lng }),
				);
			}

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/firm/${currentRecord._id}`,
				{
					method: "PATCH",
					body: JSON.stringify(updateData),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();
			console.log("Update response:", json);
			if (response.ok) {
				console.log("Update successful, invalidating query");
				toast.success("Record Successfully Updated...");
				SaveLatestDefaults();
				queryClient.invalidateQueries(["firms"]);
			} else {
				console.log("Update failed:", json.message);
				toast.error(`Record Update Failed...${json.message}`);
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

	const onFirmLoad = () => {
		const gridElement = document.getElementById("firmGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 3;
			gridInstance.pageSettings.freeze = true;
		}
	};

	const handleFirmSave = async (formData) => {
		try {
			if (formData.lat && formData.lng) {
				setLastCoordinates({ lat: formData.lat, lng: formData.lng });
				localStorage.setItem(
					"lastCoordinates",
					JSON.stringify({ lat: formData.lat, lng: formData.lng }),
				);
			}
			// ... rest of the save logic ...
		} catch (error) {
			console.error("Error saving firm:", error);
		}
	};

	const handleFirmAdd = () => {
		// Try to get last coordinates from localStorage
		const savedCoordinates = localStorage.getItem("lastCoordinates");
		const lastCoords = savedCoordinates
			? JSON.parse(savedCoordinates)
			: lastCoordinates;

		const initialData = {
			...defaultFirmData,
			lat: lastCoords.lat,
			lng: lastCoords.lng,
		};
		setFormData(initialData);
		setOpenDialog(true);
	};

	const handleActionBegin = (args) => {
		if (args.requestType === "save") {
			if (!formData) {
				args.cancel = true;
				toast.error("Please fill in all required fields.");
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
