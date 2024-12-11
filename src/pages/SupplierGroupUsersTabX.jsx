/* eslint-disable */

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { useTreeViewApiRef } from "@mui/x-tree-view/hooks/useTreeViewApiRef";
import { styled, alpha } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { createTheme } from "@material-ui/core";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import axios from "axios";
import "../index.css";
import { toast } from "react-toastify";
import {
	Menu,
	MenuItem,
	Typography,
	RadioGroup,
	FormControlLabel,
	Radio,
} from "@mui/material";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

// import RichObjectTreeView from "./RichObjectTreeView";

// import { set } from "lodash";
import _ from "lodash";

const theme = createTheme({
	palette: {
		primary: {
			main: "#ff8f00",
		},
		secondary: {
			main: "#ffcc80",
		},
	},
});

const customStyles = {
	control: (provided) => ({
		...provided,
		backgroundColor: "white",
		// padding: "5px 10px",
		border: "2px solid black",
		boxShadow: "0 2px 4px rgba(0,0,0,.2)",
	}),
	option: (provided, state) => ({
		...provided,
		color: state.isSelected ? "white" : "black",
		backgroundColor: state.isSelected ? "gray" : "white",
	}),
};

const SupplierGroupUsersTabX = () => {
	// const accessLevel = useUserStore((state) => state.accessLevel);
	const [expandAll, setExpandAll] = useState(false);
	const [selectedNodeLabel, setSelectedNodeLabel] = useState(null);
	const [selectedNodeId, setSelectedNodeId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const apiRef = useTreeViewApiRef();
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
	const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
	const [addUserModalOpen, setAddUserModalOpen] = useState(false);
	const [removeCategoryModalOpen, setRemoveCategoryModalOpen] = useState(false);
	const [removeUserModalOpen, setRemoveUserModalOpen] = useState(false);
	const [removeSingleCategoryModalOpen, setRemoveSingleCategoryModalOpen] =
		useState(false);
	const [removeSingleUserModalOpen, setRemoveSingleUserModalOpen] =
		useState(false);
	const [open, setOpen] = useState(false);
	const [currentSupplier, setCurrentSupplier] = useState(null);
	const [currentSupplierId, setCurrentSupplierId] = useState(null);
	const [supplierIndex, setSupplierIndex] = useState(0);
	const [supplierOptions, setSupplierOptions] = useState([]);

	const [expandedItems, setExpandedItems] = useState([]);
	// const [rightClickFlag, setRightClickFlag] = useState(false);
	// const [lastSelectedItem, setLastSelectedItem] = useState(null);
	const [contextMenu, setContextMenu] = useState(null);
	const [clickedNode, setClickedNode] = useState("");
	const [groupTreeData, setGroupTreeData] = useState([]);

	// Custom Styles

	const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
		color: theme.palette.grey[400],
		[`& .${treeItemClasses.content}`]: {
			borderRadius: theme.spacing(0.5),
			padding: theme.spacing(0.5, 1),
			margin: theme.spacing(0.2, 0),
			[`& .${treeItemClasses.label}`]: {
				fontSize: "12pt", // "0.8rem"
				fontWeight: 800,
			},
		},
		[`& .${treeItemClasses.iconContainer}`]: {
			borderRadius: "50%",
			backgroundColor: theme.palette.primary.dark,
			padding: theme.spacing(0, 1.2),
			...theme.applyStyles("light", {
				backgroundColor: "#22C55E",
				// backgroundColor: alpha(theme.palette.primary.main, 0.25),
			}),
			...theme.applyStyles("dark", {
				color: theme.palette.primary.contrastText,
			}),
		},
		[`& .${treeItemClasses.groupTransition}`]: {
			marginLeft: 15,
			paddingLeft: 18,
			borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
		},
		...theme.applyStyles("light", {
			color: "black",
			// color: theme.palette.grey[800],
		}),
	}));

	const useStyles = makeStyles({
		root: {
			"&$selected": {
				color: "yellow",
				backgroundColor: "red",
				"&:hover": {
					backgroundColor: "yellow",
				},
			},
		},
		selected: {},
	});

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

	useEffect(() => {
		const handleBeforeUnload = (event) => {
			// Check if there are unsaved changes or other conditions to prevent leaving
			if (hasUnsavedChanges) {
				event.preventDefault();
				event.returnValue = ""; // Required for some browsers
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]); // Include dependencies if needed

	const setModeFlags = (mode) => {
		setAddGroupModalOpen(mode === "addGroup");
		setAddCategoryModalOpen(mode === "addCategory");
		setAddUserModalOpen(mode === "addUser");
		setRemoveCategoryModalOpen(mode === "removeCategory");
		setRemoveUserModalOpen(mode === "removeUser");
		setRemoveSingleCategoryModalOpen(mode === "removeSingleCategory");
		setRemoveSingleUserModalOpen(mode === "removeSingleUser");
	};

	useEffect(() => {
		const fetchSupplierOptions = async () => {
			setIsLoading(true);
			const response = await fetch(
				// "http://localhost:4000/api/firm",
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
			if (item.children) {
				const type = findTypeById(item.children, id);
				if (type) {
					return type;
				}
			}
		}
		return null; // Return null if not found
	};

	const findLabelById = (data, id) => {
		for (const item of data) {
			if (item.id === id) {
				return item.label;
			}
			if (item.children) {
				const label = findLabelById(item.children, id);
				if (label) {
					return label;
				}
			}
		}
		return null; // Return null if not found
	};

	const handleContextMenu = (event, nodeId) => {
		event.preventDefault(); // Prevent the default right-click menu
		// const currentSelection = apiRef.current.getItem(nodeId);
		// console.log("Right Clicked Node: ", currentSelection);
		setClickedNode(nodeId);
		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX + 2,
						mouseY: event.clientY - 6,
					}
				: null,
		);
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	const handleCloseModal = () => {
		setAddCategoryModalOpen(false);
		setAddUserModalOpen(false);
		setOpen(false);
	};

	const handleAddGroup = (data) => {
		const name = data;
		name?.trim();
		if (name === "") {
			window.alert("Name Cannot Be Empty");
			// toast.error("Name Cannot Be Empty");
			return;
		}
		setAddGroupModalOpen(false);
		setOpen(false);
		// Define the new group node to add
		if (currentSupplier === null) {
			window.alert("No Supplier Selected");
			// toast.error("No Supplier Selected");
			return;
		}
		if (CheckIfLabelExists(groupTreeData, data, "group") === true) {
			window.alert("Group Already Exists");
			// toast.error("Group Already Exists");
			return;
		}
		const updatedGroupTreeData = addGroupWithChildren(
			groupTreeData,
			currentSupplier,
			currentSupplier,
			"supplier",
			data,
		);

		setGroupTreeData(updatedGroupTreeData);
		setHasUnsavedChanges(true);
	};

	const CheckIfLabelExists = (data, targetLabel, targetType) => {
		for (const node of data) {
			// Check if current node matches the criteria
			if (node?.label === targetLabel && node?.type === targetType) {
				return true;
			}
			// Recursively check child nodes, if they exist
			if (node?.children) {
				const foundInChild = CheckIfLabelExists(
					node.children,
					targetLabel,
					targetType,
				);
				if (foundInChild) {
					return true;
				}
			}
		}
		return false; // Return false if no match is found
	};

	const getCategoryLabels = (
		data,
		grandParentLabel,
		grandParentType,
		parentType,
	) => {
		const labels = [];

		const traverse = (nodes, parent = null, grandParent = null) => {
			for (const node of nodes) {
				// Check if the parent and grandparent meet the criteria
				if (
					grandParent?.label === grandParentLabel &&
					grandParent?.type === grandParentType &&
					parent?.type === parentType
				) {
					labels.push(node.label);
				}

				// Recursively traverse children
				if (node.children) {
					traverse(node.children, node, parent);
				}
			}
		};

		traverse(data);
		return labels;
	};

	const doesItemExist = (data, target) => {
		return data.includes(target);
	};

	const handleAddCategory = (data) => {
		const labels = getCategoryLabels(
			groupTreeData,
			selectedNodeLabel,
			"group",
			"group-category",
		);
		const exists = doesItemExist(labels, data);
		if (exists) {
			// toast.error("Category Already Exists");
			window.alert("Category Already Exists");
			return;
		}
		const updatedWithCategory = addCategoryToSpecificGroupCategory(
			groupTreeData,
			selectedNodeLabel,
			"group",
			"Category",
			"group-category",
			data,
		);
		setGroupTreeData(updatedWithCategory);
		setHasUnsavedChanges(true);
		setAddCategoryModalOpen(false);
		setOpen(false);
	};

	const handleAddUser = (data) => {
		// Add a new user to the group tree data
		const userLabel = `${data.name} (${data.username})`;
		const labels = getCategoryLabels(
			groupTreeData,
			selectedNodeLabel,
			"group",
			"group-user",
		);
		const exists = doesItemExist(labels, userLabel);
		if (exists) {
			// toast.error("Category Already Exists");
			window.alert("User Already Exists");
			return;
		}

		const updatedWithUser = addUserToSpecificGroupUser(
			groupTreeData,
			selectedNodeLabel,
			"group",
			"User",
			"group-user",
			userLabel,
		);

		setGroupTreeData(updatedWithUser);
		setHasUnsavedChanges(true);
		setAddUserModalOpen(false);
		setOpen(false);
	};

	const handleRemoveCategory = (data) => {
		if (
			worksideConfirmAlert(
				"Are you sure you want to delete all categories?",
			) === false
		) {
			return;
		}
		const updatedData = deleteChildrenByParentId(groupTreeData, selectedNodeId);
		setGroupTreeData(updatedData);
		setHasUnsavedChanges(true);
		setRemoveCategoryModalOpen(false);
		setOpen(false);
	};

	const handleRemoveUser = (data) => {
		worksideConfirmAlert({
			message: "Are you sure you want to delete all users?",
			action: removeUser,
		});
	};

	const removeUser = (data) => {
		const updatedData = deleteChildrenByParentId(groupTreeData, selectedNodeId);
		setGroupTreeData(updatedData);
		setHasUnsavedChanges(true);
		setRemoveUserModalOpen(false);
		setOpen(false);
	};

	const handleRemoveSingleCategory = (data) => {
		worksideConfirmAlert({
			message: "Are you sure you want to delete this category?",
			action: removeSingleCategory,
		});
	};

	const removeSingleCategory = (data) => {
		// Remove the category from the group tree data
		const updatedData = deleteItemById(groupTreeData, selectedNodeId);

		setGroupTreeData(updatedData);
		setHasUnsavedChanges(true);
		setRemoveSingleCategoryModalOpen(false);
		setOpen(false);
	};

	const handleRemoveSingleUser = (data) => {
		worksideConfirmAlert({
			message: "Are you sure you want to delete this user?",
			action: removeSingleUser,
		});
	};

	const removeSingleUser = (data) => {
		const updatedData = deleteItemById(groupTreeData, selectedNodeId);

		setGroupTreeData(updatedData);
		setHasUnsavedChanges(true);
		setRemoveSingleUserModalOpen(false);
		setOpen(false);
	};

	const addGroupWithChildren = (
		data,
		parentId,
		parentLabel,
		parentType,
		newGroupLabel,
	) => {
		return data.map((node) => {
			// Check if the node matches the parent criteria
			if (
				node.id === parentId &&
				node.label === parentLabel &&
				node.type === parentType
			) {
				return {
					...node,
					children: [
						...node.children,
						{
							id: `${node.id}-group-${newGroupLabel.toLowerCase().replace(/\s/g, "-")}`,
							label: newGroupLabel,
							type: "group",
							children: [
								{
									id: `${node.id}-group-${newGroupLabel.toLowerCase().replace(/\s/g, "-")}-category`,
									label: "Category",
									type: "group-category",
									children: [],
								},
								{
									id: `${node.id}-group-${newGroupLabel.toLowerCase().replace(/\s/g, "-")}-user`,
									label: "User",
									type: "group-user",
									children: [],
								},
							],
						},
					],
				};
			}
			// Recursively process children if they exist
			if (node?.children) {
				return {
					...node,
					children: addGroupWithChildren(
						node.children,
						parentId,
						parentLabel,
						parentType,
						newGroupLabel,
					),
				};
			}

			return node;
		});
	};

	const addCategoryToSpecificGroupCategory = (
		data,
		parentLabel,
		parentType,
		groupCategoryLabel,
		groupCategoryType,
		newCategoryLabel,
	) => {
		return data.map((node) => {
			// Check if the node matches the parent criteria
			if (node.label === parentLabel && node.type === parentType) {
				return {
					...node,
					children: node.children.map((child) => {
						// Check if the child matches the group-category criteria
						if (
							child.label === groupCategoryLabel &&
							child.type === groupCategoryType
						) {
							return {
								...child,
								children: [
									...child.children,
									{
										id: `${parentLabel}-${newCategoryLabel.toLowerCase().replace(/\s/g, "-")}`,
										label: newCategoryLabel,
										type: "category",
									},
								],
							};
						}
						return child;
					}),
				};
			}

			// Recursively process children if they exist
			if (node.children) {
				return {
					...node,
					children: addCategoryToSpecificGroupCategory(
						node.children,
						parentLabel,
						parentType,
						groupCategoryLabel,
						groupCategoryType,
						newCategoryLabel,
					),
				};
			}

			return node;
		});
	};

	const addUserToSpecificGroupUser = (
		data,
		parentLabel,
		parentType,
		groupUserLabel,
		groupUserType,
		newUserLabel,
	) => {
		return data.map((node) => {
			// Check if the node matches the parent criteria
			if (node.label === parentLabel && node.type === parentType) {
				return {
					...node,
					children: node.children.map((child) => {
						// Check if the child matches the group-user criteria
						if (
							child.label === groupUserLabel &&
							child.type === groupUserType
						) {
							return {
								...child,
								children: [
									...child.children,
									{
										id: `${parentLabel}-${newUserLabel
											.toLowerCase()
											.replace(/\s/g, "-")
											.replace(/\(.*?\)/g, "")
											.trim()}`,
										label: newUserLabel,
										type: "user",
									},
								],
							};
						}
						return child;
					}),
				};
			}

			// Recursively process children if they exist
			if (node.children) {
				return {
					...node,
					children: addUserToSpecificGroupUser(
						node.children,
						parentLabel,
						parentType,
						groupUserLabel,
						groupUserType,
						newUserLabel,
					),
				};
			}

			return node;
		});
	};

	const deleteChildrenByParentId = (data, parentId) => {
		return data.map((node) => {
			// Check if the current node matches the parentId
			if (node.id === parentId) {
				return {
					...node,
					children: [], // Clear children
				};
			}

			// Recursively process children if they exist
			if (node.children) {
				return {
					...node,
					children: deleteChildrenByParentId(node.children, parentId),
				};
			}

			return node;
		});
	};

	const deleteItemById = (data, targetId) => {
		return data
			.map((node) => {
				// Check if the current node has children
				if (node.children) {
					return {
						...node,
						children: deleteItemById(node.children, targetId),
					};
				}

				// Return the node if it doesn't match the targetId
				return node.id === targetId ? null : node;
			})
			.filter(Boolean); // Remove null values
	};

	const handleItemSelectionToggle = (event, itemId, isSelected) => {
		if (isSelected) {
			setSelectedNodeId(itemId);

			const type = findTypeById(groupTreeData, itemId);
			const label = findLabelById(groupTreeData, itemId);
			const nodeData = {
				id: itemId,
				type: type,
				text: label,
			};
			handleNodeSelect(nodeData);
		}
	};

	const handleItemClicked = (event, itemId) => {
		setSelectedNodeId(itemId);
		const type = findTypeById(groupTreeData, itemId);
		const label = findLabelById(groupTreeData, itemId);
		const nodeData = {
			id: itemId,
			type: type,
			text: label,
		};
		handleNodeSelect(nodeData);
	};

	const handleNodeSelect = (nodeData) => {
		const type = nodeData.type;
		setSelectedNodeLabel(nodeData.text);

		if (type === "supplier") {
			setModeFlags("addGroup");
			setOpen(true);
		}
		if (type === "group") {
			setModeFlags("addCategory");
			setOpen(true);
		}
		if (type === "group-category") {
			setModeFlags("removeCategory");
			setOpen(true);
		}
		if (type === "users") {
			setModeFlags("addUser");
			setOpen(true);
		}
		if (type === "group-user") {
			setModeFlags("removeUser");
			setOpen(true);
		}
		if (type === "category") {
			setModeFlags("removeSingleCategory");
			setOpen(true);
		}
		if (type === "user") {
			setModeFlags("removeSingleUser");
			setOpen(true);
		}
	};

	const GetSupplierId = async (supplierName) => {
		// TODO Fix This
		const response = await axios.get(
			// "http://localhost:4000/api/firm",
			`${process.env.REACT_APP_MONGO_URI}/api/firm`,
		);
		const data = response.data;
		const supplierResult = data.filter((d) => d.name === supplierName);
		if (supplierResult.length === 0) {
			toast.error("Supplier Not Found");
			return null;
		}
		const supplierId = supplierResult[0]._id;
		return supplierId;
	};

	const InitializeGroupTreeData = (supplierName, supplierId) => {
		setCurrentSupplierId(supplierId);
		setCurrentSupplier(supplierName);
		const data = [
			{
				supplier_id: supplierId,
				id: supplierName,
				label: supplierName,
				type: "supplier",
				children: [],
			},
		];
		setGroupTreeData(data);
		setHasUnsavedChanges(false);
	};

	const SetGroupTreeDataFromDB = (groupTreeData) => {
		setGroupTreeData([]);
		setGroupTreeData((prevArray) => [...prevArray, groupTreeData]);
		setCurrentSupplierId(groupTreeData.supplier_id);
		setCurrentSupplier(groupTreeData.label);
	};

	const GetSupplierGroupData = async (supplierName) => {
		GetSupplierId(supplierName).then((id) => {
			if (id) {
				// const fetchString = `http://localhost:4000/api/suppliergroup/${id}`;
				const fetchString = `${process.env.REACT_APP_MONGO_URI}/api/suppliergroup/${id}`;
				const requestOptions = {
					method: "GET",
					headers: { "Content-Type": "application/json" },
				};

				try {
					fetch(fetchString, requestOptions).then((response) => {
						if (response.status === 200) {
							response.json().then((data) => {
								if (data) {
									SetGroupTreeDataFromDB(data);
								} else {
									InitializeGroupTreeData(supplierName, id);
									console.log("Supplier Group Not Found");
								}
							});
						} else if (response.status === 300) {
							console.log("No Data Found");
							InitializeGroupTreeData(supplierName, id);
						} else {
							console.log("Error: ", response.status);
						}
					});
				} catch (error) {
					setIsLoading(false);
					window.alert(`Error: ${error}`);
					console.error(error);
				}
			}
		});
	};

	const handleSupplierSelectionChange = (selected) => {
		const index = _.findIndex(supplierOptions, {
			label: selected.value,
		});
		setSupplierIndex(index);
		GetSupplierGroupData(selected.value);
	};

	const getAllItemsWithChildrenItemIds = () => {
		const itemIds = [];
		const registerItemId = (item) => {
			if (item.children?.length) {
				itemIds.push(item.id);
				item.children.forEach(registerItemId);
			}
		};

		groupTreeData.forEach(registerItemId);

		return itemIds;
	};

	useEffect(() => {
		expandAllTreeItems();
	}, [groupTreeData]);

	const expandAllTreeItems = () => {
		const allNodeIds = generateNodeIds(groupTreeData);
		setExpandedItems(allNodeIds);
		setExpandAll(true);
	};

	const generateNodeIds = (nodes) => {
		const ids = [];
		const traverse = (node) => {
			ids.push(node.id);
			if (node.children) {
				node.children.forEach(traverse);
			}
		};
		nodes.forEach(traverse);
		return ids;
	};
	const handleExpandAll = () => {
		setExpandedItems((oldExpanded) =>
			oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds() : [],
		);
		setExpandAll(!expandAll);
	};

	const handleNodeToggle = (event, nodeIds) => {
		// Ensure nodes can only expand, not collapse
		setExpandedItems((prevExpanded) =>
			Array.from(new Set([...prevExpanded, ...nodeIds])),
		);
	};

	const onSaveChanges = async () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(groupTreeData),
		};
		try {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/suppliergroup/`,
				requestOptions,
			);
			const jsonData = await response.json();
			setIsLoading(false);
			// toast.success("Changes Saved");
			window.alert("Changes Saved ", JSON.stringify(jsonData));
			setHasUnsavedChanges(false);
		} catch (error) {
			setIsLoading(false);
			window.alert(`Error: ${error}`);
			console.error(error);
		}
	};

	const onCancelChanges = () => {
		setHasUnsavedChanges(false);
	};

	// const RefreshData = () => {
	// 	setRefreshFlag(true);
	// };

	return (
		<div className="flex-grow bg-white p-2 relative">
			<div className="flex items-center justify-between">
				<div className="flex gap-2">
					{hasUnsavedChanges && (
						<button
							className={
								"bg-green-500 text-black font-bold py-1 px-4 rounded mt-1 text-base mr-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4 "
							}
							type="button"
							onClick={onSaveChanges}
						>
							Save Changes
						</button>
					)}
					{hasUnsavedChanges && (
						<button
							className={
								"bg-red-300 text-black font-bold py-1 px-4 rounded mt-1 text-base mr-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
							}
							type="button"
							onClick={onCancelChanges}
						>
							Cancel Changes
						</button>
					)}
					<button
						className={
							"bg-green-500 text-black font-bold py-1 px-4 rounded mt-1 text-base border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
						}
						type="button"
						onClick={handleExpandAll}
					>
						{expandAll ? "Collapse All" : "Expand All"}
					</button>
				</div>
				{/* Place Supplier Select Here */}
				<div className="w-72">
					<Select
						className="basic-single"
						classNamePrefix="select"
						width="100%"
						value={supplierOptions[supplierIndex]}
						onChange={handleSupplierSelectionChange}
						name="supplier"
						options={supplierOptions}
						styles={customStyles}
						isDisabled={hasUnsavedChanges}
					/>
				</div>
			</div>
			<Box sx={{ minHeight: 400, minWidth: 250, width: 800 }}>
				<RichTreeView
					apiRef={apiRef}
					defaultExpandedItems={["grid"]}
					slots={{ item: CustomTreeItem }}
					items={groupTreeData}
					expandedItems={expandedItems}
					// onExpandedItemsChange={handleExpandedItemsChange}
					onItemSelectionToggle={handleItemSelectionToggle}
					// onNodeToggle={handleNodeToggle}
					onNodeToggle={handleNodeToggle}
					classes={{ root: useStyles.root, selected: useStyles.selected }}
					onItemClick={handleItemClicked}
					onContextMenu={(event, itemId) => {
						handleContextMenu(event, itemId);
					}}
				/>
			</Box>
			<Menu
				open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					contextMenu !== null
						? { top: contextMenu.mouseY, left: contextMenu.mouseX }
						: undefined
				}
			>
				<MenuItem onClick={handleClose}>
					Action 1 for Node {clickedNode}
				</MenuItem>
				<MenuItem onClick={handleClose}>
					Action 2 for Node {clickedNode}
				</MenuItem>
			</Menu>
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
						<p id="child-modal-description" />
						{addGroupModalOpen && (
							<AddGroupForm
								mode="addGroup"
								currentNodeText={selectedNodeLabel}
								AddGroupItem={handleAddGroup}
								currentSupplier={null}
								closeDialog={handleCloseModal}
							/>
						)}
						{addCategoryModalOpen && (
							<AddCategoryOrUserDialog
								currentSupplier={currentSupplier}
								currentNodeText={selectedNodeLabel}
								addCategory={handleAddCategory}
								addUser={handleAddUser}
								closeDialog={handleCloseModal}
							/>
						)}
						{addUserModalOpen && (
							<AddCategoryOrUserDialog
								currentSupplier={currentSupplier}
								currentNodeText={selectedNodeLabel}
								addCategory={handleAddCategory}
								addUser={handleAddUser}
								closeDialog={handleCloseModal}
							/>
						)}
						{removeCategoryModalOpen && (
							<RemoveCategoryOrUserForm
								mode="removeCategory"
								currentNodeText={selectedNodeLabel}
								removeItem={handleRemoveCategory}
								// currentSupplier={null}
								closeDialog={handleCloseModal}
							/>
						)}
						{removeUserModalOpen && (
							<RemoveCategoryOrUserForm
								mode="removeUser"
								currentNodeText={selectedNodeLabel}
								removeItem={handleRemoveUser}
								// currentSupplier={null}
								closeDialog={handleCloseModal}
							/>
						)}
						{removeSingleCategoryModalOpen && (
							<RemoveCategoryOrUserForm
								mode="removeSingleCategory"
								currentNodeText={selectedNodeLabel}
								removeItem={handleRemoveSingleCategory}
								// currentSupplier={null}
								closeDialog={handleCloseModal}
							/>
						)}
						{removeSingleUserModalOpen && (
							<RemoveCategoryOrUserForm
								mode="removeSingleUser"
								currentNodeText={selectedNodeLabel}
								removeItem={handleRemoveSingleUser}
								// currentSupplier={null}
								closeDialog={handleCloseModal}
							/>
						)}
						{/* </p> */}
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
	closeDialog,
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
		if (name === "") {
			setErrorMsg("Name Cannot Be Empty");
			return;
		}
		setErrorMsg("");
		AddGroupItem(name);
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
			<div className="flex items-center justify-center gap-7">
				<button
					className="bg-green-300 hover:bg-green-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
					type="button"
					// disabled={!buttonEnabled}
					onClick={handleAddGroup}
				>
					{buttonLabel}
				</button>
				<button
					className="bg-red-300 hover:bg-red-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
					type="button"
					// disabled={!buttonEnabled}
					onClick={closeDialog}
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

const RemoveCategoryOrUserForm = ({
	mode,
	currentNodeText,
	removeItem,
	closeDialog,
}) => {
	let label = "";
	if (mode === "removeCategory") {
		label = "Remove All Children from Selected Category?";
	}
	if (mode === "removeUser") {
		label = "Remove All Users?";
	}
	if (mode === "removeSingleCategory") {
		label = `Remove Category ${currentNodeText}`;
	}
	if (mode === "removeSingleUser") {
		label = `Remove User ${currentNodeText}`;
	}

	const handleClose = () => {
		closeDialog();
	};

	const handleDelete = () => {
		removeItem(currentNodeText);
		handleClose();
	};

	return (
		<div>
			<div className="flex items-center justify-center">
				<Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
					{label}
				</Typography>
			</div>
			{/* Buttons */}
			<Box>
				<div className="flex items-center justify-center gap-10 mt-5">
					<button
						className="bg-green-300 hover:bg-green-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-2 border-black"
						type="button"
						// disabled={!buttonEnabled}
						onClick={handleDelete}
					>
						Remove
					</button>
					<button
						className="bg-red-300 hover:bg-red-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-2 border-black"
						type="button"
						// disabled={!buttonEnabled}
						onClick={handleClose}
					>
						Cancel
					</button>
				</div>
			</Box>
		</div>
	);
};

const AddCategoryOrUserDialog = ({
	currentSupplier,
	currentNodeText,
	addCategory,
	addUser,
	closeDialog,
}) => {
	const [selection, setSelection] = useState("addCategory");
	const [selectedOption, setSelectedOption] = useState(null);
	const [contactList, setContactList] = useState([]);
	const [fullContactList, setFullContactList] = useState([]);
	const [categoryList, setCategoryList] = useState([]);
	const [userName, setUserName] = useState("");
	const [errorMsg, setErrorMsg] = useState("");

	const label = `Add Category/User To ${currentNodeText}`;

	const handleClose = () => {
		closeDialog();
	};

	const handleAdd = () => {
		if (selection === "addCategory") addCategory(selectedOption.value);
		else addUser({ username: selectedOption.value, name: userName });

		localStorage.setItem("addState", selection);

		handleClose();
	};

	useEffect(() => {
		const mode = localStorage.getItem("addState");
		if (mode) setSelection(mode);
	}, []);

	useEffect(() => {
		// Get the list of users if mode === addUser
		const fetchContacts = async () => {
			const response = await fetch(
				// "http://localhost:4000/api/contact",
				`${process.env.REACT_APP_MONGO_URI}/api/contact`,
			);
			const json = await response.json();
			const customerResult = json.filter((j) => j.firm === currentSupplier);
			if (customerResult.length === 0) {
				setErrorMsg("No Users Found for this Supplier");
				return;
			}
			setFullContactList(customerResult);
			const contacts = customerResult.map((r) => ({
				value: r.username,
				label: r.username,
			}));
			setContactList(contacts);
		};
		fetchContacts();
	}, []);

	const getUniqueCategories = (data) => {
		const uniqueCategories = Array.from(
			new Set(data.map((item) => item.categoryname)),
		).map((categoryname) => ({
			value: categoryname,
			label: categoryname,
		}));

		return uniqueCategories;
	};

	useEffect(() => {
		const fetchCategories = async () => {
			// TODO Change Back
			const response = await fetch(
				// "http://localhost:4000/api/product",
				`${process.env.REACT_APP_MONGO_URI}/api/product`,
			);
			const json = await response.json();
			const categories = getUniqueCategories(json);
			setCategoryList(categories);
		};
		fetchCategories();
	}, []);

	const handleRadioChange = (event) => {
		setSelection(event.target.value);
		setSelectedOption(null);
	};

	const getUserFullName = (data, username) => {
		// Find the user by username
		const user = data.find((item) => item.username === username);

		// If user exists, return the firstname and lastname
		if (user) {
			return { firstname: user.firstname, lastname: user.lastname };
		}

		// Return null if the user is not found
		return null;
	};

	const onChangeSelectedOption = (selected) => {
		setSelectedOption(selected);
		if (selection === "addUser") {
			const result = getUserFullName(fullContactList, selected.value);
			if (result) {
				setErrorMsg("");
				setUserName(`${result.firstname} ${result.lastname}`);
			} else {
				setErrorMsg("User Not Found");
			}
		}
	};

	return (
		<div>
			<div className="flex items-center justify-center">
				<Typography id="modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
					{label}
				</Typography>
			</div>
			{/* Radio Buttons */}
			<div className="flex items-center justify-center">
				<RadioGroup
					row
					value={selection}
					onChange={handleRadioChange}
					sx={{ mb: 2 }}
				>
					<FormControlLabel
						value="addCategory"
						control={<Radio />}
						label="Add Category"
					/>
					<FormControlLabel
						value="addUser"
						control={<Radio />}
						label="Add User"
					/>
				</RadioGroup>
			</div>
			{/* React-Select */}
			{selection === "addCategory" && (
				<Select
					options={categoryList}
					value={selectedOption}
					onChange={onChangeSelectedOption}
					placeholder="Select an option"
				/>
			)}
			{selection === "addUser" && (
				<Select
					options={contactList}
					value={selectedOption}
					onChange={onChangeSelectedOption}
					placeholder="Select an option"
				/>
			)}
			{/* Buttons */}
			<Box>
				<div className="flex items-center justify-center gap-10 mt-5">
					<button
						className="bg-green-300 hover:bg-green-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
						type="button"
						// disabled={!buttonEnabled}
						onClick={handleAdd}
					>
						Add
					</button>
					<button
						className="bg-red-300 hover:bg-red-600 text-black w-32 font-bold py-1 px-4 rounded mt-3 border-[1px] border-solid border-black text-bold my-1 border-r-4 border-b-4"
						type="button"
						// disabled={!buttonEnabled}
						onClick={handleClose}
					>
						Cancel
					</button>
				</div>
				{/* <div className="flex items-center justify-center gap-10 mt-5">
					<Button variant="contained" color="primary" onClick={handleAdd}>
						Add
					</Button>
					<Button variant="outlined" color="secondary" onClick={handleClose}>
						Cancel
					</Button>
				</div> */}
			</Box>
		</div>
	);
};

const worksideConfirmAlert = ({ message, action }) => {
	confirmAlert({
		title: "Workside Software",
		message: message,
		buttons: [
			{
				label: "Yes",
				onClick: () => {
					action();
					return true;
				},
			},
			{
				label: "No",
				onClick: () => {
					return false;
				},
			},
		],
	});
};

export default SupplierGroupUsersTabX;
