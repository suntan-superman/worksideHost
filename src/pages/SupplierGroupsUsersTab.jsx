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

const SupplierGroupsUsersTab = () => {
	const [refreshFlag, setRefreshFlag] = useState(false);
	const [needRefreshFlag, setNeedRefreshFlag] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);

	const treeObj = useRef(null);
	const cssClass = "mytree";

	const treeData = [
		{
			id: 1,
			name: "Group 1",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 2, name: "User 1" },
				{ id: 3, name: "User 2" },
			],
		},
		{
			id: 4,
			name: "Group 2",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 5, name: "User 1" },
				{ id: 6, name: "User 3" },
			],
		},
		{
			id: 7,
			name: "Group 3",
			hasChild: true,
			expanded: true,
			children: [
				{ id: 8, name: "User 1" },
				{ id: 9, name: "User 2" },
				{ id: 10, name: "User 4" },
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

export default SupplierGroupsUsersTab;
