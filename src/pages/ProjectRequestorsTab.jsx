/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import axios from "axios";
import "../index.css";
import { toast } from "react-toastify";

// TODO Need to Add FIlter Options for Requestors
// TODO FIlter by Date, By Status
// TODO Allow primary to assign other requestors to projects

const ProjectRequestorsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [refreshFlag, setRefreshFlag] = useState(true);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const [projectList, setProjectList] = useState([]);
	const [requestorList, setRequestorList] = useState([]);
	const [assignedRequestorList, setAssignedRequestorList] = useState([]);
	const [selectList, setSelectList] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [treeData, setTreeData] = useState([]);
	const [addButtonEnabled, setAddButtonEnabled] = useState(false);
	const [requestorName, setRequestorName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [hasData, setHasData] = useState(false);

	const [showPopup, setShowPopup] = useState(false);
	const [selectedNodeData, setSelectedNodeData] = useState(null);

	const treeObj = useRef(null);

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleAddRequestor = () => {
		// TBD - Add Save Requestor to Project and Refresh Tree
		// Need To Confirm The Selected Node and Selected Requestor
		onPostData();
		setOpen(false);
	};

	const DeleteRequestor = async () => {
		setIsLoading(true);

		const id = selectedNodeData.id;
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		};

		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/projectrequestor/${id}`,
				requestOptions,
			);
			const jsonData = await response.json();
			if (response.status === 200) {
				toast.success(
					`Requestor ${jsonData.userFirstName} ${jsonData.userLastName} Deleted...`,
				);

				if (treeObj.current) {
					treeObj.current.removeNodes([jsonData._id]); // Pass the node ID to delete
				}

				// Update treeData state to exclude the deleted node
				setTreeData((prevData) =>
					prevData.filter((item) => item.id !== jsonData._id),
				);
			}
		} catch (error) {
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setIsLoading(false);
	};

	const handleDeleteRequestor = () => {
		// window.alert(
		// 	`Requestor Name: ${requestorName} Selected Node: ${selectedNodeData.text}`,
		// );
		if (requestorName.toLowerCase() === selectedNodeData.text.toLowerCase()) {
			// Strings are equal (case-insensitive)
			setErrorMsg("");
			DeleteRequestor();
			setOpen(false);
		} else {
			setErrorMsg("Requestor Name Does Not Match");
		}
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
		try {
			await axios
				.get(`${process.env.REACT_APP_MONGO_URI}/api/project/`)
				.then((res) => {
					const jsonResults = res.data;
					setProjectList(jsonResults);
				});
		} catch (error) {
			console.error(error);
		}

		// const response = await fetch(
		// 	`${process.env.REACT_APP_MONGO_URI}/api/project/`,
		// );
		// const jsonResults = await response.json();
		// setProjectList(jsonResults);
	};

	const fetchAvailableRequestors = async () => {
		axios.get(`${process.env.REACT_APP_MONGO_URI}/api/contact/`).then((res) => {
			const jsonResults = res.data;

			const result = jsonResults.filter(
				(jsonResult) =>
					jsonResult.contactclass === "CUSTOMER" ||
					// jsonResult.contactclass === "SUPPLIER" ||		// Do we need to add SUPPLIER?
					jsonResult.contactclass === "RIGCOMPANY",
			);
			const extractedData = result.map((r) => ({
				value: r._id,
				label: `${r.firstname} ${r.lastname}`,
			}));

			setSelectList(extractedData);
			setRequestorList(result);
		});
	};

	const fetchAssignedRequestors = async () => {
		axios
			.get(`${process.env.REACT_APP_MONGO_URI}/api/projectrequestor/`)
			.then((res) => {
				const jsonResults = res.data;
				setAssignedRequestorList(jsonResults);
			});
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
		fetchAvailableRequestors();
		setTreeData(merged);
		setRefreshFlag(false);
		setNeedRefreshFlag(true);
	};

	useEffect(() => {
		const GetData = async () => {
			// Set Wait Cursor
			setIsLoading(true);
			fetchProjects().then(() => {
				fetchAvailableRequestors();
				fetchAssignedRequestors();
			});
			setIsLoading(false);
		};
		GetData();
		// }, [refreshFlag]);
	}, []);

	useEffect(() => {
		const UpdateTree = async () => {
			fetchProjects().then(() => {
				fetchAvailableRequestors();
				fetchAssignedRequestors();
			});
			MergeTreeData();
			setHasData(true);
			setNeedRefreshFlag(false);
		};
		UpdateTree();
	}, [refreshFlag]);

	const fields = {
		dataSource: treeData,
		id: "id",
		text: "label",
		child: "subChild",
	};

	const handleNodeSelect = (args) => {
		setSelectedNodeData(args.nodeData);
		handleOpen();
		setShowPopup(true);
	};

	const findById = (id) => {
		return requestorList.find((item) => item._id === id);
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);
		setAddButtonEnabled(true);
		// selected.value is user_id
		// const idToFind = selected.value;
		// window.alert(
		// 	`Selected User Id: ${selected.value}\nSelected Node Id: ${selectedNodeData.id}`,
		// );
		// Search for the object with the matching id
	};

	const onPostData = async () => {
		setIsLoading(true);

		const result = findById(selectedOption);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				project_id: selectedNodeData.id,
				projectStatus: "ACTIVE",
				user_id: selectedOption,
				userFirstName: result.firstname,
				userLastName: result.lastname,
				status: "ACTIVE",
				comment: "",
			}),
		};
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/projectrequestor/`,
				requestOptions,
			);
			const jsonData = await response.json().then((data) => {
				// Define the new node data
				const newNode = {
					id: data._id, // Unique ID for the new node
					pid: selectedNodeData.id, // Parent ID for the new node
					// value: data._id,
					label: `${data.firstname} ${data.lastname}`,
				};
				if (treeObj.current !== null) {
					treeObj.current.addNodes([newNode], selectedNodeData.id);
				}
			});
			// const jsonData = await response.json();
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setIsLoading(false);
	};

	const RefreshData = () => {
		setRefreshFlag(true);
		// window.alert(`Tree Data: ${JSON.stringify(treeData)}`);
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
			<button
				className={`${needRefreshFlag ? "bg-yellow-300" : "bg-green-500"} text-black font-bold py-1 px-4 rounded mt-1 text-sm`}
				type="button"
				onClick={RefreshData}
			>
				Refresh
			</button>
			{/* <Button
				icon={<MdOutlineRefresh />}
				color="black"
				bgHoverColor="light-red"
				size="2xl"
				borderRadius="50%"
				onClick={RefreshData}
			/> */}
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			{hasData && (
				<TreeViewComponent
					fields={fields}
					style={{ fontSize: 24, fontWeight: 600 }}
					nodeSelected={handleNodeSelect}
					allowMultiSelection={false}
					// notificationSubscriptionNode={true}
					// loadOnDemand={false}
					ref={treeObj}
					// ref={(tree) => {
					// 	treeObj = tree;
					// }}
				/>
			)}
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="child-modal-title"
					aria-describedby="child-modal-description"
				>
					<Box sx={{ ...dialogStyle, width: 500 }}>
						<div className="text-xl font-bold text-center">
							<span className="text-green-500">WORK</span>SIDE
						</div>
						<p id="child-modal-description">
							{selectedNodeData && (
								<>
									{selectedNodeData.parentID === null ? (
										<>
											<p className="text-center font-bold pt-1 text-lg text-black">
												{`Add Requestor To ${selectedNodeData.text}?`}
											</p>
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
										<div>
											<p className="text-center font-semibold pt-1">
												{`Remove ${selectedNodeData.text} from Requestor List?`}
											</p>
											<div className="flex items-center justify-center">
												<input
													className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg"
													type="text"
													name="requestorName"
													placeholder="Requestor Name"
													onChange={(e) => setRequestorName(e.target.value)}
												/>
											</div>
											{errorMsg.length === 0 && (
												<p className="text-center text-sm pt-1">
													Name Entered Must Match Requestor Name
												</p>
											)}
											{errorMsg.length > 0 && (
												<p className="text-center text-sm pt-1 text-red-500">
													{errorMsg}
												</p>
											)}
										</div>
									)}
								</>
							)}
						</p>
						{selectedNodeData && (
							<div className="flex items-center justify-center">
								{selectedNodeData.parentID === null ? (
									<button
										className="bg-green-300 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
										type="button"
										disabled={!addButtonEnabled}
										onClick={handleAddRequestor}
									>
										Add Requestor
									</button>
								) : (
									<button
										className="bg-red-300 hover:bg-red-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
										type="button"
										onClick={handleDeleteRequestor}
									>
										Delete Requestor
									</button>
								)}
							</div>
						)}
					</Box>
				</Modal>
			</div>
			<div>
				{/* <div>
					<JsonDisplay data={treeData} />
				</div> */}
			</div>
		</div>
	);
};

export default ProjectRequestorsTab;
