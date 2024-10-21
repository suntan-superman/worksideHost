/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
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

const apiUrl = process.env.REACT_APP_MONGO_URI;

const gridPageSize = 8;
const projectList = null;
// let filteredProjects = [
// 	{
// 		_id: "6546d4df5c9a414395b1fdfd",
// 		area: "WEST COAST",
// 		customer: "CRC",
// 		customercontact: "magnew@workside.com",
// 		rigcompany: "GPS",
// 		projectname: "188-7Z",
// 		description: "Example Description",
// 		projectedstartdate: "2023-06-15T08:00:00.000Z",
// 		actualstartdate: "2023-06-15T08:00:00.000Z",
// 		expectedduration: 5,
// 		actualduration: 0,
// 		status: "COMPLETED",
// 		statusdate: "2023-06-15T08:00:00.000Z",
// 		comment: "",
// 		latdec: 35.393528,
// 		longdec: -119.043732,
// 	},
// 	{
// 		_id: "6546d4df5c9a414395b1fdfe",
// 		area: "WEST COAST",
// 		customer: "CRC",
// 		customercontact: "magnew@workside.com",
// 		rigcompany: "GPS",
// 		projectname: "288-7R",
// 		description: "Example Description",
// 		projectedstartdate: "2023-06-15T08:00:00.000Z",
// 		actualstartdate: "2023-06-15T08:00:00.000Z",
// 		expectedduration: 5,
// 		actualduration: 0,
// 		status: "PENDING",
// 		statusdate: "2023-06-15T08:00:00.000Z",
// 		comment: "",
// 		latdec: 35.393528,
// 		longdec: -119.043732,
// 	},
// 	{
// 		_id: "6546d4df5c9a414395b1fdff",
// 		area: "WEST COAST",
// 		customer: "CRC",
// 		customercontact: "magnew@workside.com",
// 		rigcompany: "GPS",
// 		projectname: "327-26Z ",
// 		description: "Example Description",
// 		projectedstartdate: "2023-06-15T08:00:00.000Z",
// 		actualstartdate: "2023-06-15T08:00:00.000Z",
// 		expectedduration: 6,
// 		actualduration: 0,
// 		status: "ACTIVE",
// 		statusdate: "2023-06-15T08:00:00.000Z",
// 		comment: "",
// 		latdec: 35.393528,
// 		longdec: -119.043732,
// 	},
// 	{
// 		_id: "6546d4df5c9a414395b1fdfc",
// 		area: "WEST COAST",
// 		customer: "CRC",
// 		customercontact: "magnew@workside.com",
// 		rigcompany: "GPS",
// 		projectname: "383-26Z Redrill",
// 		description: "Example Description",
// 		projectedstartdate: "2023-06-15T08:00:00.000Z",
// 		actualstartdate: "2023-06-15T08:00:00.000Z",
// 		expectedduration: 3,
// 		actualduration: 0,
// 		status: "ACTIVE",
// 		statusdate: "2023-06-15T08:00:00.000Z",
// 		comment: "",
// 		latdec: 35.393528,
// 		longdec: -119.043732,
// 	},
// 	{
// 		_id: "6546d4df5c9a414395b1fe00",
// 		area: "WEST COAST",
// 		customer: "CRC",
// 		customercontact: "magnew@workside.com",
// 		rigcompany: "GPS",
// 		projectname: "88-26R",
// 		description: "Example Description",
// 		projectedstartdate: "2023-06-15T08:00:00.000Z",
// 		actualstartdate: "2023-06-15T08:00:00.000Z",
// 		expectedduration: 5,
// 		actualduration: 0,
// 		status: "POSTPONED",
// 		statusdate: "2023-06-15T08:00:00.000Z",
// 		comment: "",
// 		latdec: 35.393528,
// 		longdec: -119.043732,
// 	},
// ];

const Projects = () => {
	const [isLoading, setIsLoading] = useState(true);
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
			document.getElementById("root").style.cursor = "wait";

			// This works locally
			// const response = await fetch("/api/project").then((res) => {
			// 	window.alert(`Status... ${JSON.stringify(res.status)}`);
			// 	window.alert(`Response... ${JSON.stringify(res)}`);
			// const json = response.json();
			// window.alert(`Response... ${JSON.stringify(json)}`);
			// setFilteredProjects(json);
			// window.alert(`Response... ${JSON.stringify(res)}`);
			// });
			// const json = response.json();
			// window.alert(`Response... ${JSON.stringify(response)}`);
			// setIsLoading(false);
			// const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/user/${userName}?password=${password}`;
			const fetchString = `${apiUrl}/api/project/}`;

			try {
				window.alert("Before Fetch...");
				await axios.get(fetchString).then((response) => {
					// await axios.get("/api/project").then((response) => {
					window.alert(`Response... ${JSON.stringify(response.data)}`);
					setFilteredProjects(response.data);
				window.alert("After Fetch...");
				});
			} catch (error) {
				window.alert(`Error... ${JSON.stringify(error)}`);
				console.log("error", error);
			}
			setIsLoading(false);

			// This works locally
			// const response = await fetch("/api/project");
			// const json = response.json();
			// window.alert(`Response... ${JSON.stringify(json)}`);
			// setFilteredProjects(json);
			// setIsLoading(false);

			// const strAPI = "/api/project";
			// try {
			// 	await axios.get(strAPI).then((response) => {
			// 		window.alert(`Response... ${JSON.stringify(response)}`);
			// 		// projectList = response.data;
			// 		setFilteredProjects(response.data);
			// 	});
			// } catch (error) {
			// 	console.log("error", error);
			// }

			// const response = await fetch("/api/project");
			// const json = await response.data;
			// window.alert(`Status... ${JSON.stringify(response.status)}`);
			// window.alert(`Response... ${JSON.stringify(response)}`);

			// await fetch("/api/project").then((res) => {
			// 	window.alert(`Response... ${JSON.stringify(res.data)}`);
			// 	window.alert(`Project List... ${JSON.stringify(projectList)}`);
			// 	if (projectList) setFilteredProjects(projectList);
			// 	window.alert(
			// 		`Filtered Projects... ${JSON.stringify(filteredProjects)}`,
			// 	);
			// });
			// const json = await response.json();

			// await axios.get("/api/project").then((res) => {
			// 	window.alert(`Response... ${JSON.stringify(res.data)}`);
			// 	projectList = res.data;
			// 	window.alert(`Project List... ${JSON.stringify(projectList)}`);
			// 	if (projectList) setFilteredProjects(projectList);
			// 	window.alert(
			// 		`Filtered Projects... ${JSON.stringify(filteredProjects)}`,
			// 	);
			// });
			// const response = await fetch("/api/project");
			// window.alert(`Response... ${JSON.stringify(response.data)}`);
			// const json = await response.json();

			// if (response.ok) {
			// 	// dispatch({ type: "GET_PROJECTS", payload: json });
			// 	setFilteredProjects(json);
			// }
			// Set Default Cursor
			document.getElementById("root").style.cursor = "default";
		};
		fetchProjects();
	}, []);

	// useEffect(() => {
	// 	const fetchProjects = async () => {
	// 		// Set Wait Cursor
	// 		document.getElementById("root").style.cursor = "wait";
	// 		// const response = await fetch("${apiUrl}/api/project");
	// 		const response = await fetch("/api/project");
	// 		window.alert(`Response... ${JSON.stringify(response.data)}`);
	// 		const json = await response.json();

	// 		if (response.ok) {
	// 			dispatch({ type: "GET_PROJECTS", payload: json });
	// 			setFilteredProjects(json);
	// 		}
	// 		// Set Default Cursor
	// 		document.getElementById("root").style.cursor = "default";
	// 	};
	// 	fetchProjects();
	// }, [dispatch]);

	useEffect(() => {
		const fetchFirms = async () => {
			// Set Wait Cursor
			document.getElementById("root").style.cursor = "wait";
			// const response = await fetch(`${apiUrl}/api/firm`);

			const response = await fetch("/api/firm");
			const jsonResults = await response.json();
			// Filter The entire List to include companies only
			const result = jsonResults.filter(
				(jsonResult) => jsonResult.type === "CUSTOMER",
			);
			setFirmList(result);
			// Set Default Cursor
			document.getElementById("root").style.cursor = "default";
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
			{isLoading && <div className="loader" />}
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
						services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
					/>
				</GridComponent>
			</div>
		</div>
	);
};

export default Projects;
