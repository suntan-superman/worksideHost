/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import axios from "axios";
import "../index.css";
import { toast } from "react-toastify";
import useUserStore from "../stores/UserStore";
import { ElectricScooterOutlined } from "@mui/icons-material";
import { set } from "lodash";

// SupplierGroupUsers Data

// Supplier Name
// Supplier ID
// Supplier Group Name
// Supplier Group ID
// User ID
// User Name
// User Email
// User Status

const customStyles = {
	control: (provided) => ({
		...provided,
		backgroundColor: "white",
		// padding: "5px 10px",
		border: "1px solid gray",
		// boxShadow: "0 2px 4px rgba(0,0,0,.2)",
	}),
	option: (provided, state) => ({
		...provided,
		// borderBottom: "1px dotted pink",
		color: state.isSelected ? "white" : "black",
		backgroundColor: state.isSelected ? "gray" : "white",
	}),
};

let newGroupTreeData = [];

const SupplierGroupsUsersTab = () => {
	const [refreshFlag, setRefreshFlag] = useState(false);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);
	const [expandAll, setExpandAll] = useState(false);
	const [selectedNodeData, setSelectedNodeData] = useState(null);
	const [selectedNodeLabel, setSelectedNodeLabel] = useState(null);
	const [previouslyClickedNode, setPreviouslyClickedNode] = useState(null);
	const [selectedNode, setSelectedNode] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasData, setHasData] = useState(true);

	const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
	const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
	const [addUserModalOpen, setAddUserModalOpen] = useState(false);
	const [removeCategoryModalOpen, setRemoveCategoryModalOpen] = useState(false);
	const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [addMode, setAddMode] = useState(null);
	const [currentSupplier, setCurrentSupplier] = useState(null);
	const [currentSupplierId, setCurrentSupplierId] = useState(null);
	const [supplierIndex, setSupplierIndex] = useState(0);
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [selectedSupplierOption, setSelectedSupplierOption] = useState(null);
	const [groupTreeData, setGroupTreeData] = useState([
		{
			_id: "6754d2ccd3a21ce4ccbf19b5",
			supplier_id: "65d82414b4919376c3c4ccaa",
			id: "Baker Hughes",
			name: "Baker Hughes",
			type: "supplier",
			child: [
				{
					id: "Baker Hughes-group",
					name: "Frac Group",
					type: "group",
					child: [
						{
							id: "Baker Hughes-category-Frac Truck",
							name: "Frac Truck",
							type: "category",
							_id: "6754d2ccd3a21ce4ccbf19b7",
						},
						{
							id: "Baker Hughes-category-Frac Fleet",
							name: "Frac Fleet",
							type: "category",
							_id: "6754d2ccd3a21ce4ccbf19b8",
						},
					],
					_id: "6754d2ccd3a21ce4ccbf19b6",
				},
			],
			__v: 0,
		},
	]);

	const treeObj = useRef(null);
	const cssClass = "mytree";

	const testGroupTreeData = [
		{
			_id: "6754d2ccd3a21ce4ccbf19b5",
			supplier_id: "65d82414b4919376c3c4ccaa",
			id: "Baker Hughes",
			name: "Baker Hughes",
			type: "supplier",
			child: [
				{
					id: "Baker Hughes-group",
					name: "Frac Group",
					type: "group",
					child: [
						{
							id: "Baker Hughes-category-Frac Truck",
							name: "Frac Truck",
							type: "category",
							_id: "6754d2ccd3a21ce4ccbf19b7",
						},
						{
							id: "Baker Hughes-category-Frac Fleet",
							name: "Frac Fleet",
							type: "category",
							_id: "6754d2ccd3a21ce4ccbf19b8",
						},
					],
					_id: "6754d2ccd3a21ce4ccbf19b6",
				},
			],
			__v: 0,
		},
	];
	// useEffect(() => {
	// 	// setGroupTreeData([
	// 	groupTreeData = [
	// 		{
	// 			supplier_id: "65d82414b4919376c3c4ccaa",
	// 			id: "Baker Hughes",
	// 			name: "Baker Hughes",
	// 			type: "supplier",
	// 			child: [
	// 				{
	// 					id: "Baker Hughes-group",
	// 					name: "Frac Group",
	// 					type: "group",
	// 					child: [
	// 						{
	// 							id: "Baker Hughes-category-Frac Truck",
	// 							name: "Frac Truck",
	// 							type: "category",
	// 						},
	// 						{
	// 							id: "Baker Hughes-category-Frac Fleet",
	// 							name: "Frac Fleet",
	// 							type: "category",
	// 						},
	// 						{
	// 							id: "Baker Hughes-category-Frac Support",
	// 							name: "Frac Support",
	// 							type: "category",
	// 						},
	// 						{
	// 							id: "Baker Hughes-users",
	// 							name: "Users",
	// 							type: "users",
	// 							child: [
	// 								{
	// 									id: "Baker Hughes-user-john doe",
	// 									name: "john doe (john.doe@example.com)",
	// 									type: "user",
	// 								},
	// 								{
	// 									id: "Baker Hughes-user-jane smith",
	// 									name: "jane smith (jane.smith@example.com)",
	// 									type: "user",
	// 								},
	// 							],
	// 						},
	// 					],
	// 				},
	// 			],
	// 		},
	// 	];
	// }, []);

	const fields = {
		dataSource: groupTreeData,
		// dataSource: testGroupTreeData,
		id: "id",
		text: "name",
		child: "child",
		data: "type",
	};

	const setModeFlags = (mode) => {
		setAddGroupModalOpen(mode === "addGroup");
		setAddCategoryModalOpen(mode === "addCategory");
		setAddUserModalOpen(mode === "addUser");
		setRemoveCategoryModalOpen(mode === "removeCategory");
		setRemoveUserModalOpen(mode === "removeUser");
	};

	useEffect(() => {
		const fetchSupplierOptions = async () => {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/firm`,
			);
			const json = await response.json();
			// Get Suppliers
			const supplierResult = json.filter((json) => json.type === "SUPPLIER");
			if (supplierResult.length === 0) {
				toast.error("No Suppliers Found");
				setIsLoading(false);
				return;
			}
			const options = supplierResult.map((supplier) => {
				return { value: supplier.name, label: supplier.name };
			});
			setSupplierOptions(options);

			setIsLoading(false);
		};
		fetchSupplierOptions();
	}, []);

	const findTypeById = (data, id) => {
		for (const item of data) {
			if (item.id === id) {
				return item.type;
			}
			if (item.child) {
				const type = findTypeById(item.child, id);
				if (type) {
					return type;
				}
			}
		}
		return null; // Return null if not found
	};

	const findSupplierParentId = (data, targetId) => {
		const search = (nodes, parentSupplierId = null) => {
			for (const node of nodes) {
				if (node.id === targetId) {
					return parentSupplierId; // Return the supplier ID if target is found
				}
				if (node.type === "supplier") {
					parentSupplierId = node.id; // Update parentSupplierId when type is "supplier"
				}
				if (node.child) {
					const result = search(node.child, parentSupplierId);
					if (result) {
						return result; // Return result if found in child nodes
					}
				}
			}
			return null; // Return null if not found
		};

		return search(data);
	};

	const processNodeSelected = (nodeData) => {
		setSelectedNodeData(nodeData);
		setSelectedNodeLabel(nodeData.text);
		console.log("Node Selected: ", nodeData.text);
		const idToSearch = nodeData.id;
		const type = findTypeById(groupTreeData, idToSearch);

		if (type === "supplier") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("addGroup");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "group") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("addCategory");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "category") {
			window.alert(
				`Supplier:  ${findSupplierParentId(groupTreeData, nodeData.text)}`,
			);
			setModeFlags("removeCategory");
			setAddMode(false);
			setOpen(true);
		}
		if (type === "users") {
			const userId = args.nodeData.id;
			setCurrentSupplier(findSupplierParentId(groupTreeData, userId));
			setModeFlags("addUser");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "user") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("removeUser");
			setAddMode(false);
			setOpen(true);
		}
	};

	const handleNodeSelect = (args) => {
		setSelectedNodeData(args.nodeData);
		setSelectedNodeLabel(args.nodeData.text);
		console.log("Node Selected: ", args.nodeData.text);
		const idToSearch = args.nodeData.id;
		const type = findTypeById(groupTreeData, idToSearch);

		if (type === "supplier") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("addGroup");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "group") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("addCategory");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "category") {
			window.alert(
				`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			);
			setModeFlags("removeCategory");
			setAddMode(false);
			setOpen(true);
		}
		if (type === "users") {
			const userId = args.nodeData.id;
			setCurrentSupplier(findSupplierParentId(groupTreeData, userId));
			setModeFlags("addUser");
			setAddMode(true);
			setOpen(true);
		}
		if (type === "user") {
			// window.alert(
			// 	`Supplier:  ${findSupplierParentId(groupTreeData, args.nodeData.text)}`,
			// );
			setModeFlags("removeUser");
			setAddMode(false);
			setOpen(true);
		}

		// handleOpen();
	};

	// useEffect(() => {
	// 	const refreshData = () => {
	// 		setGroupTreeData((prevData) => {
	// 			return newGroupTreeData;
	// 		});
	// 		// setGroupTreeData(newGroupTreeData);
	// 		setNeedRefreshFlag(false);
	// 		setRefreshFlag(false);
	// 		console.log("Group Tree Data: ", JSON.stringify(groupTreeData));
	// 		treeObj?.current?.refresh();
	// 	};
	// 	refreshData();
	// }, [newGroupTreeData]);

	// useEffect(() => {
	// 	treeObj?.current?.expandAll();
	// }, [newGroupTreeData]);

	const GetSupplierId = async (supplierName) => {
		const response = await axios.get(
			`${process.env.REACT_APP_MONGO_URI}/api/firm`,
		);
		const data = response.data;
		const supplierResult = data.filter((d) => d.name === supplierName);
		if (supplierResult.length === 0) {
			toast.error("Supplier Not Found");
			return null;
		}
		const supplierId = supplierResult[0]._id;
		console.log("Supplier ID: ", supplierId);
		return supplierId;
	};

	const InitializeGroupTreeData = (supplierName, supplierId) => {
		setCurrentSupplierId(supplierId);
		const data = [
			{
				supplier_id: supplierId,
				id: supplierName,
				name: supplierName,
				type: "supplier",
				child: [],
			},
		];
		newGroupTreeData = data;
		setGroupTreeData(data);
		setRefreshFlag(true);
		setHasData(true);
	};

	const SetGroupTreeDataFromDB = (groupTreeData) => {
		setCurrentSupplierId(groupTreeData.supplier_id);
		setGroupTreeData((prevData) => {
			return groupTreeData;
		});
		setRefreshFlag(true);
		setHasData(true);
	};

	useEffect(() => {
		const UpdateTree = async () => {
			setGroupTreeData(newGroupTreeData);
			setHasData(true);
			setNeedRefreshFlag(false);
		};
		UpdateTree();
	}, [refreshFlag]);

	const GetSupplierGroupData = async (supplierName) => {
		GetSupplierId(supplierName).then((id) => {
			if (id) {
				// console.log("Supplier ID: ", id);
				axios
					.get(
						// `${process.env.REACT_APP_MONGO_URI}/api/suppliergroup/${id}`,
						`http://localhost:4000/api/suppliergroup/${id}`,
					)
					.then((response) => {
						console.log("Response: ", JSON.stringify(response.data));
						if (response.status === 200) {
							const data = response.data;
							if (data) {
								newGroupTreeData = data;
								SetGroupTreeDataFromDB(newGroupTreeData);
								// setGroupTreeData(data);
								// setRefreshFlag(true);

								// expandTree();
								// console.log("Group Tree Data: ", JSON.stringify(groupTreeData));
							} else {
								InitializeGroupTreeData(supplierName, id);
								console.log("Supplier Group Not Found");
							}
						} else if (response.status === 300) {
							console.log("No Data Found");
						} else {
							console.log("Error: ", response.status);
						}
					})
					.catch((error) => {
						console.log("Error: ", error.status);
						if (error.status === 300) {
							InitializeGroupTreeData(supplierName, id);
						} else {
							if (error.response) {
								console.error(
									"Server responded with error:",
									error.response.data,
								);
							} else if (error.request) {
								// The request was made but no response was received
								console.error("No response received:", error.request);
							} else {
								// Something happened in setting up the request that triggered an Error
								console.error("Error setting up request:", error.message);
							}
						}
					});
			}
		});
	};

	const handleNodeClicked = (args) => {
		if (previouslyClickedNode && previouslyClickedNode.id === args.node.id) {
			treeObj?.current?.setProperties({ selectedNodes: [args.node.id] });
			// console.log("Item clicked Again");

			// console.log(
			// 	`Node Data: ${JSON.stringify(treeObj.current.getTreeData(args.node))}`,
			// );
		} else {
			// Item clicked for the first time
			console.log("Item clicked first time");
		}
		setPreviouslyClickedNode(args.node);
	};

	// const fields = {
	// 	dataSource: treeData,
	// 	id: "id",
	// 	text: "name",
	// 	child: "children",
	// };

	const RefreshData = () => {
		setRefreshFlag(true);
	};

	const handleExpandAll = () => {
		if (expandAll) {
			treeObj?.current?.collapseAll();
		} else treeObj?.current?.expandAll();
		setExpandAll(!expandAll);
	};

	const expandTree = () => {
		treeObj?.current?.expandAll();
		setExpandAll(true);
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

	const handleAddGroup = (data) => {
		// console.log("Add Group: ", data);
		// AddGroup();
		setSelectedNodeData(null);
		setAddGroupModalOpen(false);
		setOpen(false);
		// Define the new group node to add
		const newGroupId = `${selectedSupplierOption}-${data}`;
		// console.log("New Group ID: ", newGroupId);
		const newGroupNode = {
			id: newGroupId,
			name: data,
			type: "group",
			child: [],
		};

		const updatedGroupTreeData = addChildGroupNode(
			groupTreeData,
			currentSupplierId,
			newGroupNode,
		);
		console.log(
			"Updated Group Tree Data: ",
			JSON.stringify(updatedGroupTreeData),
		);
		newGroupTreeData = updatedGroupTreeData;
		setGroupTreeData(updatedGroupTreeData);
		setNeedRefreshFlag(true);
		setRefreshFlag(true);
	};

	const addChildGroupNode = (data, supplierId, newGroupNode) => {
		return data.map((supplier) => {
			if (supplier.supplier_id === supplierId) {
				// Add the new group node to the supplier's child array
				return {
					...supplier,
					child: [...supplier.child, newGroupNode],
				};
			}

			// Return the supplier as is if the supplier ID does not match
			return supplier;
		});
	};

	const handleAddCategory = (data) => {
		// AddGroup();
		setSelectedNodeData(null);
		setAddCategoryModalOpen(false);
		setOpen(false);
	};

	const handleAddUser = (data) => {
		// AddGroup();
		setSelectedNodeData(null);
		setAddUserModalOpen(false);
		setOpen(false);
	};

	const handleRemoveCategory = (data) => {
		// AddGroup();
		setSelectedNodeData(null);
		setRemoveCategoryModalOpen(false);
		setOpen(false);
	};

	const handleRemoveUser = (data) => {
		// AddGroup();
		setSelectedNodeData(null);
		setRemoveUserModalOpen(false);
		setOpen(false);
	};

	const handleSupplierSelectionChange = (selected) => {
		setSelectedSupplierOption(selected.value);
		const index = _.findIndex(supplierOptions, { label: selected.value });
		setSupplierIndex(index);
		GetSupplierGroupData(selected.value);
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
					<button
						className={`${needRefreshFlag ? "bg-yellow-300" : "bg-green-500"} text-black font-bold py-1 px-4 rounded mt-1 text-sm mr-3`}
						type="button"
						onClick={RefreshData}
					>
						Refresh
					</button>
					<button
						className={`${needRefreshFlag ? "bg-yellow-300" : "bg-green-500"} text-black font-bold py-1 px-4 rounded mt-1 text-sm`}
						type="button"
						onClick={handleExpandAll}
					>
						{expandAll ? "Collapse All" : "Expand All"}
					</button>
				</div>
				{/* Place Supplier Select Here */}
				<div className="w-64">
					<Select
						className="basic-single"
						classNamePrefix="select"
						value={supplierOptions[supplierIndex]}
						onChange={handleSupplierSelectionChange}
						name="supplier"
						options={supplierOptions}
						styles={customStyles}
					/>
				</div>
			</div>
			<div>
				{hasData && (
					<TreeViewComponent
						id="contentmenutree"
						fields={fields}
						cssClass={cssClass}
						style={{ fontSize: 24, fontWeight: 600 }}
						expanded={true}
						selectedNodes={selectedNode}
						nodeSelected={handleNodeSelect}
						nodeClicked={handleNodeClicked}
						node
						allowMultiSelection={false}
						ref={treeObj}
					/>
				)}
			</div>
			<div>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="child-modal-title"
					aria-describedby="child-modal-description"
				>
					<Box sx={{ ...dialogStyle, width: 600 }}>
						<div className="text-2xl font-bold text-center mb-3">
							<span className="text-green-500">WORK</span>SIDE
						</div>
						<p id="child-modal-description">
							{addGroupModalOpen && (
								<AddGroupForm
									mode="addGroup"
									currentNodeText={selectedNodeLabel}
									AddGroupItem={handleAddGroup}
									currentSupplier={null}
								/>
							)}
							{addCategoryModalOpen && (
								<AddGroupForm
									mode="addCategory"
									currentNodeText={selectedNodeLabel}
									AddGroupItem={handleAddCategory}
									currentSupplier={null}
								/>
							)}
							{addUserModalOpen && (
								<AddGroupForm
									mode="addUser"
									currentNodeText={selectedNodeLabel}
									AddGroupItem={handleAddUser}
									currentSupplier={currentSupplier}
								/>
							)}
							{removeCategoryModalOpen && (
								<AddGroupForm
									mode="removeCategory"
									currentNodeText={selectedNodeLabel}
									AddGroupItem={handleRemoveCategory}
									currentSupplier={null}
								/>
							)}
							{removeUserModalOpen && (
								<AddGroupForm
									mode="removeUser"
									currentNodeText={selectedNodeLabel}
									AddGroupItem={handleRemoveUser}
									currentSupplier={null}
								/>
							)}
						</p>
						{/* <div className="flex items-center justify-center mt-4">
							{addMode ? (
								<button
									className="bg-green-300 hover:bg-green-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
									type="button"
									// disabled={!addButtonEnabled}
									// onClick={handleAddRequestor}
								>
									{`Add ${addGroupModalOpen ? "Group" : addCategoryModalOpen ? "Category" : "User"}`}
								</button>
							) : (
								<button
									className="bg-red-300 hover:bg-red-700 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
									type="button"
									// onClick={handleDeleteRequestor}
								>
									{`Remove ${removeCategoryModalOpen ? "Category" : "User"}`}
								</button>
							)}
						</div> */}
					</Box>
				</Modal>
			</div>
		</div>
	);
};

const AddGroupForm = ({
	mode,
	currentNodeText,
	AddGroupItem,
	currentSupplier,
}) => {
	const [name, setName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [label, setLabel] = useState("");
	const [buttonLabel, setButtonLabel] = useState("");
	const [contactList, setContactList] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);
	const [buttonEnabled, setButtonEnabled] = useState(false);

	const handleAddGroup = () => {
		// Check if the group name exists already
		setErrorMsg("");
		AddGroupItem(name);
		// if (name.toLowerCase() === currentNodeText.toLowerCase()) {
		// 	setErrorMsg("");
		// 	AddGroupItem();
		// } else {
		// 	setErrorMsg("Document Name Does Not Match");
		// }
	};

	useEffect(() => {
		if (mode === "addGroup") {
			setLabel(`Add Group To ${currentNodeText}`);
			setButtonLabel("Add Group");
		}
		if (mode === "addCategory") {
			setLabel(`Add Category To ${currentNodeText}`);
			setButtonLabel("Add Category");
		}
		if (mode === "addUser") {
			setLabel(`Add User To ${currentNodeText}`);
			setButtonLabel("Add User");
		}
		if (mode === "removeCategory") {
			setLabel(`Remove Category ${currentNodeText}`);
			setButtonLabel("Remove Category");
		}
		if (mode === "removeUser") {
			setLabel(`Remove User ${currentNodeText}`);
			setButtonLabel("Remove User");
		}
	}, [mode]);

	useEffect(() => {
		// Get the list of users if mode === addUser
		const fetchContacts = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/contact`,
			);
			const json = await response.json();
			// console.log("Contacts: " + JSON.stringify(json));
			const customerResult = json.filter((j) => j.firm === currentSupplier);
			if (customerResult.length === 0) {
				setErrorMsg("No Users Found for this Supplier");
				return;
			}
			const contacts = customerResult.map((r) => ({
				value: r.username,
				label: r.username,
			}));
			setContactList(contacts);
		};

		if (mode === "addUser") {
			fetchContacts();
		}
	}, []);

	const handleSelectionChange = (selected) => {
		setSelectedOption(selected.value);
		setButtonEnabled(true);
	};

	return (
		<div>
			<p className="text-center font-semibold pt-1 mb-2">{label}</p>
			<div className="flex items-center justify-center">
				{mode === "addUser" && (
					<div className="flex-1 w-3/4">
						<Select
							className="basic-single"
							classNamePrefix="select"
							isDisabled={false}
							onChange={handleSelectionChange}
							name="userName"
							options={contactList}
						/>
					</div>
				)}
				{mode !== "addUser" && (
					<input
						className="bg-gray-200 outline-none text-sm flex-1 w-3/4 border-2 border-black p-1 rounded-lg mb-2"
						type="text"
						name="name"
						placeholder="Name"
						onChange={(e) => setName(e.target.value)}
					/>
				)}
			</div>
			{errorMsg.length === 0 && (
				<p className="text-center text-sm pt-1">Name Entered Must Be Unique</p>
			)}
			{errorMsg.length > 0 && (
				<p className="text-center text-sm pt-1 text-red-500">{errorMsg}</p>
			)}
			<div className="flex items-center justify-center">
				<button
					className="bg-green-300 hover:bg-green-600 text-black font-bold py-1 px-4 rounded mt-3 border-2 border-black"
					type="button"
					// disabled={!buttonEnabled}
					onClick={handleAddGroup}
				>
					{buttonLabel}
				</button>
			</div>
		</div>
	);
};


export default SupplierGroupsUsersTab;
