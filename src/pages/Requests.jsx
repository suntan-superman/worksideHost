/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { DataManager, Query } from "@syncfusion/ej2-data";
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

import { GetRequestsByCustomer } from "../api/worksideAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import RequestInfoModal from "../components/RequestInfoModal";
import { UseStateContext } from "../contexts/ContextProvider";
import RequestEditTemplate from "../components/RequestEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";

import { Header } from "../components";

import {
	showErrorDialog,
	showWarningDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import FilterListIcon from '@mui/icons-material/FilterList';
import { Chip, IconButton, Box } from "@mui/material";
import RequestFilterDialog from "../components/RequestFilterDialog";

let gridPageSize = 8;
let clientName = "CRC";

const requestStatusOptions = [
	"OPEN",
	"NOT-AWARDED",
	"AWARDED-WOA",
	"AWARDED-A",
	"AWARDED-P",
	"IN-PROGRESS",
	"CANCELED",
	"POSTPONED",
	"SSR-ACCEPTED",
	"SSR-REQ",
	"COMPLETED",
];

const Requests = () => {
	const requestGridRef = useRef(null);
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState(false);
	const { currentColor } = UseStateContext();
	const [requestList, setRequestList] = useState(null);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [insertFlag, setInsertFlag] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);
	const [companyName, setCompanyName] = useState("");
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [activeFilters, setActiveFilters] = useState(() => {
		const saved = localStorage.getItem('requestFilterSelections');
		return saved ? JSON.parse(saved) : [];
	});

	// Add debugging for clientName
	const [debugClientName, setDebugClientName] = useState("");

	// Modify the useQuery to properly handle clientName
	const {
		data: reqData,
		isError: reqError,
		isLoading: reqLoading,
		isSuccess: isReqSuccess,
	} = useQuery({
		queryKey: ["requests", clientName], // Add clientName to query key
		queryFn: async () => {
			const res = await GetRequestsByCustomer(clientName); // Remove the object wrapper
			return res;
		},
		enabled: !!clientName, // Only run query when clientName is available
		refetchInterval: 1000 * 10,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 60 * 24,
		retry: 3,
	});

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	// Modify the initial setup effect
	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;

		const storedCompanyName = localStorage.getItem("companyName");
		
		if (storedCompanyName) {
			const parsedCompanyName = JSON.parse(storedCompanyName);
			clientName = parsedCompanyName;
			setCompanyName(parsedCompanyName);
			setDebugClientName(parsedCompanyName);
		}

		// Load and apply filters after grid is initialized
		const savedFilters = localStorage.getItem('requestFilterSelections');
		if (savedFilters) {
			const filters = JSON.parse(savedFilters);
			setActiveFilters(filters);
		}
	}, []);

	// Modify the data setting effect
	useEffect(() => {
		if (reqData?.data) {
			// Ensure dates are properly formatted for the grid
			const formattedData = reqData.data.map(request => ({
				...request,
				creationdate: new Date(request.creationdate),
				datetimerequested: new Date(request.datetimerequested),
				statusdate: new Date(request.statusdate)
			}));
			setRequestList(formattedData);
		}
	}, [reqData]);

	// Modify the grid load handler
	const onRequestLoad = () => {
		const gridElement = document.getElementById("requestGridElement");
		if (gridElement?.ej2_instances?.[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
		} else {
			console.warn("Grid instance not found");
		}
	};

	// Modify the filter application effect
	useEffect(() => {
		// Add a small delay to ensure grid is mounted
		const timer = setTimeout(() => {
			if (!reqData?.data) {
				return;
			}

			const gridElement = document.getElementById("requestGridElement");
			if (!gridElement?.ej2_instances?.[0]) {
				return;
			}

			try {
				const grid = gridElement.ej2_instances[0];
				
				// Clear existing filters first
				grid.clearFiltering();
				
				if (activeFilters.length > 0) {
					// Create filter object
					const filterObject = {
						columns: [{
							field: 'status',
							matchCase: false,
							operator: 'equal',
							predicate: 'or',
							value: activeFilters[0]  // Set initial value
						}]
					};

					// Add additional values for OR condition
					if (activeFilters.length > 1) {
						for (const status of activeFilters.slice(1)) {
							filterObject.columns.push({
								field: 'status',
								matchCase: false,
								operator: 'equal',
								predicate: 'or',
								value: status
							});
						}
					}

					// Apply filters
					grid.filterSettings = filterObject;
					grid.dataBind();
				}
			} catch (error) {
				console.error('Error applying filters:', error);
			}
		}, 100); // Small delay to ensure grid is ready

		return () => clearTimeout(timer);
	}, [activeFilters, reqData]);

	// Query client effect
	useEffect(() => {
		queryClient.invalidateQueries("requests");
	}, [queryClient]);

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

	const FilterOptions = {
		type: "Menu",
	};

	const toolbarClick = (args) => {
		if (requestGridRef && args.item.id === "requestGridElement_excelexport") {
			if (accessLevel <= 2) {
				showWarningDialog("You do not have permission to export data.");
				return;
			}
			const excelExportProperties = {
				fileName: "worksideRequests.xlsx",
			};
			requestGridRef.current.excelExport(excelExportProperties);
			showSuccessDialogWithTimer("Request Data Exported...");
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

	const rowSelectedRequest = (args) => {
		if (requestGridRef) {
			/** Get the selected row id */
			setSelectedRecord(args.data._id);
		}
	};

	const gridTemplate = (props) => (
		<div>
			<button
				type="button"
				style={{
					// background: currentColor,
					background: "black",
					color: "white",
					padding: "5px",
					borderRadius: "5%",
					fontWeight: "bold",
					fontSize: "14px",
				}}
				className="requestData"
				onClick={() => {
					setSelectedRecord(props._id);
					setShowDialog(true);
				}}
			>
				Details
			</button>
		</div>
	);

const rowDataBound = (args) => {
	// For example, conditionally highlight rows where age is greater than 25.
	if (args.data.status === "SSR-REQ") {
		args.row.style.backgroundColor = "yellow";
	}
	if (args.data.status === "SSR-ACCEPTED") {
		args.row.style.backgroundColor = "#22C55E";
	}
};
	const actionBegin = (args) => {
		if (args.requestType === "save" && args.form) {
			/** cast string to integer value */
			// setValue("data.area", args.form.querySelector("#area").value, args);
		}
	};

	const actionComplete = async (args) => {
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
					? `Edit Request: ${args.rowData.projectname} ${args.rowData.requestname}`
					: "Workside New Request";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			setMessageText(`Update Request ${args.data.requestname} Details?`);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
	};

	const SaveRequestData = async () => {
		setOpenUpdateModal(false);
		if (insertFlag) {
			// Insert Record
			const response = await fetch(
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
				showSuccessDialogWithTimer("Record Successfully Added...");
			} else {
				showErrorDialog(`Record Add Failed...${response.status}`);
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
					showSuccessDialogWithTimer("Record Successfully Updated...");
				} else {
					showErrorDialog(`Record Update Failed...${response.status}`);
				}
				setIsLoading(false);
			} catch (error) {
				setIsLoading(false);
				showErrorDialog(`Error: ${error}`);
			}
		}
	};

	const recordClick = (args) => {
		// if (args.target.classList.contains("requestData")) {
		// 	const rowObj = requestGridRef.getRowObjectFromUID(
		// 		closest(args.target, ".e-row").getAttribute("data-uid"),
		// 	);
			setSelectedRecord(args.rowData._id);
			// setShowDialog(true);
		// }
	};

	const SaveRequestsData = async () => {};

	const handleFilterApply = (selectedFilters) => {
		setActiveFilters(selectedFilters);
	};

	const handleRemoveFilter = (filterToRemove) => {
		const newFilters = activeFilters.filter(filter => filter !== filterToRemove);
		setActiveFilters(newFilters);
	};

	// Add loading state handling
	if (reqLoading) {
		return <div>Loading requests...</div>;
	}

	if (reqError) {
		return <div>Error loading requests</div>;
	}

	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<Header category="Workside" title="Requests" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			<div className="absolute top-[75px] left-[20px] w-[100%]">
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						mb: 0,
						gap: 0,
						pl: 2,
					}}
				>
					<Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
						{activeFilters.map((filter) => (
							<Chip
								key={filter}
								label={filter}
								onDelete={() => handleRemoveFilter(filter)}
								sx={{
									backgroundColor: "green",
									color: "white",
									"& .MuiChip-deleteIcon": {
										color: "white",
									},
								}}
							/>
						))}
					</Box>
					<IconButton
						onClick={() => setFilterDialogOpen(true)}
						sx={{ color: "green", marginRight: "60px" }}
					>
						<FilterListIcon />
					</IconButton>
				</Box>
				{requestList && requestList.length > 0 ? (
					<GridComponent
						id="requestGridElement"
						dataSource={requestList}
						allowSelection={true}
						allowFiltering={true}
						allowPaging={true}
						allowResizing={true}
						allowExcelExport={true}
						frozenColumns={2}
						actionBegin={actionBegin}
						actionComplete={actionComplete}
						rowDataBound={rowDataBound}
						filterSettings={{
							type: "Menu",
							mode: "Immediate",
						}}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						toolbarClick={toolbarClick}
						rowSelected={rowSelectedRequest}
						recordClick={recordClick}
						editSettings={editOptions}
						enablePersistence={true}
						load={onRequestLoad}
						width="95%"
						height="100%"
						ref={requestGridRef}
					>
						<ColumnsDirective>
							<ColumnDirective
								field="_id"
								headerText="Id"
								textAlign="Left"
								width="50"
								isPrimaryKey={true}
								visible={false}
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
								field="status"
								headerText="Status"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="datetimerequested"
								headerText="Date Requested"
								type="date"
								format="MM/dd/yyyy"
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
								field="comments"
								headerText="Comments"
								textAlign="left"
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
								field="customercontact"
								headerText="Cust Contact"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="rigcompanycontact"
								headerText="Rig Contact"
								textAlign="Left"
								width="100"
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
				) : (
					<div>No requests found</div>
				)}
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
				<RequestFilterDialog
					open={filterDialogOpen}
					onClose={() => setFilterDialogOpen(false)}
					onApply={handleFilterApply}
					requestStatusOptions={requestStatusOptions}
				/>
			</div>
		</div>
	);
};

export default Requests;
