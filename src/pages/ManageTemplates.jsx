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
import { Box, Chip, IconButton } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getRequestTemplates,
	updateRequestTemplate,
	deleteRequestTemplate,
} from "../api/worksideAPI";
import TemplateFilterDialog from "../components/TemplateFilterDialog";
import { useToast } from "../contexts/ToastContext";
import useConfirmation from "../hooks/useConfirmation";
import ConfirmationDialog from "../components/ConfirmationDialog";
import useUserStore from "../stores/UserStore";

let gridPageSize = 10;

const ManageTemplates = () => {
	const toast = useToast();
	const { confirm, ConfirmationDialog: ConfirmDialog } = useConfirmation();
	const [templateData, setTemplateData] = useState(null);
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [selectedVisibilities, setSelectedVisibilities] = useState(() => {
		const saved = localStorage.getItem("templateFilterSelections");
		return saved ? JSON.parse(saved) : ["private", "public"];
	});
	const [selectedRecord, setSelectedRecord] = useState(null);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);
	const templatesGridRef = useRef(null);
	const userId = useUserStore((state) => state.userID);
	const queryClient = useQueryClient();

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return Number.parseInt(value);
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	// Redirect if not admin
	if (accessLevel < 3) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Access Denied
					</h1>
					<p className="text-gray-600">
						You do not have permission to access this page.
					</p>
				</div>
			</div>
		);
	}

	const editOptions = {
		allowEditing: true,
		allowAdding: true,
		allowDeleting: true,
		mode: "Dialog",
	};

	const toolbarOptions = ["Add", "Edit", "Delete", "ExcelExport"];
	const settings = { mode: "Row" };

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	// Get the templates data
	const { data: templatesData, isLoading: isTemplatesLoading } = useQuery({
		queryKey: ["templates"],
		queryFn: () => getRequestTemplates(userId),
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (templatesData?.data) {
			let filteredData = templatesData.data;

			// Apply visibility filters if any are selected
			if (selectedVisibilities.length > 0) {
				filteredData = templatesData.data.filter((template) =>
					selectedVisibilities.includes(template.visibility),
				);
			}

			setTemplateData(filteredData);
		}
	}, [templatesData, selectedVisibilities]);

	// Define the mutation to delete the data
	const deleteTemplateMutation = useMutation({
		mutationFn: async (id) => {
			const { status, data } = await deleteRequestTemplate(id);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			toast.success("Template successfully deleted");
			queryClient.invalidateQueries("templates");
		},
		onError: (error) => {
			toast.error(`Error deleting template...${error}`);
		},
	});

	// Define the mutation to update the data
	const updateTemplateMutation = useMutation({
		mutationFn: async ({ id, body }) => {
			const { status, data } = await updateRequestTemplate(id, body);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			toast.success("Template updated successfully");
			queryClient.invalidateQueries("templates");
		},
		onError: (error) => {
			toast.error(`Error updating template: ${error}`);
		},
	});

	const handleDelete = async () => {
		const deleteFlag = await confirm({
			message: "Are you sure you want to delete this template?",
		});
		if (deleteFlag === true) {
			deleteTemplateMutation.mutate(selectedRecord);
		}
	};

	const actionComplete = async (args) => {
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			dialog.height = 600;
			dialog.width = 600;
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit Template ${args.rowData.name}`
					: "New Template";
		}
		if (args.requestType === "save") {
			const data = args.data;
			setMessageText(`Update Template ${args.data.name} Details?`);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
		if (args.requestType === "delete") {
			handleDelete();
		}
	};

	const SaveTemplateData = async () => {
		setOpenUpdateModal(false);
		if (currentRecord._id) {
			const body = {
				name: currentRecord.name,
				description: currentRecord.description,
				category: currentRecord.category,
				product: currentRecord.product,
				comment: currentRecord.comment,
				quantity: currentRecord.quantity,
				preferredVendorType: currentRecord.preferredVendorType,
				preferredVendor: currentRecord.preferredVendor,
				visibility: currentRecord.visibility,
			};

			updateTemplateMutation.mutate({ id: currentRecord._id, body });
		}
	};

	const rowSelectedTemplate = (args) => {
		if (args.data) {
			setSelectedRecord(args.data._id);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const onTemplateLoad = () => {
		const gridElement = document.getElementById("templateGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 2;
		}
	};

	const handleFilterApply = (visibilities) => {
		setSelectedVisibilities(visibilities);
		localStorage.setItem(
			"templateFilterSelections",
			JSON.stringify(visibilities),
		);
		setFilterDialogOpen(false);
	};

	const handleFilterRemove = (visibility) => {
		const newFilters = selectedVisibilities.filter((v) => v !== visibility);
		setSelectedVisibilities(newFilters);
		localStorage.setItem(
			"templateFilterSelections",
			JSON.stringify(newFilters),
		);
	};

	const handleFilterDialogOpen = () => {
		setFilterDialogOpen(true);
	};

	const handleFilterDialogClose = () => {
		setFilterDialogOpen(false);
	};

	if (isTemplatesLoading) {
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
					{selectedVisibilities.map((visibility) => (
						<Chip
							key={visibility}
							label={visibility.charAt(0).toUpperCase() + visibility.slice(1)}
							onDelete={() => handleFilterRemove(visibility)}
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

			{!isTemplatesLoading && templateData && (
				<div className="div-container">
					<GridComponent
						id="templateGridElement"
						dataSource={templateData}
						actionComplete={actionComplete}
						allowSelection
						allowFiltering
						allowPaging
						allowResizing
						allowExcelExport
						filterSettings={FilterOptions}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						rowSelected={rowSelectedTemplate}
						editSettings={editOptions}
						enablePersistence
						load={onTemplateLoad}
						width="98%"
						ref={templatesGridRef}
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
								field="name"
								headerText="Name"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="description"
								headerText="Description"
								textAlign="Left"
								width="200"
							/>
							<ColumnDirective
								field="category"
								headerText="Category"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="product"
								headerText="Product"
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
								field="preferredVendorType"
								headerText="Vendor Type"
								textAlign="Left"
								width="120"
							/>
							<ColumnDirective
								field="preferredVendor"
								headerText="Preferred Vendor"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="visibility"
								headerText="Visibility"
								textAlign="Left"
								width="100"
							/>
							<ColumnDirective
								field="createdBy"
								headerText="Created By"
								textAlign="Left"
								width="150"
							/>
							<ColumnDirective
								field="createdAt"
								headerText="Created At"
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
					onConfirm={() => SaveTemplateData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}

			<TemplateFilterDialog
				open={filterDialogOpen}
				onClose={handleFilterDialogClose}
				onApply={handleFilterApply}
				selectedVisibilities={selectedVisibilities}
			/>
			<ConfirmDialog />
		</div>
	);
};

export default ManageTemplates; 