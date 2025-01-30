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

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

import "../index.css";
import "../App.css";

let gridPageSize = 10;

// TODO Delete
// TODO Update
// TODO Create

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
					? `Edit ${args.rowData.supplier}-${args.rowData.product} Record`
					: "Workside New Supplier-Product Record";
		}
		if (args.requestType === "save") {
			// Save or Update Data
			const data = args.data;
			// console.log(`Save Project Data Before Modal: ${JSON.stringify(data)}`);
			setMessageText(`Update Project ${args.data.projectname} Details?`);
			setCurrentRecord(data);
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

	const SaveSupplierProductsData = async () => {
		if (insertFlag === true) {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/supplierproduct`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(currentRecord),
				},
			);
			const jsonData = await response.json();
			if (response.status === 200) {
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
