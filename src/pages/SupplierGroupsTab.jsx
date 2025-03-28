/* eslint-disable */

import React, { useState, useRef } from "react";
import { TreeViewComponent } from "@syncfusion/ej2-react-navigations";
import "../index.css";
import useUserStore from "../stores/UserStore";

// SupplierGroup Data

// Supplier Name
// Supplier ID
// Supplier Group Name
// Supplier Group Description
// Supplier Group Status
// Supplier Product Category

/**
 * SupplierGroupsTab Component
 *
 * This component renders a tab for managing supplier groups. It includes a tree view
 * to display hierarchical data of supplier groups and their categories, along with a
 * refresh button to trigger data updates.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered SupplierGroupsTab component.
 *
 * @example
 * <SupplierGroupsTab />
 *
 * @description
 * - The component uses a `TreeViewComponent` to display supplier groups and their categories.
 * - A refresh button is provided to trigger a refresh action, which sets a `refreshFlag` state.
 * - The tree data is defined statically within the component and passed to the `TreeViewComponent`.
 * - The `needRefreshFlag` state determines the button's background color.
 *
 * @state {boolean} refreshFlag - A flag to indicate if a refresh action is triggered.
 * @state {boolean} needRefreshFlag - A flag to indicate if a refresh is needed, affecting the button's style.
 *
 * @hooks
 * - `useState` - To manage the `refreshFlag` and `needRefreshFlag` states.
 * - `useRef` - To create a reference for the `TreeViewComponent`.
 * - `useUserStore` - To retrieve the user's access level from the global store.
 *
 * @dependencies
 * - `TreeViewComponent` - A component used to render the tree structure.
 * - `useUserStore` - A custom hook to access user-related data.
 */
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
