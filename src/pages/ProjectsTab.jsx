/* eslint-disable */
// TODO Delete
// TODO Update
// TODO Create

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
import "../index.css";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ProjectEditTemplate from "../components/ProjectEditTemplate";
import { UseStateContext } from "../contexts/ContextProvider";
import { Box, Chip, IconButton } from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import ProjectFilterDialog from "../components/ProjectFilterDialog";

let gridPageSize = 8;

import {
	GetAllProjects,
	DeleteProject,
	SaveProject,
	UpdateProject,
} from "../api/worksideAPI";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
	showConfirmationDialog,
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

const ProjectsTab = () => {
	const [haveData, setHaveData] = useState(false);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);
	const [projectData, setProjectData] = useState(null);
	const { companyName } = UseStateContext();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);
	const [selectedCompanies, setSelectedCompanies] = useState(() => {
		const saved = localStorage.getItem('projectFilterSelections');
		return saved ? JSON.parse(saved) : [companyName];
	});
	const projectsGridRef = useRef(null);

	const queryClient = useQueryClient();

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
		template: (props) => <ProjectEditTemplate {...props} />,
		// template: dialogTemplate,
	};

	const toolbarOptions = ["Add", "Edit"];
	// const toolbarOptions = ["Add", "Edit", "Delete"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	// Get the project data
	const { data: projData, isLoading: isProjectsLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: GetAllProjects,
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
	});

	useEffect(() => {
		if (projData?.data) {
			let filteredData = projData.data;
			
			// Apply company filters if any are selected
			if (selectedCompanies.length > 0) {
				filteredData = projData.data.filter(project => 
					selectedCompanies.includes(project.customer)
				);
			}
			
			setProjectData(filteredData);
			setHaveData(true);
		}
	}, [projData, selectedCompanies]);

	// Define the mutation to delete the data
	const deleteProjectMutation = useMutation({
		mutationFn: async (id) => {
			const { status, data } = await DeleteProject(id);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			showSuccessDialogWithTimer("Project successfully deleted");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			showErrorDialog(`Error deleting project...${error}`);
		},
	});

	// Define the mutation to save the data
	const saveProjectMutation = useMutation({
		mutationFn: async (projectData) => {
			const { status, data } = await SaveProject(projectData);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			showSuccessDialogWithTimer("Project saved successfully:");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			showErrorDialog(`Error saving project: ${error}`);
		},
	});

	// Define the mutation to update the data
	const updateProjectMutation = useMutation({
		mutationFn: async (id, body) => {
			const { status, data } = await UpdateProject(id, body);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			showSuccessDialogWithTimer("Project updated successfully:");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			showErrorDialog(`Error updating project: ${error}`);
		},
	});

	const handleDelete = async () => {
		const deleteFlag = await showConfirmationDialog(
			"Are you sure you want to delete this project?",
		);
		if (deleteFlag === true) {
			deleteProjectMutation.mutate(selectedRecord);
		}
	};

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
			dialog.height = 600;
			dialog.width = 600;
			// Set Insert Flag
			setInsertFlag(args.requestType === "add");
			// change the header of the dialog
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit Project ${args.rowData.projectname}`
					: "Workside New Project";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
			setMessageText(`Update Project ${args.data.projectname} Details?`);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
	};

	const SaveProjectData = async () => {
		setOpenUpdateModal(false);
		if (insertFlag) {
			saveProjectMutation.mutate(currentRecord); // Trigger the mutation

			setInsertFlag(false);
		} else {
			const body = {
				area: currentRecord.area,
				customer: currentRecord.customer,
				customercontact: currentRecord.customercontact,
				rigcompany: currentRecord.rigcompany,
				projectname: currentRecord.projectname,
				description: currentRecord.description,
				projectedstartdate: currentRecord.projectedstartdate,
				actualstartdate: currentRecord.actualstartdate,
				expectedduration: currentRecord.expectedduration,
				actualduration: currentRecord.actualduration,
				status: currentRecord.status,
				statusdate: currentRecord.statusdate,
				comment: currentRecord.comment,
				latdec: currentRecord.latdec,
				longdec: currentRecord.longdec,
			};

			updateProjectMutation.mutate(currentRecord._id, body); // Trigger the mutation
		}
	};

	const rowSelectedProject = (args) => {
		if (args.data) {
			setSelectedRecord(args.data._id);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const onProjectLoad = () => {
		const gridElement = document.getElementById("projectGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 3;
		}
	};

	const handleFilterApply = (companies) => {
		setSelectedCompanies(companies);
		localStorage.setItem('projectFilterSelections', JSON.stringify(companies));
		setFilterDialogOpen(false);
	};

	const handleFilterRemove = (company) => {
		const newFilters = selectedCompanies.filter((c) => c !== company);
		setSelectedCompanies(newFilters);
		localStorage.setItem("projectFilterSelections", JSON.stringify(newFilters));

		// Update grid data immediately
		if (projData?.data) {
			let filteredData = projData.data;
			if (newFilters.length > 0) {
				filteredData = projData.data.filter((project) =>
					newFilters.includes(project.customer),
				);
			}
			setProjectData(filteredData);
		}
	};

	const handleFilterDialogOpen = () => {
		setFilterDialogOpen(true);
	};

	const handleFilterDialogClose = () => {
		setFilterDialogOpen(false);
	};

	if (isProjectsLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		// <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
		<div className=" bg-white rounded-3xl">
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

			{!isProjectsLoading && haveData && (
				<div className="div-container">
					<GridComponent
						id="projectGridElement"
						dataSource={projectData}
						actionBegin={actionBegin}
						actionComplete={actionComplete}
						allowSelection
						allowFiltering
						allowPaging
						allowResizing
						frozenColumns={2}
						filterSettings={FilterOptions}
						selectionSettings={settings}
						toolbar={toolbarOptions}
						rowSelected={rowSelectedProject}
						editSettings={editOptions}
						enablePersistence
						load={onProjectLoad}
						width="98%"
						ref={projectsGridRef}
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
								field="Area"
								headerText="Area"
								// editType="dropdownedit"
								textAlign="Left"
								width="100"
								// edit={areaSelections}
							/>
							<ColumnDirective
								field="customer"
								headerText="Customer"
								// editType="dropdownedit"
								textAlign="Left"
								width="100"
								// edit={companySelections}
							/>
							<ColumnDirective
								field="projectname"
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
								field="customercontact"
								headerText="Cust Contact"
								textAlign="Left"
								width="50"
							/>
							<ColumnDirective
								field="rigcompany"
								headerText="Rig Company"
								textAlign="left"
								width="50"
							/>
							<ColumnDirective
								field="status"
								headerText="Status"
								editType="dropdownedit"
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
								field="projectedstartdate"
								headerText="Proj Start"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyy"
								textAlign="Right"
								width="140"
							/>
							<ColumnDirective
								field="actualstartdate"
								headerText="Act Start"
								type="date"
								editType="datepickeredit"
								format="MM/dd/yyy"
								textAlign="Right"
								width="140"
							/>
							<ColumnDirective
								field="expectedduration"
								headerText="Proj Dur"
								textAlign="Right"
								width="50"
							/>
							<ColumnDirective
								field="actualduration"
								headerText="Act Dur"
								textAlign="Right"
								width="50"
							/>
							<ColumnDirective
								field="latdec"
								headerText="Latitude"
								textAlign="Right"
								width="100"
							/>
							<ColumnDirective
								field="longdec"
								headerText="Longitude"
								textAlign="Right"
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
							]}
						/>
					</GridComponent>
				</div>
			)}
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => SaveProjectData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}

			<ProjectFilterDialog
				open={filterDialogOpen}
				onClose={handleFilterDialogClose}
				onApply={handleFilterApply}
				selectedCompanies={selectedCompanies}
				allCompanies={
					projData?.data
						? [...new Set(projData.data.map((project) => project.customer))]
						: []
				}
			/>
		</div>
	);
};

export default ProjectsTab;
