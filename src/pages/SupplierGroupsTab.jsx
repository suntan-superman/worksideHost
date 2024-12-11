/* eslint-disable */

import React, { useEffect, useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "react-select";
import axios from "axios";
import "../index.css";
import { toast } from "react-toastify";
import useUserStore from "../stores/UserStore";

// SupplierGroup Data

// Supplier Name
// Supplier ID
// Supplier Group Name
// Supplier Group Description
// Supplier Group Status
// Supplier Product Category

const SupplierGroupsTab = () => {
	const [refreshFlag, setRefreshFlag] = useState(false);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);

	const treeObj = useRef(null);
	const cssClass = "mytree";

	const treeData = [
		{
			id: 1,
			name: "Supplier 1 Group 1",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 2, name: "Category 1", status: "Active" },
				{ id: 3, name: "Category 2", status: "Active" },
			],
		},
		{
			id: 4,
			name: "Supplier 1 Group 2",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 5, name: "Category 1", status: "Active" },
				{ id: 6, name: "Category 3", status: "Active" },
			],
		},
		{
			id: 7,
			name: "Group 3",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 8, name: "Category 1", status: "Active" },
				{ id: 9, name: "Category 2", status: "InActive" },
				{ id: 10, name: "Category 4", status: "Active" },
			],
		},
	];

	const fields = {
		dataSource: treeData,
		id: "id",
		text: "name",
		child: "children",
	};

	const RefreshData = () => {
		setRefreshFlag(true);
	};

	return (
		<div className="flex-grow bg-white p-2 relative">
			<button
				className={`${needRefreshFlag ? "bg-yellow-300" : "bg-green-500"} text-black font-bold py-1 px-4 rounded mt-1 text-sm`}
				type="button"
				onClick={RefreshData}
			>
				Refresh
			</button>
			<div>
				<TreeViewComponent
					id="contentmenutree"
					fields={fields}
					cssClass={cssClass}
					style={{ fontSize: 24, fontWeight: 600 }}
					// nodeSelected={handleNodeSelect}
					// nodeClicked={NodeClicked.bind(this)}
					// allowMultiSelection={false}
					ref={treeObj}
				/>
			</div>
		</div>
	);
};

export default SupplierGroupsTab;
