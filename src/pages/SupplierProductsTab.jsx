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
import { useProductContext } from "../hooks/useProductContext";
import { useSupplierProductContext } from "../hooks/useSupplierProductContext";
import useUserStore from "../stores/UserStore";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

const SupplierProductsTab = () => {
	const accessLevel = useUserStore((state) => state.accessLevel);
	let supplierProductsGridRef = useRef(null);
	const [productList, setProductList] = useState(null);
	const [supplierProductList, setSupplierProductList] = useState(null);
	const editOptions = {
		allowEditing: true,
		allowAdding: true,
		allowDeleting: true,
		mode: "Dialog",
	};
	const toolbarOptions = ["Add", "Edit", "Delete"];
	const { productData, dispatch: productDispatch } = useProductContext();
	const { supplierProductData, dispatch: supplierProductDispatch } =
		useSupplierProductContext();

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

	useEffect(() => {
		const fetchSupplierProducts = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/supplierproduct`,
			);
			const json = await response.json();

			setSupplierProductList(json);
			if (response.ok) {
				supplierProductDispatch({
					type: "GET_SUPPLIERPRODUCTS",
					payload: json,
				});
			}
		};
		fetchSupplierProducts();
	}, [supplierProductDispatch]);

	const supplierProductsActionComplete = async (args) => {
		if (!supplierProductsGridRef) return;
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

	return (
		<div>
			<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
				<GridComponent
					id="supplierProductGridElement"
					dataSource={supplierProductList}
					actionComplete={supplierProductsActionComplete}
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
						{/* <ColumnDirective field='_id' headerText='Id' textAlign='Left' width='50' isPrimaryKey='true' allowEditing='false' visible={false} /> */}
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
		</div>
	);
};

export default SupplierProductsTab;
