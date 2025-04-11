/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
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
import SupplierProductEditTemplate from "../components/SupplierProductEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import "../index.css";
import "../App.css";

import {
	GetProducts,
	GetSupplierIDFromName,
	GetAllSuppliers,
} from "../api/worksideAPI";

let gridPageSize = 10;

// TODO Delete
// TODO Update
// TODO Create

/**
 * SupplierProductsTab Component
 *
 * This component renders a grid interface for managing supplier-product relationships.
 * It allows users to view, add, edit, and delete supplier-product records based on their access level.
 * The component fetches data from APIs, handles user interactions, and manages state for the grid and modals.
 *
 * @component
 *
 * @returns {JSX.Element} The SupplierProductsTab component.
 *
 * @description
 * - Fetches product and supplier-product data from the server on mount.
 * - Displays a grid with supplier-product data, supporting filtering, paging, and editing.
 * - Handles CRUD operations for supplier-product records via API calls.
 * - Displays a confirmation dialog before saving or updating records.
 * - Access level determines whether editing, adding, or deleting is allowed.
 *
 * @state
 * - `productList` {Array|null} - List of products fetched from the server.
 * - `supplierProductList` {Array|null} - List of supplier-product records fetched from the server.
 * - `openUpdateModal` {boolean} - Controls the visibility of the confirmation dialog.
 * - `messageText` {string} - Message displayed in the confirmation dialog.
 * - `insertFlag` {boolean} - Indicates whether the current operation is an insert.
 * - `currentRecord` {Object|null} - The record being edited or added.
 * - `selectedRecord` {Object|null} - The currently selected record in the grid.
 *
 * @methods
 * - `GetAccessLevel` - Retrieves the user's access level from localStorage.
 * - `actionComplete` - Handles grid actions like editing, adding, and saving.
 * - `rowSelectedSupplierProduct` - Handles row selection in the grid.
 * - `onSupplierProductLoad` - Configures the grid on load.
 * - `SaveSupplierProductsData` - Saves or updates supplier-product data via API calls.
 *
 * @dependencies
 * - `GridComponent` - Syncfusion grid component for displaying and managing data.
 * - `ColumnsDirective`, `ColumnDirective` - Define the structure of the grid columns.
 * - `Inject` - Injects required Syncfusion grid services.
 * - `ConfirmationDialog` - Custom dialog component for confirming save/update actions.
 *
 * @hooks
 * - `useRef` - Used to reference the grid component.
 * - `useState` - Manages component state.
 * - `useEffect` - Fetches data on component mount.
 *
 * @example
 * <SupplierProductsTab />
 */
const SupplierProductsTab = () => {
	let supplierProductsGridRef = useRef(null);
	const [productList, setProductList] = useState(null);
	const [supplierProductList, setSupplierProductList] = useState(null);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [messageText, setMessageText] = useState("");
	const [insertFlag, setInsertFlag] = useState(false);
	const [currentRecord, setCurrentRecord] = useState(null);

	const GetAccessLevel = () => {
		const value = localStorage.getItem("accessLevel");
		if (value) {
			return value;
		}
		return 0;
	};

	const accessLevel = GetAccessLevel();

	const editOptions = {
		allowEditing: accessLevel > 2,
		allowAdding: accessLevel > 2,
		allowDeleting: accessLevel > 2,
		mode: "Dialog",
		template: (props) => <SupplierProductEditTemplate {...props} />,
	};
	const toolbarOptions = ["Add", "Edit", "Delete"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/product`,
			);
			const json = await response.json();

			setProductList(json);

			// if (response.ok) {
			// 	productDispatch({ type: "GET_PRODUCTS", payload: json });
			// }
		};
		fetchProducts();
	}, []);
	// }, [productDispatch]);

	useEffect(() => {
		const fetchSupplierProducts = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/supplierproduct`,
			);
			const json = await response.json();

			setSupplierProductList(json);
			// if (response.ok) {
			// 	supplierProductDispatch({
			// 		type: "GET_SUPPLIERPRODUCTS",
			// 		payload: json,
			// 	});
			// }
		};
		fetchSupplierProducts();
	}, []);
	// }, [supplierProductDispatch]);

	const actionComplete = async (args) => {
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			dialog.height = 400;
			dialog.width = 600;
			setInsertFlag(args.requestType === "add");
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit ${args.rowData.supplier}-${args.rowData.product} Record`
					: "Workside New Supplier-Product Record";
		}
		if (args.requestType === "save") {
			const data = args.data;
			console.log("ActionComplete - Received data:", data);

			// Create a clean data object with only required fields
			const cleanData = {
				supplier: data.supplier,
				supplier_id: data.supplier_id,
				category: data.category,
				product: data.product,
				status: data.status,
				statusdate: data.statusdate,
			};

			console.log("ActionComplete - Clean data:", cleanData);
			setMessageText(`Update Supplier: ${data.supplier} Record?`);
			setCurrentRecord(cleanData);
			setOpenUpdateModal(true);
		}
	};

	const rowSelectedSupplierProduct = () => {
		if (supplierProductsGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = supplierProductsGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			// setSelectedRecord(productList[selectedrowindex]._id);
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const onSupplierProductLoad = () => {
		const gridElement = document.getElementById("supplierProductGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			// gridInstance.pageSettings.frozenColumns = 2;
			// gridInstance.pageSettings.freeze = true;
		}
	};

	const GetSupplierIDFromName = async (supplierName) => {
		try {
			console.log("Getting supplier ID for:", supplierName);
			const response = await GetAllSuppliers();
			if (response.status === 200 && response.data) {
				const supplier = response.data.find((s) => s.name === supplierName);
				if (supplier) {
					console.log("Found supplier ID:", supplier._id);
					return supplier._id;
				}
			}
			console.error("No supplier ID found for:", supplierName);
			return null;
		} catch (error) {
			console.error("Error getting supplier ID:", error);
			return null;
		}
	};

	const SaveSupplierProductsData = async () => {
		setOpenUpdateModal(false);
		if (insertFlag === true) {
			console.log("SaveSupplierProductsData - Current record:", currentRecord);

			// Get supplier ID just before saving
			const supplierId = await GetSupplierIDFromName(currentRecord.supplier);
			console.log("Retrieved supplier ID:", supplierId);

			if (!supplierId) {
				showErrorDialog("Failed to get supplier ID. Please try again.");
				return;
			}

			const cleanData = {
				supplier: currentRecord.supplier, // Ensure supplier name is included
				supplierid: supplierId,
				categoryname: currentRecord.category,
				productname: currentRecord.product,
				status: currentRecord.status,
				statusdate: currentRecord.statusdate,
			};

			console.log("SaveSupplierProductsData - Data being sent:", cleanData);
			console.log("Supplier name in cleanData:", cleanData.supplier); // Log supplier name

			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/supplierproduct`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(cleanData),
				},
			);
			const jsonData = await response.json();
			console.log("SaveSupplierProductsData - Response:", jsonData);

			if (response.status === 200 || response.status === 201) {
				showSuccessDialogWithTimer("Record Successfully Added...");
			} else {
				showErrorDialog(`Record Add Failed...${response.status}`);
			}
			setInsertFlag(false);
		} else {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/supplierproduct/${currentRecord._id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(currentRecord),
				},
			);
			const jsonData = await response.json();
			if (response.status === 200) {
				showSuccessDialogWithTimer("Record Successfully Updated...");
			} else {
				showErrorDialog(`Record Update Failed...${response.status}`);
			}
		}
	};

	return (
		<div>
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="supplierProductGridElement"
					dataSource={supplierProductList}
					actionComplete={actionComplete}
					allowSelection
					allowFiltering
					allowResizing
					allowPaging
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					rowSelected={rowSelectedSupplierProduct}
					enablePersistence
					editSettings={editOptions}
					// pageSize={gridPageSize}
					// frozenColumns={2}
					load={onSupplierProductLoad}
					width="95%"
					ref={(g) => {
						supplierProductsGridRef = g;
					}}
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
							field="supplier"
							headerText="Supplier"
							editType="dropdownedit"
							textAlign="Left"
							width="200"
						/>
						<ColumnDirective
							field="category"
							headerText="Category"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="product"
							headerText="Product"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="status"
							headerText="Status"
							editType="dropdownedit"
							textAlign="Left"
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
					</ColumnsDirective>
					<Inject
						services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
					/>
				</GridComponent>
			</div>
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => SaveSupplierProductsData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}
		</div>
	);
};

export default SupplierProductsTab;
