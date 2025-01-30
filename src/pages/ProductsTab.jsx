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

import { showSuccessDialogWithTimer } from "../utils/useSweetAlert";

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

	// Get the firms data
	const {
		data: productsData,
	} = useQuery({
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
			`${process.env.REACT_APP_MONGO_URI}/api/product/${selectedRecord}`,
			{
				method: "DELETE",
			},
		);
		const json = await response.json();

		if (response.ok) {
			showSuccessDialogWithTimer("Record Successfully Deleted...");
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

			if (response.ok) showSuccessDialogWithTimer("Record Successfully Added...");
			setOpenUpdateModal(false);
		} else {
			const response = await fetch(
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

			if (response.ok)
				showSuccessDialogWithTimer("Record Successfully Updated...");
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
