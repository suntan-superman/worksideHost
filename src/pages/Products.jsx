/* eslint-disable */
import React, { useEffect, useState } from "react";
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
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";
// import { useProductContext } from "../hooks/useProductContext";
import "../index.css";

import { useToast } from "../contexts/ToastContext";

const apiUrl = process.env.REACT_APP_API_URL;

let gridPageSize = 12;

/**
 * Products Component
 *
 * This component renders a product management interface using a grid layout.
 * It allows users to view, filter, add, edit, and delete products or services.
 * The component interacts with a backend API to fetch, create, update, and delete product data.
 *
 * Features:
 * - Displays a grid of products with filtering, paging, and selection capabilities.
 * - Supports CRUD operations (Create, Read, Update, Delete) based on user access level.
 * - Shows a loading spinner while data is being fetched.
 * - Dynamically adjusts grid settings based on user preferences stored in localStorage.
 *
 * Hooks:
 * - `useState`: Manages component state for loading, filtered products, selected record, and insert flag.
 * - `useEffect`: Fetches product data on component mount and initializes grid settings.
 *
 * Props: None
 *
 * Local Functions:
 * - `GetAccessLevel`: Retrieves the user's access level from localStorage.
 * - `handleDelete`: Deletes a selected product by making a DELETE request to the API.
 * - `actionComplete`: Handles grid actions such as add, edit, save, and delete.
 * - `rowSelectedProduct`: Updates the selected record when a row is selected in the grid.
 *
 * Dependencies:
 * - `GridComponent` from Syncfusion for rendering the grid.
 * - Environment variable `REACT_APP_API_URL` for API endpoint configuration.
 *
 * Returns:
 * - A JSX element containing the product management interface.
 */
const Products = () => {
	const toast = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [filteredProducts, setFilteredProducts] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);

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
	};
	const toolbarOptions = ["Add", "Edit", "Delete"];
	// const { productsData, dispatch } = useProductContext();

	const [selectedRecord, setSelectedRecord] = useState(null);
	// const [error, setError] = useState(null);
	// const [emptyFields, setEmptyFields] = useState([]);
	const settings = { mode: "Row" };
	let grid = null;

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/product`,
			);
			const json = await response.json();

			if (response.ok) {
				// dispatch({ type: "GET_PRODUCTS", payload: json });
				setFilteredProducts(json);
			}
			setIsLoading(false);
		};
		fetchProducts();
	}, []);
	// }, [dispatch]);

	const handleDelete = async () => {
		const fetchString = `${process.env.REACT_APP_API_URL}/api/product/${selectedRecord}`;
		const response = await fetch(fetchString, {
			method: "DELETE",
		});
		if (response.ok) {
			toast.success("Record Successfully Deleted...");
		}
	};

	const actionComplete = async (args) => {
		if (!grid) return;

		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Product/Services";
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

				if (insertFlag === true) {
					const response = await fetch(
						`${process.env.REACT_APP_API_URL}/api/product/`,
						{
							method: "POST",
							body: JSON.stringify(data),
							headers: {
								"Content-Type": "application/json",
							},
						},
					);

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

	const rowSelectedProduct = () => {
		if (grid) {
			/** Get the selected row indexes */
			const selectedrowindex = grid.getSelectedRowIndexes();
			/** Get the selected records. */
			setSelectedRecord(filteredProducts[selectedrowindex]._id);
			// eslint-disable-next-line prefer-template
			// setEmptyFields([]);
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<Header category="Workside" title="Products" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			<div className="absolute top-[50px] left-[20px] w-[140px] flex flex-row items-center justify-start">
				<GridComponent
					dataSource={filteredProducts}
					actionComplete={actionComplete}
					allowSelection
					allowFiltering
					allowPaging
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
					rowSelected={rowSelectedProduct}
					editSettings={editOptions}
					width="auto"
					gridPageSize={gridPageSize}
					// eslint-disable-next-line no-return-assign
					ref={(g) => {
						grid = g;
					}}
				>
					<ColumnsDirective>
						<ColumnDirective
							field="projectId"
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
							width="200"
						/>
						<ColumnDirective
							field="description"
							headerText="Description"
							textAlign="Left"
							width="200"
						/>
						<ColumnDirective
							field="status"
							headerText="Status"
							editType="dropdownedit"
							textAlign="Left"
							width="120"
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
					<Inject services={[Selection, Edit, Filter, Page, Toolbar]} />
				</GridComponent>
			</div>
		</div>
	);
};

export default Products;
