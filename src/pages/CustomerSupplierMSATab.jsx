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

// Customer-Supplier-MSA Data

// Customer Name
// Customer ID
// Supplier Name
// Supplier ID
// MSA Status
// MSA Status Date
// MSA Renewal Date

const CustomerSupplierMSATab = () => {
	const [refreshFlag, setRefreshFlag] = useState(false);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);
	const treeObj = useRef(null);
	const cssClass = "mytree";

	const treeData = [
		{
			id: 1,
			name: "Supplier 1",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 2, name: "Category 1", msaStatus: "Active" },
				{ id: 3, name: "Category 2", msaStatus: "Active" },
			],
		},
		{
			id: 4,
			name: "Supplier 2",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 5, name: "Category 1", msaStatus: "Active" },
				{ id: 6, name: "Category 3", msaStatus: "Active" },
			],
		},
		{
			id: 7,
			name: "Supplier 8",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 8, name: "Category 1", msaStatus: "Active" },
				{ id: 9, name: "Category 2", msaStatus: "InActive" },
				{ id: 10, name: "Category 4", msaStatus: "Active" },
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

export default CustomerSupplierMSATab;
