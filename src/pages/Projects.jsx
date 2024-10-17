/* eslint-disable */
"use client";

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
import { useProjectContext } from "../hooks/useProjectContext";
import { Header } from "../components";
import "../index.css";
import { confirmAlert } from "react-confirm-alert";
import axios from "axios";

const apiUrl = process.env.REACT_APP_MONGO_URI;

const gridPageSize = 8;

const Projects = () => {
 	const [isLoading, setIsLoading] = useState(false);
  // const { currentColor, deleteFlag, setDeleteFlag } = useStateContext();
		const [filteredProjects, setFilteredProjects] = useState(null);
		const [firmList, setFirmList] = useState(null);
		const [insertFlag, setInsertFlag] = useState(false);
		const editOptions = {
			allowEditing: true,
			allowAdding: true,
			allowDeleting: true,
			mode: "Dialog",
		};
		const toolbarOptions = ["Add", "Edit", "Delete"];
		const { projectsData, dispatch } = useProjectContext();

	const [selectedRecord, setSelectedRecord] = useState(null);
		const settings = { mode: "Row" };
		let projectsGrid = null;

	useEffect(() => {
			const fetchProjects = async () => {
				// Set Wait Cursor
				setIsLoading(true);
				{
					const userName = "sroy@workside.com";
					const password = "Pinnacle55";
					const fetchString = `/api/user/${userName}?password=${password}`;
					const response = await axios.get(fetchString);
					window.alert(`Login... ${JSON.stringify(response.data)}`);
				}
				const response = await axios.get("/api/project");

				const json = response.data;
				window.alert(`Response... ${JSON.stringify(response)}`);
				if (response.status === 200) {
					// dispatch({ type: "GET_PROJECTS", payload: json });
					setFilteredProjects(json);
				}
				setIsLoading(false);
			};
			fetchProjects();
		}, []);
		// }, [dispatch]);

		useEffect(() => {
			const fetchFirms = async () => {
				// Set Wait Cursor
				setIsLoading(true);
				// const response = await fetch(`${apiUrl}/api/firm`);
				const response = await fetch("/api/firm");
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
		const fetchString = `/api/project/${selectedRecord}`;
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

	const actionComplete = async (args) => {
		if (!projectsGrid) return;

		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Projects";
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

				confirmAlert({
					title: "Workside Software",
					message: `Save... ${JSON.stringify(data)}`,
					buttons: [
						{
							label: "Cancel",
						},
						{
							label: "Ok",
							onClick: () => {
								// toast.success(`Success`);
							},
						},
					],
				});

				if (insertFlag === true) {
					// const response = await fetch(`${apiUrl}/api/project/`, {
					const response = await fetch("/api/project/", {
						method: "POST",
						body: JSON.stringify(data),
						headers: {
							"Content-Type": "application/json",
						},
					});

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
				handleDelete();
				setInsertFlag(false);
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
		<div className="flex-grow bg-white p-8 relative">
			{/*<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text"> */}
			<Header category="Workside" title="Projects" />
			{/* <div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start"> */}
			{/* <div className="absolute top-[100px] left-[20px] flex flex-row w-full"> */}
			<div>
				{isLoading && (
					<div className="absolute top-[50%] left-[50%]">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
					</div>
				)}
			</div>
			{!isLoading && (
				<div className="div-container">
					<GridComponent
						id="projectGridElement"
						dataSource={filteredProjects}
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
						width="80%"
						// width="1000px"
						// eslint-disable-next-line no-return-assign
						// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
						ref={(g) => (projectsGrid = g)}
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
		</div>
	);
};

export default Projects;
