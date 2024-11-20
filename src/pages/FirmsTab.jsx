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
import { MaskedTextBox } from "@syncfusion/ej2-inputs";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { useFirmContext } from "../hooks/useFirmContext";
import useUserStore from "../stores/UserStore";

import "../index.css";
import "../App.css";

const apiUrl = process.env.REACT_APP_API_URL;

let gridPageSize = 10;

const FirmsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);

	let firmsGridRef = useRef(null);

	const [firmList, setFirmList] = useState(null);
	const [insertFlag, setInsertFlag] = useState(false);
	const editOptions = {
		allowEditing: true,
		allowAdding: true,
		allowDeleting: true,
		mode: "Dialog",
	};
	const toolbarOptions = ["Add", "Edit", "Delete"];
	const { firmData, dispatch: firmDispatch } = useFirmContext();

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
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
	}, []);

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
					const response = await fetch(
						`${process.env.REACT_APP_MONGO_URI}/api/firm/`,
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
				handleFirmDelete();
				setInsertFlag(false);
			}
		}
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

	return (
		<div>
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
						services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
					/>
				</GridComponent>
			</div>
		</div>
	);
};

export default FirmsTab;
