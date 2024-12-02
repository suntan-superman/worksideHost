/* eslint-disable */
// TODO Delete
// TODO Update
// TODO Create

import React, { useEffect, useState } from "react";
import { DataManager, Query } from "@syncfusion/ej2-data";
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

let filteredProjects = null;

const ProjectsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [haveData, setHaveData] = useState(false);
	const [firmList, setFirmList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [currentRecord, setCurrentRecord] = useState(null);

	const editOptions = {
		allowEditing: true,
		allowAdding: true,
		allowDeleting: true,
		mode: "Dialog",
		template: (props) => <ProjectEditTemplate {...props} />,
		// template: dialogTemplate,
	};
	// const editOptions = {
	// 	allowEditing: true,
	// 	allowAdding: true,
	// 	allowDeleting: true,
	// 	mode: "Dialog",
	// 	template: ProjectEditTemplate,
	// };

	const toolbarOptions = ["Add", "Edit"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };
	const projectsGrid = null;

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);


	const fetchProjects = async () => {
		// Set Wait Cursor
		setIsLoading(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/project/`,
			);
			const jsonData = await response.json();
			setIsLoading(false);
			// window.alert(`Data Received: ${JSON.stringify(jsonData)}`);
			filteredProjects = jsonData;
			setHaveData(true);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchProjects();
	}, []);
	// }, [dispatch]);

	useEffect(() => {
		const fetchFirms = async () => {
			// Set Wait Cursor
			setIsLoading(true);
			// const response = await fetch(`${apiUrl}/api/firm`);
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/firm/`,
			);
			const jsonResults = await response.json();
			// Filter The entire List to include companies only
			const result = jsonResults.filter(
				(jsonResult) => jsonResult.type === "CUSTOMER",
			);
			setFirmList(result);
			// Set Default Cursor
			setIsLoading(false);
		};
		fetchFirms();
	}, []);

	// Set Location Selection Options
	const areaOptions = [
		{ name: "GULF COAST", nameId: "1" },
		{ name: "MID-CONTINENT", nameId: "2" },
		{ name: "WEST COAST", nameId: "3" },
		{ name: "WEST TEXAS", nameId: "4" },
	];

	const areaSelections = {
		params: {
			actionComplete: () => false,
			allowFiltering: true,
			dataSource: new DataManager(areaOptions),
			fields: { text: "name", value: "name" },
			query: new Query(),
		},
	};

	// Set Company Selection Options
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

	const handleDelete = async () => {
		// const fetchString = `${apiUrl}/api/project/${selectedRecord}`;
		const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/project/${selectedRecord}`;
		const response = await fetch(fetchString, {
			method: "DELETE",
		});
		if (response.ok) {
			// Clear form useStates
			// ResetUseStates();
			toast.success("Record Successfully Deleted...");
		}
		// setDeleteFlag(false);
		// setEmptyFields([]);
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
						: "New Project";
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
		// TODO Change API URL
		const localHost = "http://localhost:4000";
		if (insertFlag) {
			// Insert Record
			// window.alert(`Insert Project: ${JSON.stringify(currentRecord)}`);
			const response = await fetch(
				// `${localHost}/api/project/`,
				`${process.env.REACT_APP_MONGO_URI}/api/project/`,
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
				}),
			};
			const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/project/${currentRecord._id}`;
			// const fetchString = `http://localhost:4000/api/project/${currentRecord._id}`;
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

	const rowSelectedProject = () => {
		if (projectsGrid) {
			/** Get the selected row indexes */
			const selectedrowindex = projectsGrid.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(filteredProjects[selectedrowindex]._id);
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
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
			// gridInstance.pageSettings.freeze = true;
		}
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
			{!isLoading && haveData && (
				<div className="div-container">
					<GridComponent
						id="projectGridElement"
						dataSource={filteredProjects}
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
								editType="dropdownedit"
								textAlign="Left"
								width="100"
								edit={areaSelections}
							/>
							{/* <ColumnDirective field="customer" headerText="Customer" textAlign="Left" editType="dropdownedit" width="100" /> */}
							<ColumnDirective
								field="customer"
								headerText="Customer"
								editType="dropdownedit"
								textAlign="Left"
								width="100"
								edit={companySelections}
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
