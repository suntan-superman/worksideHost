/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import {
	TreeViewComponent,
	ContextMenuComponent,
} from "@syncfusion/ej2-react-navigations";
// import { TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";

import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import "../index.css";
import { toast } from "react-toastify";
import { set } from "lodash";
// import { Delete } from "@mui/icons-material";
// import { Form } from "react-router-dom";

// TODO Need to Add FIlter Options for Documents
// TODO FIlter by Date, By Status

// TODO Add File Upload for Documents
// TODO Add File View
// TODO Add File Download and Store to MongoDB

const ProjectDocumentsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [refreshFlag, setRefreshFlag] = useState(true);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const [projectList, setProjectList] = useState([]);
	const [documentList, setDocumentList] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const [errorMsg, setErrorMsg] = useState("");
	const [hasData, setHasData] = useState(false);
	const [documentName, setDocumentName] = useState("");
	const [docDescription, setDocDescription] = useState("");
	const [currentFile, setCurrentFile] = useState(null);
	const [documentPath, setDocumentPath] = useState("");
	const [viewDocFlag, setViewDocFlag] = useState(false);
	const [rightClickFlag, setRightClickFlag] = useState(false);

	const [selectedNodeData, setSelectedNodeData] = useState(null);
	const [selectedNodeLabel, setSelectedNodeLabel] = useState("");

	const treeObj = useRef(null);
	let menuObj = useRef(null);
	const cssClass = "mytree";

	const [modalOpen, setModalOpen] = useState(false);

	const handleOpen = () => {
		setModalOpen(true);
	};

	const handleAddDocument = async () => {
		// TODO - Add Save Document to Project and Refresh Tree
		// Need To Confirm The Selected Node and Selected Document
		// onPostData();
		const userID = localStorage.getItem("userID");

		if (userID === null) {
			window.alert("User Not Logged In");
			return;
		}
		if (currentFile === null) {
			window.alert("No file selected");
			return;
		}

		const upload_file = currentFile;
		const upload_description = docDescription;
		const upload_project = selectedNodeData.id;

		const formData = new FormData();
		formData.append("project_id", upload_project);
		formData.append("owner_id", userID);
		formData.append("description", upload_description);
		formData.append("file", upload_file);

		setIsLoading(true);
		try {
			// TODO set back to apiURL
			const response = await fetch("http://localhost:4000/api/document", {
				method: "POST",
				body: formData,
			});

			const jsonData = await response.json();
			setIsLoading(false);
			// window.alert(`Data Posted: ${JSON.stringify(jsonData)}`);
			setRefreshFlag(true);
			// setData(jsonData);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
		setModalOpen(false);
	};

	const handleDeleteDocument = () => {
		// TBD - Add Save Document to Project and Refresh Tree
		// Need To Confirm The Selected Node and Selected Document
		// onPostData();
		setModalOpen(false);
	};

	const DeleteDocument = async () => {
		setIsLoading(true);

		const id = selectedNodeData.id;
		const requestOptions = {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		};

		try {
			// TODO set back to apiURL
			const response = await fetch(
				`http://localhost:4000/api/document/${id}`,
				requestOptions,
			);
			// const response = await fetch(
			// 	`${process.env.REACT_APP_MONGO_URI}/api/document/${id}`,
			// 	requestOptions,
			// );
			const jsonData = await response.json();
			if (response.status === 200) {
				toast.success("Document Deleted...");

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

	const handleClose = () => {
		setModalOpen(false);
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
		// TODO set back to apiURL
		try {
			await axios.get("http://localhost:4000/api/project/").then((res) => {
				if (res.status === 200) {
					const jsonResults = res.data;
					setProjectList(jsonResults);
					// window.alert(jsonResults);
				}
			});
			// await axios
			// 	.get(`${process.env.REACT_APP_MONGO_URI}/api/project/`)
			// 	.then((res) => {
			// 		const jsonResults = res.data;
			// 		setProjectList(jsonResults);
			// 	});
		} catch (error) {
			console.error(error);
		}
	};

	const fetchDocuments = async () => {
		// TODO set back to apiURL
		const fetchString = "http://localhost:4000/api/document/";

		try {
			axios.get(fetchString).then((res) => {
				if (res.status === 200) {
					const jsonResults = res.data;
					setDocumentList(jsonResults);
					// window.alert(jsonResults);
				} else {
					window.alert(`Error: ${res.status}`);
				}
			});
		} catch (error) {
			console.error(error);
		}
		// axios.get(`${process.env.REACT_APP_MONGO_URI}/api/document/`).then((res) => {
		// 	const jsonResults = res.data;
		// 	setDocumentList(jsonResults);
		// });
	};

	const MergeTreeData = () => {
		const updatedDocuments = documentList.map((document) => ({
			...document,
			label: `${document.docDesc}`,
			text: `${document.docDesc}`,
			id: document._id,
			isParent: false,
			expanded: true,
		}));
		const merged = projectList.map((project) => ({
			...project,
			id: project._id,
			label: project.projectname,
			text: project.projectname,
			expanded: true,
			isParent: true,
			subChild: updatedDocuments.filter(
				(document) => document.project_id === project._id,
			),
		}));
		setTreeData(merged);
		setRefreshFlag(false);
		setNeedRefreshFlag(true);
	};

	useEffect(() => {
		const GetData = async () => {
			// Set Wait Cursor
			setIsLoading(true);
			fetchProjects().then(() => {
				fetchDocuments();
			});
			MergeTreeData();
			setIsLoading(false);
			setHasData(true);
		};
		GetData();
	}, []);

	useEffect(() => {
		const GetData = async () => {
			// Set Wait Cursor
			setIsLoading(true);
			fetchProjects().then(() => {
				fetchDocuments();
			});
			MergeTreeData();
			setIsLoading(false);
			setRefreshFlag(false);
			setHasData(true);
			setNeedRefreshFlag(false);
		};
		GetData();
	}, [refreshFlag]);

	// useEffect(() => {
	// 	const UpdateTree = async () => {
	// 		fetchProjects().then(() => {
	// 			fetchDocuments();
	// 		});
	// 		// MergeTreeData();
	// 		setHasData(true);
	// 	};
	// 	UpdateTree();
	// }, [refreshFlag]);

	const fields = {
		dataSource: treeData,
		id: "id",
		text: "label",
		child: "subChild",
	};

	const handleNodeSelect = (args) => {
		setSelectedNodeData(args.nodeData);
		setSelectedNodeLabel(args.nodeData.text);
		handleOpen();
	};

	const onPostData = async () => {
		setIsLoading(true);

		// const result = findById(selectedOption);

		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				project_id: selectedNodeData.id,
				docDesc: docDescription,
				docPath: documentPath,
			}),
		};
		try {
			// TODO set back to apiURL
			const response = await fetch(
				"http://localhost:4000/api/document/",
				requestOptions,
			);
			// const response = await fetch(
			// 	`${process.env.REACT_APP_MONGO_URI}/api/document/`,
			// 	requestOptions,
			// );
			const jsonData = await response.json().then((data) => {
				// Define the new node data
				const newNode = {
					id: data._id, // Unique ID for the new node
					pid: selectedNodeData.id, // Parent ID for the new node
					// value: data._id,
					label: docDescription,
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
		setNeedRefreshFlag(false);
	};

	const handleSelectFile = async () => {
		console.log(`Select File: ${documentPath} ${docDescription}`);

		const requestOptions = {
			method: "POST",
			// headers: { "Content-Type": "application/json" },
			headers: { "Content-Type": "multipart/form-data" },
			body: JSON.stringify({
				project_id: selectedNodeData.id,
				description: docDescription,
				file: documentPath,
			}),
		};

		const result = await axios.post(
			"http://localhost:4000/api/document",
			requestOptions,
			// {
			//   headers: { "Content-Type": "multipart/form-data" },
			// }
		);
		console.log(result);
		if (result.data.status === 200) {
			alert("Uploaded Successfully!!!");
			// getPdf();
		}

		// const fileInput = document.createElement("input");
		// fileInput.type = "file";
		// fileInput.accept = ".pdf";
		// fileInput.onchange = (e) => {
		// 	const file = e.target.files[0];
		// 	const reader = new FileReader();
		// 	reader.onload = (e) => {
		// 		setDocumentPath(e.target.result);
		// 	};
		// 	reader.readAsDataURL(file);
		// };
		// fileInput.click();
	};

	//Render the context menu with target as Treeview
	const menuItems = [{ text: "View Document" }];
	// const MenuItems = [{ text: "View Document" }, { text: "Remove Item" }];

	const NodeClicked = (args) => {
		// window.alert(
		// 	`Node Clicked: ${JSON.stringify(args)} Event Which: ${args.event.which}`,
		// );
		if (args.event.which === 1) {
			// User has Left-Clicked
			treeObj.current.selectedNodes = [args.node.getAttribute("data-uid")];
		}
		if (args.event.which === 3) {
			// User has Right-Clicked
			treeObj.SelectedNode = [args.node.getAttribute("data-uid")];
			// window.alert(`Right Clicked: ${treeObj.SelectedNode}`);
			treeObj.current.selectedNodes = [args.node.getAttribute("data-uid")];
		}
	};

	// TODO: Not working
	const BeforeOpen = (args) => {
		const targetNodeId = treeObj.current.selectedNodes[0];
	};

	const openInNewTab = (url) => {
		// Open the link in a new tab with desired features (optional)
		// window.open(url, "_blank", "noopener,noreferrer");
		// window.open(url, "_blank", "noreferrer");
		window.open(
			url,
			"workside",
			"toolbars=0,width=600,height=600,left=100,top=100,scrollbars=1,resizable=1",
		);
	};

	const MenuClick = async (args) => {
		if (args.item.text === "View Document") {
			const id = selectedNodeData.id;

			// TODO: Update the URL to the backend endpoint
			const apiURL = `localhost:4000/api/document/${id}`;
			const requestOptions = {
				method: "GET",
				// headers: { "Content-Type": "application/json" },
				// responseType: "blob", // Important for handling binary data
			};

			try {
				// window.alert(`API URL: ${apiURL}`);
				const response = await fetch(
					`http://localhost:4000/api/document/${id}`,
					requestOptions,
				);
				let signedUrl = "";
				const jsonData = await response.json().then((data) => {
					signedUrl = data.signedUrl;
					if (response.status === 301 || response.status === 302)
						openInNewTab(signedUrl);
				});
			} catch (error) {
				console.error("Error downloading file:", error);
			}
			// setViewDocFlag(true);
		}
	};

	// const handleContextMenu = (event) => {
	// 	event.preventDefault();
	// 	// Add your custom right-click logic here
	// };

	// const IsTargetNodeParent = (nodeId) => {
	// 	console.log(`Node ID: ${nodeId}`);
	// 	console.log(`Tree Data: ${JSON.stringify(treeData)}`);
	// 	const targetNode = treeData.find((node) => node._id === nodeId);
	// 	console.log(`Target Node: ${JSON.stringify(targetNode)}`);
	// 	if (targetNode.isParent === true) {
	// 		return true;
	// 	}
	// 	return false;
	// };

	// TODO Need to fix the right-click logic
	const handleMouseClick = (event) => {
		if (event.button === 0) {
			setRightClickFlag(false);
			menuObj.enableItems(["View Document"], false);
		}
		if (event.button === 2) {
			setSelectedNodeData(event.target);

			if (selectedNodeData !== null) {
				setRightClickFlag(true);
				if (selectedNodeData.parentID === null)
					menuObj.enableItems(["View Document"], false);
				else menuObj.enableItems(["View Document"], true);
			} else {
				toast.error("No Node Selected");
			}
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		setCurrentFile(file);
	};

	const OnCloseViewDialog = () => {
		setViewDocFlag(false);
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
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			{hasData && (
				<div id="target" onMouseDown={handleMouseClick}>
					<TreeViewComponent
						id="contentmenutree"
						fields={fields}
						cssClass={cssClass}
						style={{ fontSize: 24, fontWeight: 600 }}
						nodeSelected={handleNodeSelect}
						nodeClicked={NodeClicked.bind(this)}
						allowMultiSelection={false}
						ref={treeObj}
					/>
					<ContextMenuComponent
						target="#target"
						id="contextmenu"
						items={menuItems}
						BeforeOpen={BeforeOpen.bind(this)}
						select={MenuClick.bind(this)}
						ref={(contextmenu) => {
							menuObj = contextmenu;
						}}
					/>
				</div>
			)}
			<div>
				<div>{viewDocFlag && <ViewDocument onClose={OnCloseViewDialog} />}</div>
				{!rightClickFlag && (
					<Modal
						open={modalOpen}
						onClose={handleClose}
						aria-labelledby="child-modal-title"
						aria-describedby="child-modal-description"
					>
						<Box sx={{ ...dialogStyle, width: 600 }}>
							<div className="text-xl font-bold text-center">
								<span className="text-green-500">WORK</span>SIDE
							</div>
							<p id="child-modal-description">
								{selectedNodeData && (
									<>
										{selectedNodeData.parentID === null ? (
											<AddDocumentForm
												currentNodeText={selectedNodeLabel}
												handleAddDocument={handleAddDocument}
												setDocDescription={setDocDescription}
												handleFileChange={handleFileChange}
											/>
										) : (
											<DeleteDocumentForm
												currentNodeText={selectedNodeLabel}
												handleDeleteDocument={handleDeleteDocument}
											/>
										)}
									</>
								)}
							</p>
						</Box>
					</Modal>
				)}
			</div>
		</div>
	);
};

const AddDocumentForm = ({
	currentNodeText,
	handleAddDocument,
	setDocDescription,
	handleFileChange,
}) => {
	const [docPath, setDocPath] = useState("");
	const [docDesc, setDocDesc] = useState("");

	const handleSelectFile = (event) => {
		handleFileChange(event);
		setDocPath(event.target.value);
	};

	return (
		<div>
			{/* <form className="formStyle" onSubmit={handleSelectFile}> */}
			<form className="formStyle">
				<p className="text-center font-bold pt-1 text-lg text-black pb-2">
					Add Document To {currentNodeText}
				</p>
				<input
					className="bg-gray-200 outline-none text-sm flex-1 w-full border-2 border-black p-1 rounded-lg"
					// class="form-control"
					type="text"
					// name="description"
					placeholder="Description"
					required
					onChange={(e) => {
						setDocDescription(e.target.value);
						setDocDesc(e.target.value);
					}}
				/>
				<div className="flex-row pt-2 w-full">
					<input
						className="bg-gray-200 outline-none text-sm flex-1 w-full border-2 border-black p-1 rounded-lg"
						type="file"
						// class="form-control"
						placeholder="Document Path"
						accept="application/pdf"
						required
						onChange={handleSelectFile}
					/>
				</div>
				<div className="flex items-center justify-center">
					<button
						className="bg-green-300 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
						type="button"
						disabled={docPath.length === 0 || docDesc.length === 0}
						onClick={handleAddDocument}
					>
						Add Document
					</button>
				</div>
			</form>
		</div>
	);
};

const DeleteDocumentForm = ({ currentNodeText, DeleteDocument }) => {
	const [documentName, setDocumentName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const handleDeleteDocument = () => {
		if (documentName.toLowerCase() === currentNodeText.toLowerCase()) {
			// Strings are equal (case-insensitive)
			setErrorMsg("");
			DeleteDocument();
		} else {
			setErrorMsg("Document Name Does Not Match");
		}
	};

	return (
		<div>
			<p className="text-center font-semibold pt-1">
				{`Remove ${currentNodeText} from Document List?`}
			</p>
			<div className="flex items-center justify-center">
				<input
					className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg"
					type="text"
					name="documentName"
					placeholder="Document Name"
					onChange={(e) => setDocumentName(e.target.value)}
				/>
			</div>
			{errorMsg.length === 0 && (
				<p className="text-center text-sm pt-1">
					Name Entered Must Match Document Name
				</p>
			)}
			{errorMsg.length > 0 && (
				<p className="text-center text-sm pt-1 text-red-500">{errorMsg}</p>
			)}
			<div className="flex items-center justify-center">
				<button
					className="bg-red-300 hover:bg-red-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
					type="button"
					onClick={handleDeleteDocument}
				>
					Delete Document
				</button>
			</div>
		</div>
	);
};

const ViewDocument = ({ onClose }) => {
	function PaperComponent(props) {
		return (
			<Draggable
				handle="#viewDocumentDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	return (
		<div>
			<Dialog
				open={open}
				aria-labelledby="viewDocumentDialog"
				PaperComponent={PaperComponent}
			>
				<DialogTitle id="viewDocumentDialog">
					<span className="text-bold text-green-300">WORK</span>SIDE Document
				</DialogTitle>
				<DialogContent style={{ width: "500px", height: "700px" }}>
					{/* <Stack spacing={2} margin={3}> */}
					<FormGroup>
						<p className="text-red-700 text-xs font-bold pt-2 pb-2">
							View Document
						</p>
					</FormGroup>
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="success" onClick={onClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default ProjectDocumentsTab;
