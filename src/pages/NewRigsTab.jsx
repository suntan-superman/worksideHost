/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Select from "react-select";
import Modal from "@mui/material/Modal";
import axios from "axios";
import "../index.css";

const NewRigsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [refreshFlag, setRefreshFlag] = useState(true);
	const [rigCompanyList, setRigCompanyList] = useState([]);
	const [rigList, setRigList] = useState([]);
	const [assignedRequestorList, setAssignedRequestorList] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [treeData, setTreeData] = useState([]);
	const [addButtonEnabled, setAddButtonEnabled] = useState(false);
	const [rigName, setRigName] = useState("");
	const [rigDescription, setRigDescription] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [hasData, setHasData] = useState(false);

	const [showPopup, setShowPopup] = useState(false);
	const [selectedNodeData, setSelectedNodeData] = useState(null);

	let treeInstance = useRef(null);

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleAddRig = () => {
		onPostData();
		setOpen(false);
	};

	const DeleteRig = async () => {
		setIsLoading(true);

		const id = selectedNodeData.id;
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		};

		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/rig/${id}`,
				requestOptions,
			);
			const jsonData = await response.json();
			// window.alert(`Data Deleted: ${JSON.stringify(jsonData)}`);
		} catch (error) {
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setIsLoading(false);
	};

	const handleDeleteRig = () => {
		// window.alert(
		// 	`Requestor Name: ${requestorName} Selected Node: ${selectedNodeData.text}`,
		// );
		if (rigName.toLowerCase() === selectedNodeData.text.toLowerCase()) {
			// Strings are equal (case-insensitive)
			setErrorMsg("");
			// DeleteRig();
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

	const fetchRigCompanies = async () => {
		try {
			await axios
				.get(`${process.env.REACT_APP_MONGO_URI}/api/firm/`)
				.then((res) => {
					const jsonResults = res.data;
					const result = jsonResults.filter(
						(jsonResult) => jsonResult.type === "RIGCOMPANY",
					);
					setRigCompanyList(result);
				});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchRigs = async () => {
		axios.get(`${process.env.REACT_APP_MONGO_URI}/api/rig/`).then((res) => {
			const jsonResults = res.data;
			// window.alert(`Fetch Rigs: ${JSON.stringify(jsonResults)}`);
			setRigList(jsonResults);
		});
	};

	const MergeTreeData = () => {
		// window.alert(`Rig Companies: ${JSON.stringify(rigCompanyList)}`);
		// window.alert(`Rigs: ${JSON.stringify(rigList)}`);
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

		// fetchAvailableRequestors();
		// setTreeData(merged);
		// setRefreshFlag(false);
		// treeInstance.refresh();
	};

	const GetData = async () => {
		// setIsLoading(true);
		fetchRigCompanies().then(() => {
			fetchRigs().then(() => {
				// window.alert(`Get Data Rigs: ${JSON.stringify(rigList)}`);
			});
		});
		MergeTreeData();
		setHasData(true);
		// setIsLoading(false);
	};

	useEffect(() => {
		GetData();
	}, []);

	useEffect(() => {
		GetData();
	}, [refreshFlag]);

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

	const findById = (id) => {
		return rigList.find((item) => item._id === id);
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
		// selected.value is user_id
		// const idToFind = selected.value;
		// window.alert(
		// 	`Selected User Id: ${selected.value}\nSelected Node Id: ${selectedNodeData.id}`,
		// );
		// Search for the object with the matching id
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
				// const response = await fetch(
				// 	`${process.env.REACT_APP_MONGO_URI}/api/rig/`,
				// 	requestOptions,
				// );
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
		setRefreshFlag(true);
		// window.alert(`Tree Data: ${JSON.stringify(treeData)}`);
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
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			{/* {hasData && ( */}
			<TreeViewComponent
				fields={fields}
				style={{ fontSize: 24, fontWeight: 600 }}
				nodeSelected={handleNodeSelect}
				allowMultiSelection={false}
				// notificationSubscriptionNode={true}
				// loadOnDemand={false}
				ref={(tree) => {
					treeInstance = tree;
				}}
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
										className="bg-green-300 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-3"
										type="button"
										// disabled={!addButtonEnabled}
										onClick={handleAddRig}
									>
										Add Rig
									</button>
								) : (
									<button
										className="bg-red-300 hover:bg-red-500 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
										type="button"
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

export default NewRigsTab;