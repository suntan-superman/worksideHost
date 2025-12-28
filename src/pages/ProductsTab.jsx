/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	ExcelExport,
	Selection,
	Edit,
	Filter,
	Inject,
	Page,
	Toolbar,
	Resize,
	Freeze,
} from "@syncfusion/ej2-react-grids";
import ProductsEditTemplate from "../components/ProductsEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";

import { GetProducts } from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

import { useToast } from "../contexts/ToastContext";

import "../index.css";
import "../App.css";

let gridPageSize = 10;


// TODO Delete
// TODO Update
// TODO Create

/**
 * ProductsTab Component
 *
 * This component renders a product management interface using a grid layout.
 * It allows users to view, add, edit, and delete products, as well as export product data to Excel.
 * The component integrates with a backend API for CRUD operations and uses React Query for data fetching.
 *
 * Features:
 * - Displays a grid of products with filtering, paging, and resizing capabilities.
 * - Supports adding, editing, and deleting products based on user access level.
 * - Allows exporting product data to an Excel file.
 * - Includes a confirmation dialog for save operations.
 * - Automatically refetches product data at regular intervals.
 *
 * Hooks:
 * - `useRef`: To reference the grid component.
 * - `useState`: To manage component state, including product list, modals, and selected records.
 * - `useQuery`: To fetch product data from the backend API.
 * - `useEffect`: To handle side effects, such as setting grid page size and updating the product list.
 *
 * Props: None
 *
 * State Variables:
 * - `productList`: Stores the list of products fetched from the API.
 * - `insertFlag`: Indicates whether the current operation is an insert.
 * - `openUpdateModal`: Controls the visibility of the update confirmation dialog.
 * - `currentRecord`: Stores the record being edited or added.
 * - `messageText`: Stores the message text for the confirmation dialog.
 * - `selectedRecord`: Stores the ID of the currently selected product.
 *
 * Functions:
 * - `GetAccessLevel`: Retrieves the user's access level from local storage.
 * - `toolbarClick`: Handles toolbar actions, such as exporting to Excel.
 * - `handleProductDelete`: Deletes a selected product by making a DELETE request to the API.
 * - `actionComplete`: Handles grid actions, such as editing, adding, saving, and deleting.
 * - `rowSelectedProduct`: Updates the selected record when a row is selected in the grid.
 * - `SaveProductsData`: Saves or updates product data by making POST or PATCH requests to the API.
 * - `onProductLoad`: Configures grid settings when the grid is loaded.
 *
 * Dependencies:
 * - React
 * - React Query
 * - Syncfusion Grid Components
 *
 * Returns:
 * - A JSX element containing the product grid and confirmation dialog.
 */
const ProductsTab = () => {
	const toast = useToast();
	let productsGridRef = useRef(null);

	const [productList, setProductList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const [openUpdateModal, setOpenUpdateModal] = useState(false);
	const [currentRecord, setCurrentRecord] = useState([]);

	const [messageText, setMessageText] = useState("");

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
		// allowDeleting: true,
		mode: "Dialog",
		template: (props) => <ProductsEditTemplate {...props} />,
	};
	const toolbarOptions = ["Add", "Edit", "ExcelExport"];

	const [selectedRecord, setSelectedRecord] = useState(null);
	const settings = { mode: "Row" };

	// Get the firms data
	const { data: productsData, isLoading: productsLoading } = useQuery({
		queryKey: ["products", "all"],
		queryFn: () => GetProducts(),
		refetchInterval: 1000 * 10, // 1 minute refetch
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		// staleTime: 1000 * 60 * 60 * 24, // 1 Day
		retry: 3,
	});

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		if (productsData === undefined || productsData === null) return;
		const { data } = productsData;
		setProductList(data);
	}, [productsData]);

	const toolbarClick = (args) => {
		console.log(`Toolbar Click: ${args.item.id}`);
		if (productsGridRef && args.item.id === "productGridElement_excelexport") {
			const excelExportProperties = {
				fileName: "worksideProducts.xlsx",
			};
			console.log("Excel Export");
			productsGridRef.excelExport(excelExportProperties);
		}
	};

	const handleProductDelete = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/api/product/${selectedRecord}`,
			{
				method: "DELETE",
			},
		);
		const json = await response.json();

		if (response.ok) {
			toast.success("Record Successfully Deleted...");
		}
	};

	const actionComplete = async (args) => {
		// console.log(`Action Complete: ${args.requestType}`);
		if (args.requestType === "beginEdit" || args.requestType === "add") {
			const dialog = args.dialog;
			dialog.showCloseIcon = false;
			dialog.height = 400;
			dialog.width = 600;
			// Set Insert Flag
			setInsertFlag(args.requestType === "add");
			// change the header of the dialog
			dialog.header =
				args.requestType === "beginEdit"
					? `Edit ${args.rowData.categoryname} - ${args.rowData.productname} Record`
					: "Workside New Product";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
			setMessageText(
				`Update ${args.data.categoryname}- ${args.data.productname} Details?`,
			);
			setCurrentRecord(data);
			setOpenUpdateModal(true);
		}
		if (args.requestType === "delete") {
			// Delete Data
			handleProductDelete();
			setInsertFlag(false);
		}
	};

	const rowSelectedProduct = () => {
		if (productsGridRef) {
			/** Get the selected row indexes */
			const selectedrowindex = productsGridRef.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(productList[selectedrowindex]._id);
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
		}
	};

	const SaveProductsData = async () => {
		// Close Modal
		setOpenUpdateModal(false);
		if (insertFlag === true) {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/product/`,
				{
					method: "POST",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok)
				toast.success("Record Successfully Added...");
			setOpenUpdateModal(false);
		} else {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/product/${currentRecord._id}`,
				{
					method: "PATCH",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok)
				toast.success("Record Successfully Updated...");
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	const onProductLoad = () => {
		const gridElement = document.getElementById("productGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 2;
			gridInstance.pageSettings.freeze = true;
		}
	};

	if (productsLoading) {
		return (
			<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="productGridElement"
					dataSource={productList}
					actionComplete={actionComplete}
					allowSelection
					allowFiltering
					allowResizing
					allowPaging
					allowExcelExport
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					toolbarClick={toolbarClick}
					rowSelected={rowSelectedProduct}
					enablePersistence
					editSettings={editOptions}
					// pageSize={gridPageSize}
					// frozenColumns={2}
					load={onProductLoad}
					width="95%"
					ref={(g) => {
						productsGridRef = g;
					}}
				>
					<ColumnsDirective>
						<ColumnDirective
							field="productid"
							headerText="Id"
							textAlign="Left"
							width="50"
							isPrimaryKey="true"
							allowEditing="false"
							visible={false}
						/>
						<ColumnDirective
							field="categoryname"
							headerText="Category"
							editType="dropdownedit"
							textAlign="Left"
							width="200"
						/>
						<ColumnDirective
							field="productname"
							headerText="Service/Products"
							textAlign="Left"
							width="100"
						/>
						<ColumnDirective
							field="description"
							headerText="Description"
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
						services={[
							Selection,
							Edit,
							Filter,
							Page,
							Toolbar,
							Resize,
							Freeze,
							ExcelExport,
						]}
					/>
				</GridComponent>
			</div>
			{openUpdateModal && (
				<ConfirmationDialog
					open={openUpdateModal}
					message={messageText}
					onConfirm={() => SaveProductsData()}
					onCancel={() => setOpenUpdateModal(false)}
				/>
			)}
		</div>
	);
};

export default ProductsTab;
