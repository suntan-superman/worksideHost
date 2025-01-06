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
import { toast } from "react-toastify";
import ProductsEditTemplate from "../components/ProductsEditTemplate";
import ConfirmationDialog from "../components/ConfirmationDialog";

import "../index.css";
import "../App.css";

let gridPageSize = 10;


// TODO Delete
// TODO Update
// TODO Create

const ProductsTab = () => {
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
		};
		fetchProducts();
	}, []);

	const toolbarClick = (args) => {
		console.log(`Toolbar Click: ${args.item.id}`);
		if (productsGridRef && args.item.id === "productGridElement_excelexport") {
			console.log("Excel Export");
			productsGridRef.excelExport();
		}
	};

	const handleProductDelete = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/product/${selectedRecord}`,
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
					? `Edit Record of ${args.rowData.categoryname} - ${args.rowData.productname}`
					: "New Product";
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
				// "http://localhost:4000/api/product/",
				`${process.env.REACT_APP_MONGO_URI}/api/product/`,
				{
					method: "POST",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok) toast.success("Record Successfully Added...");
			setOpenUpdateModal(false);
		} else {
			const response = await fetch(
				// `http://localhost:4000/api/product/${currentRecord._id}`,
				`${process.env.REACT_APP_MONGO_URI}/api/product/${currentRecord._id}`,
				{
					method: "PATCH",
					body: JSON.stringify(currentRecord),
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			const json = await response.json();

			if (response.ok) toast.success("Record Successfully Updated...");
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
