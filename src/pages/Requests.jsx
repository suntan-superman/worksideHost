/* eslint-disable */
import React, {
	useEffect,
	useState,
	useRef,
	useCallback,
	useMemo,
} from "react";
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

import {
	GetRequestsByCustomer,
	GetProjectIDByNameAndCustomer,
	GetVendorIDByName,
	GetAllSupplierGroupData,
	GetRequestBidListCompanies,
	UpdateRequestBidListUsers,
	UpdateRequestBidListCompanies,
} from "../api/worksideAPI";
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

import FilterListIcon from "@mui/icons-material/FilterList";
import {
	Chip,
	IconButton,
	Box,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";
import RequestFilterDialog from "../components/RequestFilterDialog";

import axios from "axios";

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

function getNextWholeHour() {
	const now = new Date();
	const nextHour = new Date(now);
	nextHour.setHours(now.getHours() + 1);
	nextHour.setMinutes(0);
	nextHour.setSeconds(0);
	nextHour.setMilliseconds(0);
	return nextHour;
}

function getEmailAddresses(data) {
	return data
		.map((item) => {
			const match = item.label.match(/\(([^)]+)\)/);
			return match ? match[1] : null;
		})
		.filter(Boolean);
}

function formatEmailList(emailList) {
	return { bidListUsers: emailList };
}

function getUsersByCategory(category, dataset) {
	let users = [];
	for (const supplier of dataset) {
		if (supplier.children && Array.isArray(supplier.children)) {
			for (const group of supplier.children) {
				if (group.children && Array.isArray(group.children)) {
					const hasMatchingCategory = group.children.some((child) => {
						if (
							child.type === "group-category" &&
							child.children &&
							Array.isArray(child.children)
						) {
							return child.children.some(
								(cat) => cat.type === "category" && cat.label === category,
							);
						}
						return false;
					});

					if (hasMatchingCategory) {
						const userNode = group.children.find(
							(child) =>
								child.type === "group-user" &&
								child.children &&
								Array.isArray(child.children),
						);
						if (userNode) {
							const matchedUsers = userNode.children.filter(
								(user) => user.type === "user",
							);
							users = users.concat(matchedUsers);
						}
					}
				}
			}
		}
	}
	return users;
}

function getUsersBySupplierAndCategory(supplierId, categoryLabel, dataset) {
	const supplier = dataset.find((item) => item.id === supplierId);
	if (!supplier || !supplier.children) return [];

	for (const group of supplier.children) {
		if (!group.children) continue;

		const hasMatchingCategory = group.children.some((child) => {
			if (child.type === "group-category" && Array.isArray(child.children)) {
				return child.children.some(
					(cat) => cat.type === "category" && cat.label === categoryLabel,
				);
			}
			return false;
		});

		if (hasMatchingCategory) {
			const groupUser = group.children.find(
				(child) => child.type === "group-user" && Array.isArray(child.children),
			);
			if (groupUser) {
				return groupUser.children.filter((user) => user.type === "user");
			}
		}
	}
	return [];
}

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
		const saved = localStorage.getItem("requestFilterSelections");
		return saved ? JSON.parse(saved) : [];
	});
	const [dateRangeFilter, setDateRangeFilter] = useState("all");
	const [filteredRequestList, setFilteredRequestList] = useState(null);

		useEffect(() => {
			const numGridRows = Number(localStorage.getItem("numGridRows"));
			if (numGridRows) gridPageSize = numGridRows;

			const companyName = localStorage.getItem("companyName");
			clientName = companyName;
			setCompanyName(companyName);

			const savedFilters = localStorage.getItem("requestFilterSelections");
			if (savedFilters) {
				const filters = JSON.parse(savedFilters);
				setActiveFilters(filters);
			}
		}, []);

	const {
		data: reqData,
		isError: reqError,
		isLoading: reqLoading,
		isSuccess: isReqSuccess,
	} = useQuery({
		queryKey: ["requests"],
		queryFn: async () => {
			const res = await GetRequestsByCustomer(clientName);
			return res;
		},
		refetchInterval: 1000 * 10,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 60 * 24,
		retry: 3,
	});

	const GetAccessLevel = () => {
		const value = Number(localStorage.getItem("accessLevel"));
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	function removeQuotes(str) {
		return str.replace(/"/g, "");
	}

	const GetUserId = () => {
		const value = localStorage.getItem("userID");
		if (value) {
			const userId = removeQuotes(value);
			return userId;
		}
		return "";
	};

	const userId = GetUserId();

	const onRequestLoad = () => {
		const gridElement = document.getElementById("requestGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
		}
	};

	const filterRequestsByDateRange = useCallback((requests, range) => {
		if (!requests) return [];

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		const startOfWeek = new Date(today);
		startOfWeek.setDate(today.getDate() - today.getDay());

		const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

		return requests.filter((request) => {
			const requestDate = new Date(request.datetimerequested);
			requestDate.setHours(0, 0, 0, 0);

			switch (range) {
				case "today":
					return requestDate.getTime() === today.getTime();
				case "tomorrow":
					return requestDate.getTime() === tomorrow.getTime();
				case "thisWeek":
					return requestDate >= startOfWeek && requestDate <= today;
				case "thisMonth":
					return requestDate >= startOfMonth && requestDate <= today;
				default:
					return true;
			}
		});
	}, []);

	useEffect(() => {
		if (reqData) {
			const data = reqData?.data;
			if (data) {
				setRequestList(data);
				const filteredData = filterRequestsByDateRange(data, dateRangeFilter);
				setFilteredRequestList(filteredData);
			}
		}
	}, [reqData, dateRangeFilter, filterRequestsByDateRange]);

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

	const dateRangeOptions = [
		{ value: "all", label: "All Time" },
		{ value: "today", label: "Today" },
		{ value: "tomorrow", label: "Tomorrow" },
		{ value: "thisWeek", label: "This Week" },
		{ value: "thisMonth", label: "This Month" },
	];

	const handleDateRangeChange = (event) => {
		setDateRangeFilter(event.target.value);
	};

	if (reqError) {
		console.log(`Error: ${reqError}`);
	}

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
			setSelectedRecord(args.data._id);
		}
	};

	const gridTemplate = (props) => (
		<div>
			<button
				type="button"
				style={{
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
		if (args.data.status === "SSR-REQ") {
			args.row.style.backgroundColor = "yellow";
		}
		if (args.data.status === "SSR-ACCEPTED") {
			args.row.style.backgroundColor = "#22C55E";
		}
	};

	const actionBegin = (args) => {
		if (args.requestType === "save" && args.form) {
			// Handle form validation if needed
		}
	};

	const GetProjectID = async (projectName) => {
		const projectID = await GetProjectIDByNameAndCustomer(
			projectName,
			clientName,
		);
		return projectID?.data?.projectId ? projectID.data.projectId : "";
	};

	const GetVendorID = async (vendorName) => {
		const vendorID = await GetVendorIDByName(vendorName);
		return vendorID?.data?.vendorId ? vendorID.data.vendorId : "";
	};

	const SendRequestEmail = async (emailList) => {
		if (!emailList || emailList.length === 0) {
			await showWarningDialog("No email addresses provided");
			return;
		}

		const strAPI = `${process.env.REACT_APP_MONGO_URI}/api/email/`;

		try {
			await Promise.all(
				emailList.map((emailAddress) =>
					axios.post(strAPI, {
						emailAddress: emailAddress,
						emailSubject: "Workside Request Notification",
						emailReqDateTime: new Date(),
						emailMessage:
							"Please review the Workside request and respond accordingly!",
					}),
				),
			);

			await showSuccessDialogWithTimer("Suppliers Notified Via Email");
		} catch (error) {
			console.error("Error sending emails:", error);
			await showErrorDialog(`Error Sending Email: ${error.message}`);
		}
	};

	const actionComplete = async (args) => {
		console.log("actionComplete - args:", args);
		
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			setInsertFlag(args.requestType === "add");
			
			// Get the actual record data from the grid
			const recordData = args.rowData;
			console.log("Editing record data:", recordData);
			
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit Request: ${recordData.projectname} ${recordData.requestname}`
					: "Workside New Request";
		}
		if (args.requestType === "save") {
			// Get the actual record data from the grid
			const recordData = args.rowData;
			console.log("Saving record data:", recordData);

			// Prepare the data with all required fields
			const requestData = {
				...args.data,
				_id: recordData._id, // Ensure we have the correct _id
				requestorid: userId || "",
				categoryname: args.data.requestcategory,
				comments: args.data.comments || args.data.comment || "",
				customercontact: args.data.customercontact || "",
				rigcompanycontact: args.data.rigcompanycontact || "",
				project_id: await GetProjectID(args.data.projectname),
				ssrVendorName:
					args.data.vendorType === "SSR" ? args.data.vendorName : "",
				ssrVendorId:
					args.data.vendorType === "SSR"
						? await GetVendorID(args.data.vendorName)
						: "",
				creationdate: args.data.creationdate || new Date(),
				datetimerequested: args.data.datetimerequested || getNextWholeHour(),
				statusdate: args.data.statusdate || new Date(),
				status: args.data.status || "OPEN",
				vendortype: args.data.vendortype || "MSA",
				quantity: args.data.quantity || 1,
			};

			console.log("Prepared request data:", requestData);
			setMessageText(`Update Request ${requestData.requestname} Details?`);
			setCurrentRecord(requestData);
			setOpenUpdateModal(true);
		}
	};

	const SaveRequestData = async (requestData) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/request/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestData),
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			if (result.data) {
				try {
					const supplierGroupData = await GetAllSupplierGroupData();
					let userDistList = [];

					if (requestData.vendortype !== "SSR") {
						userDistList = getUsersByCategory(
							requestData.requestcategory,
							supplierGroupData?.data,
						);
					} else {
						userDistList = getUsersBySupplierAndCategory(
							requestData.vendorName,
							requestData.requestcategory,
							supplierGroupData?.data,
						);
					}
					const emailAddresses = getEmailAddresses(userDistList);
					const emailList = formatEmailList(emailAddresses);

					await UpdateRequestBidListUsers(result.data._id, emailList);

					if (emailAddresses.length > 0) {
						const bidListCompaniesResponse =
							await GetRequestBidListCompanies(emailAddresses);

						if (
							bidListCompaniesResponse?.data &&
							Array.isArray(bidListCompaniesResponse.data)
						) {
							const bidList = {
								bidList: bidListCompaniesResponse.data.map((company) => ({
									companyId: company.companyId,
									companyName: company.companyName,
								})),
							};

							await UpdateRequestBidListCompanies(result.data._id, bidList);
						}

						await SendRequestEmail(emailAddresses);
					}

					await showSuccessDialogWithTimer("Request saved successfully");
					setOpenUpdateModal(false);
					queryClient.invalidateQueries(["requests"]);
				} catch (error) {
					console.error("Error updating bid lists:", error);
					await showErrorDialog(`Error updating bid lists: ${error.message}`);
					setOpenUpdateModal(false);
				}
			}
		} catch (error) {
			console.error("Error saving request:", error);
			await showErrorDialog(`Error saving request: ${error.message}`);
			setOpenUpdateModal(false);
		}
	};

	const handleFilterApply = (filters) => {
		console.log("handleFilterApply - Received filters:", filters);
		setActiveFilters(filters);
		localStorage.setItem("requestFilterSelections", JSON.stringify(filters));
		setFilterDialogOpen(false);

		// Apply filters to the grid
		if (requestGridRef.current && reqData?.data) {
			const grid = requestGridRef.current;
			console.log("handleFilterApply - Grid reference:", grid);
			console.log("handleFilterApply - Current grid data:", reqData.data);

			grid.clearFiltering();
			console.log("handleFilterApply - Cleared existing filters");

			if (filters.length > 0) {
				const filterObject = {
					columns: filters.map((status) => ({
						field: "status",
						matchCase: false,
						operator: "equal",
						predicate: "or",
						value: status,
					})),
				};
				console.log(
					"handleFilterApply - Applying filter object:",
					filterObject,
				);
				grid.filterSettings = filterObject;
				grid.dataBind();
				console.log("handleFilterApply - Applied filters and bound data");
			}
		} else {
			console.log("handleFilterApply - Grid ref or data not available:", {
				hasGridRef: !!requestGridRef.current,
				hasData: !!reqData?.data,
			});
		}
	};

	const handleRemoveFilter = (filterToRemove) => {
		console.log("handleRemoveFilter - Removing filter:", filterToRemove);
		const newFilters = activeFilters.filter(
			(filter) => filter !== filterToRemove,
		);
		console.log("handleRemoveFilter - New filters:", newFilters);
		setActiveFilters(newFilters);
		localStorage.setItem("requestFilterSelections", JSON.stringify(newFilters));

		if (requestGridRef.current) {
			// Update grid filters
			const grid = requestGridRef.current;
			console.log("handleRemoveFilter - Grid reference:", grid);
			grid.clearFiltering();
			console.log("handleRemoveFilter - Cleared existing filters");

			if (newFilters.length > 0) {
				const filterObject = {
					columns: newFilters.map((status) => ({
						field: "status",
						matchCase: false,
						operator: "equal",
						predicate: "or",
						value: status,
					})),
				};
				console.log(
					"handleRemoveFilter - Applying filter object:",
					filterObject,
				);
				grid.filterSettings = filterObject;
				grid.dataBind();
				console.log("handleRemoveFilter - Applied filters and bound data");
			} else {
				console.log("handleRemoveFilter - No filters to apply");
			}
		} else {
			console.log("handleRemoveFilter - Grid ref not available");
		}
	};

	if (reqLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
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
						gap: 2,
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
					<FormControl sx={{ minWidth: 150, mr: 2 }}>
						<InputLabel
							sx={{
								color: "#2f8842",
								"&.Mui-focused": {
									color: "#2f8842",
								},
								"&.MuiInputLabel-shrink": {
									color: "#2f8842",
								},
							}}
						>
							Date Range
						</InputLabel>
						<Select
							value={dateRangeFilter}
							label="Date Range"
							onChange={handleDateRangeChange}
							sx={{
								height: 40,
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2f8842",
								},
								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2f8842",
								},
								"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2f8842",
								},
								"& .MuiSelect-icon": {
									color: "#2f8842",
								},
							}}
						>
							{dateRangeOptions.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<IconButton
						onClick={() => setFilterDialogOpen(true)}
						sx={{ color: "green", marginRight: "60px" }}
					>
						<FilterListIcon />
					</IconButton>
				</Box>
				<GridComponent
					id="requestGridElement"
					dataSource={filteredRequestList || reqData?.data}
					allowSelection
					allowFiltering
					allowPaging
					allowResizing
					allowExcelExport
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
					editSettings={editOptions}
					enablePersistence
					load={onRequestLoad}
					width="95%"
					ref={requestGridRef}
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
			</div>
			<div>
				{showDialog && (
					<RequestInfoModal
						recordID={selectedRecord}
						open={showDialog}
						onClose={() => setShowDialog(false)}
					/>
				)}
				{openUpdateModal && (
					<ConfirmationDialog
						open={openUpdateModal}
						message={messageText}
						onConfirm={() => SaveRequestData(currentRecord)}
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
