/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Select from "react-select";
import Modal from "@mui/material/Modal";
import "../index.css";
import useUserStore from "../stores/UserStore";

import { GetAllRigCompanies, GetRigs } from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

import {
	showConfirmationDialog,
	showErrorDialog,
	showWarningDialog,
	showSuccessDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

// TODO Need to Add FIlter Options for Rigs
// TODO FIlter by Area, Company

/**
 * RigsTab Component
 *
 * This component is responsible for managing and displaying a hierarchical tree structure
 * of rig companies and their associated rigs. It allows users to add or delete rigs
 * within a selected rig company and provides a modal dialog for user interactions.
 *
 * Features:
 * - Fetches rig companies and rigs data using React Query.
 * - Merges rig companies and rigs into a hierarchical tree structure.
 * - Allows adding new rigs to a selected rig company.
 * - Allows deleting existing rigs from the tree structure.
 * - Displays a modal dialog for adding or deleting rigs.
 * - Provides a refresh button to reload and merge tree data.
 *
 * State Variables:
 * - `isLoading` (boolean): Indicates whether a request is in progress.
 * - `refreshFlag` (boolean): Used to trigger data refresh.
 * - `rigCompanyList` (array): List of rig companies fetched from the API.
 * - `rigList` (array): List of rigs fetched from the API.
 * - `selectedOption` (string): Selected rig classification option.
 * - `treeData` (array): Hierarchical tree data structure for display.
 * - `addButtonEnabled` (boolean): Indicates whether the "Add Rig" button is enabled.
 * - `rigName` (string): Name of the rig to be added or deleted.
 * - `rigDescription` (string): Description of the rig to be added.
 * - `errorMsg` (string): Error message for validation or API errors.
 * - `hasData` (boolean): Indicates whether data has been successfully fetched.
 * - `accessLevel` (number): User's access level for enabling/disabling actions.
 * - `showPopup` (boolean): Controls the visibility of the popup.
 * - `selectedNodeData` (object): Data of the currently selected tree node.
 * - `open` (boolean): Controls the visibility of the modal dialog.
 *
 * Refs:
 * - `treeObj` (ref): Reference to the TreeViewComponent instance for programmatic manipulation.
 *
 * Functions:
 * - `MergeTreeData`: Merges rig companies and rigs into a hierarchical tree structure.
 * - `handleOpen`: Opens the modal dialog.
 * - `handleAddRig`: Handles adding a new rig to the selected rig company.
 * - `DeleteRig`: Deletes a rig from the API and updates the tree structure.
 * - `handleDeleteRig`: Validates and deletes a rig based on user input.
 * - `handleClose`: Closes the modal dialog.
 * - `validateData`: Validates the input fields for adding a rig.
 * - `handleSelectionChange`: Handles changes in the rig classification dropdown.
 * - `onPostData`: Sends a POST request to add a new rig to the API.
 * - `RefreshData`: Refreshes and merges the tree data.
 * - `handleNodeSelect`: Handles the selection of a tree node and opens the modal dialog.
 *
 * Props:
 * None
 *
 * Dependencies:
 * - React Query for data fetching.
 * - TreeViewComponent for displaying the hierarchical tree structure.
 * - Modal and Box from Material-UI for the modal dialog.
 * - Select from react-select for dropdown selection.
 *
 * @component
 */
const RigsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [refreshFlag, setRefreshFlag] = useState(true);
	const [rigCompanyList, setRigCompanyList] = useState([]);
	const [rigList, setRigList] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [treeData, setTreeData] = useState([]);
	const [addButtonEnabled, setAddButtonEnabled] = useState(false);
	const [rigName, setRigName] = useState("");
	const [rigDescription, setRigDescription] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [hasData, setHasData] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);

	const [showPopup, setShowPopup] = useState(false);
	const [selectedNodeData, setSelectedNodeData] = useState(null);

	const treeObj = useRef(null);

	const [open, setOpen] = useState(false);

	// Get the Rig Companies
	const { data: rigCompanyData } = useQuery({
		queryKey: ["rigCompanies"],
		queryFn: () => GetAllRigCompanies(),
		refetchInterval: 1000 * 60 * 2, // 2 Minutes
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		// staleTime: 1000 * 60 * 60 * 24, // 1 Day
		retry: 3,
	});

	const { data: rigsData } = useQuery({
		queryKey: ["rigs"],
		queryFn: () => GetRigs(),
		refetchInterval: 1000 * 60 * 2, // 2 Minutes
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		// staleTime: 1000 * 60 * 60 * 24, // 1 Day
		retry: 3,
	});

	useEffect(() => {
		if (rigCompanyData) {
			const { data } = rigCompanyData;
			// console.log(`API Rig Company Data: ${JSON.stringify(data, null, 2)}`);
			setRigCompanyList(data);
		}
		if (rigsData) {
			const { data } = rigsData;
			// console.log(`API Rig Data: ${JSON.stringify(data, null, 2)}`);
			setRigList(data);
		}
		if (rigCompanyData && rigsData) {
			MergeTreeData();
			setHasData(true);
		}
	}, [rigCompanyData, rigsData]);

	// const fetchRigCompanies = async () => {
	// 	try {
	// 		await axios
	// 			.get(`${process.env.REACT_APP_MONGO_URI}/api/firm/`)
	// 			.then((res) => {
	// 				const jsonResults = res.data;
	// 				const result = jsonResults.filter(
	// 					(jsonResult) => jsonResult.type === "RIGCOMPANY",
	// 				);
	// 				// console.log(`Rig Company List: ${JSON.stringify(result, null, 2)}`);
	// 				setRigCompanyList(result);
	// 			});
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// };

	// const fetchRigs = async () => {
	// 	axios.get(`${process.env.REACT_APP_MONGO_URI}/api/rig/`).then((res) => {
	// 		const jsonResults = res.data;
	// 		// console.log(`Rig List: ${JSON.stringify(jsonResults, null, 2)}`);
	// 		setRigList(jsonResults);
	// 	});
	// };

	// const GetData = async () => {
	// 	// setIsLoading(true);
	// 	fetchRigCompanies().then(() => {
	// 		fetchRigs().then(() => {});
	// 	});
	// 	MergeTreeData();
	// 	setHasData(true);
	// 	// setIsLoading(false);
	// };

	// useEffect(() => {
	// 	GetData();
	// }, []);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleAddRig = () => {
		onPostData();
		MergeTreeData();
		setOpen(false);
	};

	const DeleteRig = async () => {
		const id = selectedNodeData.id;
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		};
		setErrorMsg("");

		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/rig/${id}`,
				requestOptions,
			);
			const jsonData = await response.json();
			if (response.status === 200) {
				showSuccessDialogWithTimer(`Rig ${jsonData.rigname} Deleted...`);

				if (treeObj.current) {
					treeObj.current.removeNodes([jsonData._id]); // Pass the node ID to delete
				}

				// Update treeData state to exclude the deleted node
				setTreeData((prevData) =>
					prevData.filter((item) => item.id !== jsonData._id),
				);
			}
		} catch (error) {
			showErrorDialog(`Error: ${error}`);
			console.error(error);
		}
	};

	const handleDeleteRig = () => {
		if (rigName.toLowerCase() === selectedNodeData.text.toLowerCase()) {
			DeleteRig();
			setErrorMsg("");
			MergeTreeData();
			setOpen(false);
		} else {
			setErrorMsg("Rig Name Does Not Match");
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

	const MergeTreeData = () => {
		const updatedRigs = rigList.map((rigs) => ({
			...rigs,
			id: rigs._id.toString(),
			label: rigs.rigname,
			text: rigs.rigname,
			expanded: true,
		}));

		const merged = rigCompanyList.map((rigCompany) => ({
			...rigCompany,
			id: rigCompany._id.toString(),
			label: rigCompany.name,
			text: rigCompany.name,
			expanded: true,
			subChild: updatedRigs.filter(
				(rigs) => rigs.rigcompanyid === rigCompany._id.toString(),
			),
		}));
		setTreeData(merged);
	};

	// useEffect(() => {
	// 	GetData();
	// }, [refreshFlag]);

	const selectList = [
		{ value: "MAJOR", label: "MAJOR" },
		{ value: "MINOR", label: "MINOR" },
		{ value: "DRILLING-S", label: "DRILLING-S" },
		{ value: "DRILLING-D", label: "DRILLING-D" },
		{ value: "DRILLING-T", label: "DRILLING-T" },
	];

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

	const validateData = () => {
		if (rigName === "") {
			setErrorMsg("Rig Name is Required");
			return false;
		}
		if (rigDescription === "") {
			setErrorMsg("Rig Description is Required");
			return false;
		}
		if (selectedOption === null) {
			setErrorMsg("Rig Class is Required");
			return false;
		}
		return true;
	};

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);
		setAddButtonEnabled(validateData());
	};

	const onPostData = async () => {
		setIsLoading(true);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				rigcompanyid: selectedNodeData.id,
				rigcompanyname: selectedNodeData.text,
				rigname: rigName,
				rignumber: rigDescription,
				rigclassification: selectedOption,
				description: rigDescription,
				status: "ACTIVE",
				statusdate: new Date(),
				comment: "",
			}),
		};
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/rig/`,
				requestOptions,
			);
			const jsonData = await response.json().then((data) => {
				// Define the new node data
				const newNode = {
					id: data._id, // Unique ID for the new node
					pid: selectedNodeData.id, // Parent ID for the new node
					value: data._id,
					label: data.rigname,
				};
				if (treeObj.current) {
					treeObj.current.addNodes([newNode], selectedNodeData.id);
				}
			});
			setIsLoading(false);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setIsLoading(false);
	};

	const RefreshData = () => {
		MergeTreeData();
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
			<button
				className="bg-gray-300 hover:bg-gray-500 text-black font-bold py-1 px-4 rounded mt-1"
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
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			{/* {hasData && ( */}
			<TreeViewComponent
				fields={fields}
				style={{ fontSize: 24, fontWeight: 600 }}
				nodeSelected={handleNodeSelect}
				allowMultiSelection={false}
				// notificationSubscriptionMode={true}
				// loadOnDemand={false}
				ref={treeObj}
				// ref={(tree) => {
				// 	treeInstance = tree;
				// }}
			/>
			{/* )} */}
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
						{selectedNodeData && (
							<p id="child-modal-description">
								{selectedNodeData.parentID === null ? (
									<>
										<p className="text-center font-bold pt-1 text-lg text-black">
											{`Add Rig To ${selectedNodeData.text} Fleet?`}
										</p>
										<div className="flex flex-col items-center gap-3 mt-4">
											<input
												className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg"
												type="text"
												name="rigName"
												placeholder="Rig Name"
												onChange={(e) => {
													setRigName(e.target.value);
													setAddButtonEnabled(validateData());
												}}
											/>
											<input
												className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg"
												type="text"
												name="rigDescription"
												placeholder="Rig Description"
												onChange={(e) => {
													setRigDescription(e.target.value);
													setAddButtonEnabled(validateData());
												}}
											/>
											<div className="w-[75%]">
												<Select
													className="basic-single"
													classNamePrefix="select"
													defaultValue={selectedOption}
													isDisabled={false}
													onChange={handleSelectionChange}
													name="rigClass"
													options={selectList}
												/>
											</div>
										</div>
									</>
								) : (
									<>
										<div className="flex flex-col items-center gap-3 mt-4">
											<p className="text-center font-bold pt-1 text-lg text-black">
												{`Delete Rig ${selectedNodeData.text} From The Fleet?`}
											</p>
											<input
												className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg"
												type="text"
												name="rigName"
												placeholder="Rig Name"
												onChange={(e) => {
													setRigName(e.target.value);
												}}
											/>
											{errorMsg.length === 0 && (
												<p className="text-center text-sm pt-1">
													Rig Name Entered Must Match Rig To Be Deleted
												</p>
											)}
											{errorMsg.length > 0 && (
												<p className="text-center text-sm pt-1 text-red-500">
													{errorMsg}
												</p>
											)}
										</div>
									</>
								)}
							</p>
						)}
						{selectedNodeData && (
							<div className="flex items-center justify-center">
								{selectedNodeData.parentID === null ? (
									<button
										className="bg-green-500 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-3"
										type="button"
										disabled={accessLevel < 2}
										onClick={handleAddRig}
									>
										Add Rig
									</button>
								) : (
									<button
										className="bg-red-300 hover:bg-red-500 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
										type="button"
										disabled={accessLevel < 2}
										onClick={handleDeleteRig}
									>
										Delete Rig
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

export default RigsTab;
