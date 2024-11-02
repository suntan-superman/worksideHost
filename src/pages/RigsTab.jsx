/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { DataManager, Query } from "@syncfusion/ej2-data";
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
import { useRigContext } from "../hooks/useRigContext";
import { Header } from "../components";
import "../index.css";
import { confirmAlert } from "react-confirm-alert";

const apiUrl = process.env.REACT_APP_MONGO_URI;

const gridPageSize = 8;

const RigsTab = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [haveData, setHaveData] = useState(false);
	// const { currentColor, deleteFlag, setDeleteFlag } = useStateContext();
	// const [filteredProjects, setFilteredProjects] = useState(null);
	let rigsGridRef = useRef(null);
	const [rigList, setRigList] = useState(null);
	const { rigData, dispatch: rigDispatch } = useRigContext();
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
	const rigsGrid = null;

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
					const response = await fetch(
						`${process.env.REACT_APP_MONGO_URI}/api/rig/`,
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
				handleRigDelete();
				setInsertFlag(false);
			}
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

	const onRigLoad = () => {
		const gridElement = document.getElementById("rigGridElement");
		if (gridElement?.ej2_instances[0]) {
			const gridInstance = gridElement.ej2_instances[0];
			gridInstance.pageSettings.pageSize = gridPageSize;
			gridInstance.pageSettings.frozenColumns = 3;
			gridInstance.pageSettings.freeze = true;
		}
	};

	const FilterOptions = {
		type: "Menu",
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
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
					services={[Selection, Edit, Filter, Page, Toolbar, Resize, Freeze]}
				/>
			</GridComponent>
		</div>
	);
};

export default RigsTab;
