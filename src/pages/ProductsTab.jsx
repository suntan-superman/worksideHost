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
import { toast } from "react-toastify";
import { useProductContext } from "../hooks/useProductContext";
import useUserStore from "../stores/UserStore";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

const ProductsTab = () => {
	const accessLevel = useUserStore((state) => state.accessLevel);
	let productsGridRef = useRef(null);
	const { productData, dispatch: productDispatch } = useProductContext();

	const [productList, setProductList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const editOptions = {
		allowEditing: true,
		allowAdding: true,
		allowDeleting: true,
		mode: "Dialog",
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

			if (response.ok) {
				productDispatch({ type: "GET_PRODUCTS", payload: json });
			}
		};
		fetchProducts();
	}, [productDispatch]);

	const handleProductDelete = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/product/${selectedRecord}`,
			{
				method: "DELETE",
			},
		);
		const json = await response.json();

		if (response.ok) {
			// Clear form useStates
			// ResetUseStates();
			toast.success("Record Successfully Deleted...");
			// dispatch({ type: 'DELETE_PRODUCT', payload: json });
		}
	};

	const productsActionComplete = async (args) => {
		if (!productsGridRef) return;

		if (
			args.requestType === "beginEdit" ||
			args.requestType === "add" ||
			args.requestType === "update" ||
			args.requestType === "save" ||
			args.requestType === "delete"
		) {
			if (args.requestType === "beginEdit" || args.requestType === "add") {
				const { dialog } = args;
				dialog.header = "Workside Products/Services";
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
						`${process.env.REACT_APP_MONGO_URI}/api/product/`,
						{
							method: "POST",
							body: JSON.stringify(data),
							headers: {
								"Content-Type": "application/json",
							},
						},
					);

					const json = await response.json();

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
				handleProductDelete();
				setInsertFlag(false);
			}
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

	return (
		<div>
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="productGridElement"
					dataSource={productList}
					actionComplete={productsActionComplete}
					allowSelection
					allowFiltering
					allowResizing
					allowPaging
					filterSettings={FilterOptions}
					selectionSettings={settings}
					toolbar={toolbarOptions}
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
							headerText="Service/Projects"
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
						services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
					/>
				</GridComponent>
			</div>
		</div>
	);
};

export default ProductsTab;
