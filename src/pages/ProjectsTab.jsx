/* eslint-disable */
// TODO Delete
// TODO Update
// TODO Create

import React, { useEffect, useState } from "react";
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
import "../index.css";
import ConfirmationDialog from "../components/ConfirmationDialog";
import ProjectEditTemplate from "../components/ProjectEditTemplate";

let gridPageSize = 8;

import {
	GetAllProjects,
	DeleteProject,
	SaveProject,
	UpdateProject,
} from "../api/worksideAPI";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

// let filteredProjects = null;

const ProjectsTab = () => {
	const [haveData, setHaveData] = useState(false);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);
	const [projectData, setProjectData] = useState(null);

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
	const projectsGrid = null;

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
		staleTime: 1000 * 60 * 10, // 10 minutes
		retry: 3,
	});

	useEffect(() => {
		setProjectData(projData?.data);
		setHaveData(true);
	}, [projData]);

	// Define the mutation to delete the data
	const deleteProjectMutation = useMutation({
		mutationFn: async (id) => {
			const { status, data } = await DeleteProject(id);
			if (status === 200) {
				return data;
			}
		},
		onSuccess: (data) => {
			toast.success("Project successfully deleted");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			toast.error(`Error deleting project...${error}`);
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
			toast.success("Project saved successfully:");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			toast.error(`Error saving project: ${error}`);
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
			toast.success("Project updated successfully:");
			queryClient.invalidateQueries("projects");
		},
		onError: (error) => {
			toast.error(`Error updating project: ${error}`);
		},
	});

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this project?")) {
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
					? `Edit Record of ${args.rowData.projectname}`
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

	const rowSelectedProject = () => {
		if (projectsGrid) {
			/** Get the selected row indexes */
			const selectedrowindex = projectsGrid.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(projectData[selectedrowindex]._id);
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

	return (
		<div className="flex-grow bg-white p-2 relative">
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
						ref={projectsGrid}
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
		</div>
	);
};

export default ProjectsTab;
