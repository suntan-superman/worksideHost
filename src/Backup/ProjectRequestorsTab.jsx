/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import Button from "@mui/material/Button";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import axios from "axios";
// import { ContextMenuComponent } from "@syncfusion/ej2-react-popups";
import "../index.css";
// import { Merge } from "@mui/icons-material";
import JsonDisplay from "./JsonDisplay";
// import { expanded } from "@syncfusion/ej2-treegrid";

const ProjectRequestorsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [projectList, setProjectList] = useState([]);
	const [requestorList, setRequestorList] = useState([]);
	const [assignedRequestorList, setAssignedRequestorList] = useState([]);
	const [selectList, setSelectList] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [treeData, setTreeData] = useState([]);

	const [showPopup, setShowPopup] = useState(false);
	const [selectedNodeData, setSelectedNodeData] = useState(null);

	let treeInstance = useRef(null);

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const dialogStyle = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 400,
		bgcolor: "background.paper",
		border: "2px solid #000",
		boxShadow: 24,
		pt: 2,
		px: 4,
		pb: 3,
	};

	const fetchProjects = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/project/`,
		);
		const jsonResults = await response.json();
		// Filter The entire List to include companies only
		// const result = jsonResults.filter(
		// 	(jsonResult) => jsonResult.type === "CUSTOMER",
		// );
		setProjectList(jsonResults);
	};

	const fetchAvailableRequestors = async () => {
		axios.get(`${process.env.REACT_APP_MONGO_URI}/api/contact/`).then((res) => {
			const jsonResults = res.data;

			const result = jsonResults.filter(
				(jsonResult) =>
					jsonResult.contactclass === "CUSTOMER" ||
					jsonResult.contactclass === "RIGCOMPANY",
			);
			const extractedData = result.map((r) => ({
				value: r._id,
				label: `${r.firstname} ${r.lastname}`,
			}));

			setSelectList(extractedData);
			setRequestorList(result);
		});

		// try {
		// 	const response = await fetch(
		// 		`${process.env.REACT_APP_MONGO_URI}/api/contact/`,
		// 	).then((res) => {
		// 		window.alert(`Res: ${JSON.stringify(res)}`);
		// 	});
		// 	const jsonResults = await response.json();
		// 	// Filter The entire List to include customers or rig company personnel only
		// 	const result = jsonResults.filter(
		// 		(jsonResult) =>
		// 			jsonResult.type === "CUSTOMER" || jsonResult.type === "RIGCOMPANY",
		// 	);
		// 	window.alert(`Result: ${result}`);
		// 	const extractedData = result.map((r) => ({
		// 		value: r._id,
		// 		label: `${r.firstname} ${r.lastname}`,
		// 	}));

		// 	setSelectList(extractedData);
		// 	setRequestorList(result);
		// } catch (error) {
		// 	window.alert(`Error: ${error}`);
		// }
	};

	// const fetchAvailableRequestors = async () => {
	// 	const response = await fetch(
	// 		`${process.env.REACT_APP_MONGO_URI}/api/contact/`,
	// 	);
	// 	window.alert(`Response: ${response}`);
	// 	const jsonResults = await response.json();
	// 	// Filter The entire List to include customers or rig company personnel only
	// 	const result = jsonResults.filter(
	// 		(jsonResult) =>
	// 			jsonResult.type === "CUSTOMER" || jsonResult.type === "RIGCOMPANY",
	// 	);
	// 	const extractedData = result.map((r) => ({
	// 		value: r._id,
	// 		label: `${r.firstname} ${r.lastname}`,
	// 		// firm: r.firm,
	// 	}));

	// 	setSelectList(extractedData);
	// 	window.alert(`Requestors: ${JSON.stringify(extractedData}`);
	// 	setRequestorList(result);
	// };

	const fetchAssignedRequestors = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/projectrequestor/`,
		);
		const jsonResults = await response.json();
		// Filter The entire List to include customers or rig company personnel only
		// const result = jsonResults.filter(
		// 	(jsonResult) =>
		// 		jsonResult.type === "CUSTOMER" || jsonResult.type === "RIGCOMPANY",
		// );
		setAssignedRequestorList(jsonResults);
		// window.alert("Assigned Requestors:", jsonResults);
		// MergeTreeData();
	};

	const MergeTreeData = () => {
		const updatedAssignedRequestors = assignedRequestorList.map(
			(requestor) => ({
				...requestor,
				label: `${requestor.userFirstName} ${requestor.userLastName}`,
				text: `${requestor.userFirstName} ${requestor.userLastName}`,
				id: requestor._id,
				expanded: true,
			}),
		);

		const merged = projectList.map((project) => ({
			...project,
			id: project._id,
			label: project.projectname,
			text: project.projectname,
			expanded: true,
			subChild: updatedAssignedRequestors.filter(
				(requestor) => requestor.project_id === project._id,
			),
		}));
		setTreeData(merged);
		fetchAvailableRequestors();
	};

	useEffect(() => {
		const GetData = async () => {
			// Set Wait Cursor
			setIsLoading(true);
			fetchProjects().then(() => {
				// fetchAvailableRequestors();
				fetchAssignedRequestors();
			});
			setIsLoading(false);
		};
		GetData();
	}, []);

	const fields = {
		dataSource: treeData,
		id: "id",
		text: "label",
		child: "subChild",
	};

	const handleNodeSelect = (args) => {
		// Access the selected node data
		// window.alert(`NodeSelect Args:${JSON.stringify(args)}`);
		// const selectedNode = args.nodeData;
		setSelectedNodeData(args.nodeData);
		handleOpen();
		setShowPopup(true);
		window.alert(`Selected Node:${JSON.stringify(selectedNodeData)}`);
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);
		window.alert(`Selected Option:${selected.value}`);
	};

	// const handleNodeClick = (args) => {
	// const Pid = args.currentElement.parents("li").attr("id");

	// const id = args.currentElement.attr("id");

	// const text = args.currentElement[0].textContent;

	// window.alert(`Parent id :${Pid} id :${id} text :${text}`);
	// 	setSelectedNodeData(args.nodeData);
	// 	handleOpen();
	// 	setShowPopup(true);
	// };

	// const ClosePopUp = () => {
	// 	setShowPopup(false);
	// };

	// const dummyData = [
	// 	{
	// 		id: 1,
	// 		name: "Project A",
	// 		expanded: true,
	// 		users: [
	// 			{ id: 101, name: "User A1" },
	// 			{ id: 102, name: "User A2" },
	// 			{ id: 103, name: "User A3" },
	// 		],
	// 	},
	// 	{
	// 		id: 2,
	// 		name: "Project B",
	// 		expanded: true,
	// 		users: [
	// 			{ id: 201, name: "User B1" },
	// 			{ id: 202, name: "User B2" },
	// 			{ id: 203, name: "User B3" },
	// 		],
	// 	},
	// 	{
	// 		id: 3,
	// 		name: "Project C",
	// 		expanded: true,
	// 		users: [
	// 			{ id: 301, name: "User C1" },
	// 			{ id: 302, name: "User C2" },
	// 			{ id: 303, name: "User C3" },
	// 		],
	// 	},
	// ];

	// const dummyFields = {
	// 	dataSource: dummyData,
	// 	id: "id",
	// 	text: "name",
	// 	child: "users",
	// };

	return (
		<div className="flex-grow bg-white p-8 relative">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			{/* <TreeViewComponent
				fields={dummyFields}
				style={{ fontSize: 20, fontWeight: 600 }}
				nodeSelected={(args) => {
					window.alert("Selected Node:", args.nodeData);
				}}
			/> */}
			<TreeViewComponent
				fields={fields}
				style={{ fontSize: 20, fontWeight: 600 }}
				// nodeSelecting={handleNodeSelect}
				nodeSelected={handleNodeSelect}
				// nodeClicked={handleNodeClick}
				// allowEditing={true}
				allowMultiSelection={false}
				// showCheckBox={true}
				ref={(tree) => {
					treeInstance = tree;
				}}
			/>
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="child-modal-title"
					aria-describedby="child-modal-description"
				>
					<Box sx={{ ...dialogStyle, width: 400 }}>
						<div className="text-lg font-bold text-center">
							<span className="text-green-500">WORK</span>SIDE
						</div>
						<p id="child-modal-description">
							{selectedNodeData && (
								<>
									{selectedNodeData.parentID === null ? (
										<>
											{`Text: ${selectedNodeData.text}`}
											<br />
											{`Label: ${selectedNodeData.label}`}
											<br />
											{`Add Requestor To ${selectedNodeData.text}?`}
											<Select
												className="basic-single"
												classNamePrefix="select"
												defaultValue={selectedOption}
												isDisabled={false}
												onChange={handleSelectionChange}
												name="requestor"
												options={selectList}
											/>
										</>
									) : (
										<>
											{`Text: ${selectedNodeData.text}`}
											<br />
											{`Label: ${selectedNodeData.label}`}
										</>
									)}
								</>
							)}
						</p>
						<div className="flex items-center justify-center">
							<button
								className="bg-green-300 hover:bg-green-700 text-white font-bold py-1 px-4 rounded mt-3"
								type="button"
								onClick={handleClose}
							>
								Close
							</button>
						</div>
					</Box>
				</Modal>
			</div>
			<div>
				<button
					className="bg-green-300 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					type="button"
					onClick={MergeTreeData}
				>
					Merge Data
				</button>
				{/* <div>
					<JsonDisplay data={treeData} />
				</div> */}
			</div>
		</div>
	);
};

export default ProjectRequestorsTab;
