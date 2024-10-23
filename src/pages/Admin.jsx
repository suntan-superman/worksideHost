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
import { TabComponent } from "@syncfusion/ej2-react-navigations";
import { MaskedTextBox } from "@syncfusion/ej2-inputs";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { useContactContext } from "../hooks/useContactContext";
import { useFirmContext } from "../hooks/useFirmContext";
import { useRigContext } from "../hooks/useRigContext";
import { useProductContext } from "../hooks/useProductContext";
import { useSupplierProductContext } from "../hooks/useSupplierProductContext";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";

import { Header } from "../components";
import "../index.css";
import "../App.css";

const apiUrl = process.env.REACT_APP_API_URL;

const gridPageSize = 8;

const Admin = () => {
 		const [isLoading, setIsLoading] = useState(false);

	  let firmsGridRef = useRef(null);
		let rigsGridRef = useRef(null);
		let contactsGridRef = useRef(null);
		let productsGridRef = useRef(null);
		let supplierProductsGridRef = useRef(null);

		const [firmList, setFirmList] = useState(null);
		const [rigList, setRigList] = useState(null);
		const [contactList, setContactList] = useState(null);
		const [productList, setProductList] = useState(null);
		const [supplierProductList, setSupplierProductList] = useState(null);
		const [insertFlag, setInsertFlag] = useState(false);
		const editOptions = {
			allowEditing: true,
			allowAdding: true,
			allowDeleting: true,
			mode: "Dialog",
		};
		const toolbarOptions = ["Add", "Edit", "Delete"];
		const { contactsData, dispatch: contactDispatch } = useContactContext();
		const { firmData, dispatch: firmDispatch } = useFirmContext();
		const { rigData, dispatch: rigDispatch } = useRigContext();
		const { productData, dispatch: productDispatch } = useProductContext();
		const { supplierProductData, dispatch: supplierProductDispatch } =
			useSupplierProductContext();

		const [selectedRecord, setSelectedRecord] = useState(null);
		const settings = { mode: "Row" };

		// Set Firm Type Selection Options
		const firmOptions = [
			{ firmType: "CUSTOMER", firmId: "1" },
			{ firmType: "RIGCOMPANY", firmId: "2" },
			{ firmType: "SUPPLIER", firmId: "3" },
			{ firmType: "DELIVERYASSOC", firmId: "4" },
		];

		const firmSelections = {
			params: {
				actionComplete: () => false,
				allowFiltering: true,
				dataSource: new DataManager(firmOptions),
				fields: { text: "firmType", value: "firmType" },
				query: new Query(),
			},
		};

		// Set Location Type Selection Options
		const locationOptions = [
			{ location: "WESTCOAST", locationId: "1" },
			{ location: "GULFCOAST", locationId: "2" },
			{ location: "PERMIAN", locationId: "3" },
			{ location: "EASTCOAST", locationId: "4" },
			{ location: "MIDCONTINENT", locationId: "5" },
		];

		const locationSelections = {
			params: {
				actionComplete: () => false,
				allowFiltering: true,
				dataSource: new DataManager(locationOptions),
				fields: { text: "location", value: "location" },
				query: new Query(),
			},
		};

		useEffect(() => {
			const fetchFirms = async () => {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_MONGO_URI}/api/firm`,
				);
				const json = await response.json();
				setFirmList(json);

				if (response.ok) {
					firmDispatch({ type: "GET_FIRM", payload: json });
				}
				setIsLoading(false);
			};
			fetchFirms();
		}, [firmDispatch]);

		useEffect(() => {
			const fetchRigs = async () => {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_MONGO_URI}/api/rig`,
				);
				const json = await response.json();

				setRigList(json);

				if (response.ok) {
					rigDispatch({ type: "GET_RIG", payload: json });
				}
				setIsLoading(true);
			};
			fetchRigs();
		}, [rigDispatch]);

		useEffect(() => {
			const fetchContacts = async () => {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_MONGO_URI}/api/contact`,
				);
				const json = await response.json();
				setContactList(json);
				setIsLoading(false);
			};
			fetchContacts();
		}, []);

		useEffect(() => {
			const fetchProducts = async () => {
				setIsLoading(true);
				const response = await fetch(
					`${process.env.REACT_APP_MONGO_URI}/api/product`,
				);
				const json = await response.json();

				setProductList(json);

				if (response.ok) {
					productDispatch({ type: "GET_PRODUCTS", payload: json });
				}
				setIsLoading(false);
			};
			fetchProducts();
		}, [productDispatch]);

		useEffect(() => {
			const fetchSupplierProducts = async () => {
				setIsLoading(true);
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
				setIsLoading(false);
			};
			fetchSupplierProducts();
		}, [supplierProductDispatch]);

		const handleFirmDelete = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/firm/${selectedRecord}`,
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
			// setDeleteFlag(false);
			// setEmptyFields([]);
		};

		const handleContactDelete = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/contact/${selectedRecord}`,
				{
					method: "DELETE",
				},
			);
			const json = await response.json();

			// if (!response.ok) {
			//   setError(json.error);
			// }
			if (response.ok) {
				// Clear form useStates
				// ResetUseStates();
				toast.success("Record Successfully Deleted...");
				// dispatch({ type: 'DELETE_PRODUCT', payload: json });
			}
			// setDeleteFlag(false);
			// setEmptyFields([]);
		};

		const handleRigDelete = async () => {
			const response = await fetch(
				`${process.env.REACT_APP_MONGO_URI}/api/rig/${selectedRecord}`,
				{
					method: "DELETE",
				},
			);
			const json = await response.json();

			if (response.ok) {
				// Clear form useStates
				// ResetUseStates();
				toast.success("Record Successfully Deleted...");
			}
			// setDeleteFlag(false);
			// setEmptyFields([]);
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
				// Clear form useStates
				// ResetUseStates();
				toast.success("Record Successfully Deleted...");
				// dispatch({ type: 'DELETE_PRODUCT', payload: json });
			}
		};

		const firmsActionComplete = async (args) => {
			if (!firmsGridRef) return;

			if (
				args.requestType === "beginEdit" ||
				args.requestType === "add" ||
				args.requestType === "update" ||
				args.requestType === "save" ||
				args.requestType === "delete"
			) {
				if (args.requestType === "beginEdit" || args.requestType === "add") {
					const { dialog } = args;
					dialog.header = "Workside Firms";
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
						const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/firm/`, {
							method: "POST",
							body: JSON.stringify(data),
							headers: {
								"Content-Type": "application/json",
							},
						});

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
					handleFirmDelete();
					setInsertFlag(false);
				}
			}
		};

		const contactsActionComplete = async (args) => {
			if (!contactsGridRef) return;
			if (
				args.requestType === "beginEdit" ||
				args.requestType === "add" ||
				args.requestType === "update" ||
				args.requestType === "save" ||
				args.requestType === "delete"
			) {
				if (args.requestType === "beginEdit" || args.requestType === "add") {
					const { dialog } = args;
					dialog.header = "Workside Contacts";
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
							`${process.env.REACT_APP_MONGO_URI}/api/contact/`,
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
					handleContactDelete();
					setInsertFlag(false);
				}
			}
		};

		const rigsActionComplete = async (args) => {
			if (!rigsGridRef) return;

			if (
				args.requestType === "beginEdit" ||
				args.requestType === "add" ||
				args.requestType === "update" ||
				args.requestType === "save" ||
				args.requestType === "delete"
			) {
				if (args.requestType === "beginEdit" || args.requestType === "add") {
					const { dialog } = args;
					dialog.header = "Workside Rigs";
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
						const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/rig/`, {
							method: "POST",
							body: JSON.stringify(data),
							headers: {
								"Content-Type": "application/json",
							},
						});

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
					handleRigDelete();
					setInsertFlag(false);
				}
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
		const supplierProductsActionComplete = async (args) => {
			if (!supplierProductsGridRef) return;
		};

		const rowSelectedFirm = () => {
			if (firmsGridRef) {
				/** Get the selected row indexes */
				const selectedrowindex = firmsGridRef.getSelectedRowIndexes();
				/** Get the selected records. */
				setSelectedRecord(firmList[selectedrowindex]._id);
				// eslint-disable-next-line prefer-template
				// setEmptyFields([]);
			}
		};

		const rowSelectedContact = () => {
			if (contactsGridRef) {
				/** Get the selected row indexes */
				const selectedrowindex = contactsGridRef.getSelectedRowIndexes();
				/** Get the selected records. */
				setSelectedRecord(contactList[selectedrowindex]._id);
				// eslint-disable-next-line prefer-template
				// setEmptyFields([]);
			}
		};

		const rowSelectedRig = () => {
			if (rigsGridRef) {
				/** Get the selected row indexes */
				const selectedrowindex = rigsGridRef.getSelectedRowIndexes();
				/** Get the selected records. */
				setSelectedRecord(rigList[selectedrowindex]._id);
				// eslint-disable-next-line prefer-template
				// setEmptyFields([]);
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

		const rowSelectedSupplierProduct = () => {
			if (supplierProductsGridRef) {
				/** Get the selected row indexes */
				const selectedrowindex =
					supplierProductsGridRef.getSelectedRowIndexes();
				/** Get the selected records. */
				// setSelectedRecord(productList[selectedrowindex]._id);
				// eslint-disable-next-line prefer-template
				// setEmptyFields([]);
			}
		};

		const FilterOptions = {
			type: "Menu",
		};

		// *******************************************************
		// This is for custom phone and email editing in dialog
		// *******************************************************
		let phElem;
		let phObject;
		const createcusphonemaskinputn = () => {
			phElem = document.createElement("input");
			return phElem;
		};
		const destroycusphonemaskinputFn = () => {
			phObject.destroy();
		};
		const readcusphonemaskinputFn = () => phObject.value;
		const writecusphonemaskinputFn = (args) => {
			phObject = new MaskedTextBox({
				// value: args.rowData[args.column.field].toString(),
				value: args.rowData[args.column.field],
				mask: "000-000-0000",
				placeholder: "Phone",
				floatLabelType: "Always",
			});
			phObject.appendTo(phElem);
		};

		const custphonemaskinput = {
			create: createcusphonemaskinputn,
			destroy: destroycusphonemaskinputFn,
			read: readcusphonemaskinputFn,
			write: writecusphonemaskinputFn,
		};

		// const mailidRules = { email: [true, 'Enter valid Email'] };
		// *******************************************************
		// End of custom code
		// *******************************************************
		const onFirmLoad = () => {
			const gridElement = document.getElementById("firmGridElement");
			if (gridElement?.ej2_instances[0]) {
				const gridInstance = gridElement.ej2_instances[0];
				/** height of the each row */
				// const rowHeight = gridInstance.getRowHeight();
				/** Grid height */
				// const gridHeight = gridInstance.height;
				/** initial page size */
				// const pageSize = gridInstance.pageSettings.pageSize;
				/** new page size is obtained here */
				// const pageResize = (gridHeight - (pageSize * rowHeight)) / rowHeight;
				// gridInstance.pageSettings.pageSize = pageSize + Math.round(pageResize);
				gridInstance.pageSettings.pageSize = gridPageSize;
				gridInstance.pageSettings.frozenColumns = 3;
				gridInstance.pageSettings.freeze = true;
			}
		};

		const onRigLoad = () => {
			const gridElement = document.getElementById("rigGridElement");
			if (gridElement?.ej2_instances[0]) {
				const gridInstance = gridElement.ej2_instances[0];
				gridInstance.pageSettings.pageSize = gridPageSize;
				gridInstance.pageSettings.frozenColumns = 3;
				gridInstance.pageSettings.freeze = true;
			}
		};

		const onContactLoad = () => {
			const gridElement = document.getElementById("contactGridElement");
			if (gridElement?.ej2_instances[0]) {
				const gridInstance = gridElement.ej2_instances[0];
				gridInstance.pageSettings.pageSize = gridPageSize;
				gridInstance.pageSettings.frozenColumns = 2;
				gridInstance.pageSettings.freeze = true;
			}
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

		const onSupplierProductLoad = () => {
			const gridElement = document.getElementById("supplierProductGridElement");
			if (gridElement?.ej2_instances[0]) {
				const gridInstance = gridElement.ej2_instances[0];
				// gridInstance.pageSettings.pageSize = gridPageSize;
				// gridInstance.pageSettings.frozenColumns = 2;
				// gridInstance.pageSettings.freeze = true;
			}
		};

		return (
			<div>
				<Header category="Workside" title="Administrative" />
				{isLoading && (
					<div className="absolute top-[50%] left-[50%]">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
					</div>
				)}
				<TabComponent cssClass="e-fill" headerPlacement="Top">
					{/* <TabItemsDirective> */}
					<div className="e-tab-header">
						<div>Companies</div>
						<div>Rigs</div>
						<div>Contacts</div>
						<div>Products/Services</div>
						<div>Supplier-Products</div>
					</div>
					<div className="e-content">
						{/* Companies Tab */}
						<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
							<GridComponent
								id="firmGridElement"
								dataSource={firmList}
								actionComplete={firmsActionComplete}
								allowSelection
								allowFiltering
								allowPaging
								allowResizing
								filterSettings={FilterOptions}
								selectionSettings={settings}
								toolbar={toolbarOptions}
								rowSelected={rowSelectedFirm}
								editSettings={editOptions}
								enablePersistence
								// pageSize={gridPageSize}
								frozenColumns={2}
								load={onFirmLoad}
								width="95%"
								ref={(g) => {
									firmsGridRef = g;
								}}
							>
								<ColumnsDirective>
									<ColumnDirective
										field="_id"
										headerText="Id"
										textAlign="Left"
										width="10"
										isPrimaryKey
										allowEditing={false}
										visible={false}
									/>
									<ColumnDirective
										field="firm_id"
										headerText="Id"
										textAlign="Left"
										width="10"
										allowEditing={false}
										visible={false}
									/>
									<ColumnDirective
										field="name"
										headerText="Name"
										textAlign="Left"
										width="125"
										freeze="left"
									/>
									<ColumnDirective
										field="type"
										headerText="Type"
										editType="dropdownedit"
										edit={firmSelections}
										textAlign="Left"
										width="125"
									/>
									<ColumnDirective
										field="area"
										headerText="Area"
										editType="dropdownedit"
										edit={locationSelections}
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="address1"
										headerText="Address 1"
										textAlign="Left"
										width="25"
									/>
									<ColumnDirective
										field="address2"
										headerText="Address 2"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="city"
										headerText="City"
										editType="dropdownedit"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="state"
										headerText="State"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="zipcode"
										headerText="Zip"
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
									<ColumnDirective
										field="comment"
										headerText="Comment"
										textAlign="Left"
										width="200"
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
									]}
								/>
							</GridComponent>
						</div>
						{/* End of Companies Tab */}
						{/* Rigs Tab */}
						<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
							<GridComponent
								id="rigGridElement"
								dataSource={rigList}
								actionComplete={rigsActionComplete}
								allowSelection
								allowFiltering
								allowPaging
								allowResizing
								filterSettings={FilterOptions}
								selectionSettings={settings}
								toolbar={toolbarOptions}
								rowSelected={rowSelectedRig}
								enablePersistence
								// pageSize={gridPageSize}
								// frozenColumns={2}
								load={onRigLoad}
								width="95%"
								ref={(g) => {
									rigsGridRef = g;
								}}
							>
								<ColumnsDirective>
									<ColumnDirective
										field="_id"
										headerText="Id"
										textAlign="Left"
										width="50"
										isPrimaryKey
										allowEditing={false}
										visible={false}
									/>
									<ColumnDirective
										field="rigname"
										headerText="Name"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="rignumber"
										headerText="Number"
										textAlign="Left"
										width="75"
									/>
									<ColumnDirective
										field="rigclassification"
										headerText="Class"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="description"
										headerText="Description"
										textAlign="Left"
										width="75"
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
									<ColumnDirective
										field="comment"
										headerText="Comment"
										textAlign="Left"
										width="200"
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
									]}
								/>
							</GridComponent>
						</div>
						{/* End of Rigs */}
						{/* Contacts Tab */}
						<div className="absolute top-[50px] left-[20px] w-[100%] flex flex-row items-center justify-start">
							<GridComponent
								id="contactGridElement"
								dataSource={contactList}
								actionComplete={contactsActionComplete}
								allowSelection
								allowFiltering
								allowPaging
								allowResizing
								filterSettings={FilterOptions}
								selectionSettings={settings}
								toolbar={toolbarOptions}
								rowSelected={rowSelectedContact}
								editSettings={editOptions}
								enablePersistence
								// pageSize={gridPageSize}
								// frozenColumns={2}
								load={onContactLoad}
								width="95%"
								ref={(g) => {
									contactsGridRef = g;
								}}
							>
								<ColumnsDirective>
									<ColumnDirective
										field="_id"
										headerText="Id"
										textAlign="Left"
										width="50"
										isPrimaryKey
										allowEditing={false}
										visible={false}
									/>
									<ColumnDirective
										field="contact_id"
										headerText="ID"
										textAlign="Left"
										width="25"
										allowEditing={false}
										visible={false}
									/>
									<ColumnDirective
										field="firstname"
										headerText="First"
										textAlign="Left"
										width="125"
									/>
									<ColumnDirective
										field="lastname"
										headerText="Last"
										textAlign="Left"
										width="125"
									/>
									<ColumnDirective
										field="nickname"
										headerText="Nickname"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="contactclass"
										headerText="Class"
										editType="dropdownedit"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="firm"
										headerText="Firm"
										editType="dropdownedit"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="accesslevel"
										headerText="Access"
										editType="dropdownedit"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="username"
										headerText="User Name"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="userpassword"
										headerText="Password"
										textAlign="Left"
										width="100"
									/>
									<ColumnDirective
										field="primaryphone"
										headerText="Phone 1"
										textAlign="Left"
										width="100"
										edit={custphonemaskinput}
									/>
									<ColumnDirective
										field="secondaryphone"
										headerText="Phone 2"
										textAlign="Left"
										width="100"
										edit={custphonemaskinput}
									/>
									{/* <ColumnDirective field='primaryemail' headerText='Email 1' textAlign='Left' width='150' validationRules={mailidRules} />
                <ColumnDirective field='secondaryemail' headerText='Email 2' textAlign='Left' width='150' validationRules={mailidRules} /> */}
									<ColumnDirective
										field="primaryemail"
										headerText="Email 1"
										textAlign="Left"
										width="150"
									/>
									<ColumnDirective
										field="secondaryemail"
										headerText="Email 2"
										textAlign="Left"
										width="150"
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
									<ColumnDirective
										field="comment"
										headerText="Comment"
										textAlign="Left"
										width="200"
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
									]}
								/>
							</GridComponent>
						</div>
						{/* End of Contacts Tab */}
						{/* Products/Services Tab */}
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
									services={[
										Selection,
										Edit,
										Filter,
										Page,
										Toolbar,
										Resize,
										Freeze,
									]}
								/>
							</GridComponent>
						</div>
						{/* End of Products/Services Tab */}
						{/* Supplier-Products Tab */}
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
									services={[
										Selection,
										Edit,
										Filter,
										Page,
										Toolbar,
										Resize,
										Freeze,
									]}
								/>
							</GridComponent>
						</div>
						{/* End of Supplier-Products Tab */}
					</div>
				</TabComponent>
			</div>
		);
};

export default Admin;
