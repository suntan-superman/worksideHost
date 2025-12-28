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
	ExcelExport,
} from "@syncfusion/ej2-react-grids";
import RequestEditTemplate from "../components/RequestEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { UseStateContext } from "../contexts/ContextProvider";
import { Box, Chip, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import RequestFilterDialog from "../components/RequestFilterDialog";

import { GetAllRequests } from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "../contexts/ToastContext";

let gridPageSize = 10;

const RequestsTab = () => {
	const toast = useToast();
	const [haveData, setHaveData] = useState(false);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);
	const [requestData, setRequestData] = useState(null);
	const { companyName } = UseStateContext();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [selectedCompanies, setSelectedCompanies] = useState(() => {
		const saved = localStorage.getItem("requestFilterSelections");
		return saved ? JSON.parse(saved) : [companyName];
	});
	const requestsGridRef = useRef(null);

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
		template: (props) => <RequestEditTemplate {...props} />,
	};

	const toolbarOptions = ["Add", "Edit", "Delete", "ExcelExport"];
	const settings = { mode: "Row" };

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	// Get the request data
	const { data: reqData, isLoading: isRequestsLoading } = useQuery({
		queryKey: ["requests"],
		queryFn: GetAllRequests,
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (reqData?.data) {
			let filteredData = reqData.data;

			// Apply company filters if any are selected
			if (selectedCompanies.length > 0) {
				filteredData = reqData.data.filter((request) =>
					selectedCompanies.includes(request.customername),
				);
			}

			setRequestData(filteredData);
			setHaveData(true);
		}
	}, [reqData, selectedCompanies]);

	const actionComplete = async (args) => {
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			dialog.height = 600;
			dialog.width = 600;
			setInsertFlag(args.requestType === "add");
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit Request ${args.rowData.requestname}`
					: "Workside New Request";
		}
		if (args.requestType === "save") {
			const data = args.data;
			setMessageText(`Update Request ${args.data.requestname} Details?`);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
	};

	const handleFilterApply = (companies) => {
		setSelectedCompanies(companies);
		localStorage.setItem("requestFilterSelections", JSON.stringify(companies));
		setFilterDialogOpen(false);
	};

	const handleFilterRemove = (company) => {
		const newFilters = selectedCompanies.filter((c) => c !== company);
		setSelectedCompanies(newFilters);
		localStorage.setItem("requestFilterSelections", JSON.stringify(newFilters));

		if (reqData?.data) {
			let filteredData = reqData.data;
			if (newFilters.length > 0) {
				filteredData = reqData.data.filter((request) =>
					newFilters.includes(request.customername),
				);
			}
			setRequestData(filteredData);
		}
	};

	const handleFilterDialogOpen = () => {
		setFilterDialogOpen(true);
	};

	const handleFilterDialogClose = () => {
		setFilterDialogOpen(false);
	};

	const toolbarClick = (args) => {
		if (requestsGridRef && args.item.id === "requestGridElement_excelexport") {
			const excelExportProperties = {
				fileName: "worksideRequests.xlsx",
			};
			requestsGridRef.excelExport(excelExportProperties);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const onRequestLoad = () => {
		const gridElement = document.getElementById("requestGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 3;
		}
	};

	if (isRequestsLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-3xl">
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 2,
				}}
			>
				<Box
					sx={{
						display: "flex",
						gap: 1,
						flexWrap: "wrap",
						alignItems: "center",
					}}
				>
					{selectedCompanies.map((company) => (
						<Chip
							key={company}
							label={company}
							onDelete={() => handleFilterRemove(company)}
							sx={{ backgroundColor: "green", color: "white" }}
						/>
					))}
				</Box>
				<IconButton
					onClick={handleFilterDialogOpen}
					sx={{ color: "green", marginRight: "60px" }}
				>
					<FilterListIcon />
				</IconButton>
			</Box>

			{!isRequestsLoading && haveData && (
				<div className="div-container">
					<GridComponent
						id="requestGridElement"
						dataSource={requestData}
						actionComplete={actionComplete}
						allowSelection
						allowFiltering
						allowPaging
						allowResizing
						allowExcelExport
						frozenColumns={2}
						filterSettings={FilterOptions}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						toolbarClick={toolbarClick}
						editSettings={editOptions}
						enablePersistence
						load={onRequestLoad}
						width="98%"
						ref={requestsGridRef}
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
								field="requestcategory"
								headerText="Category"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="requestname"
								headerText="Request Name"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="customername"
								headerText="Customer"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="projectname"
								headerText="Project"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="rigcompany"
								headerText="Rig Company"
								textAlign="Left"
								width="150"
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
								textAlign="Left"
								width="120"
							/>
							<ColumnDirective
								field="vendorName"
								headerText="Vendor"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="status"
								headerText="Status"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="datetimerequested"
								headerText="Requested Date"
								type="datetime"
								format="MM/dd/yyyy HH:mm"
								textAlign="Right"
								width="180"
							/>
							<ColumnDirective
								field="creationdate"
								headerText="Created Date"
								type="date"
								format="MM/dd/yyyy"
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
			)}
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => setOpenUpdateModal(false)}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}

			<RequestFilterDialog
				open={filterDialogOpen}
				onClose={handleFilterDialogClose}
				onApply={handleFilterApply}
				selectedCompanies={selectedCompanies}
				allCompanies={
					reqData?.data
						? [...new Set(reqData.data.map((request) => request.customername))]
						: []
				}
			/>
		</div>
	);
};

export default RequestsTab; 