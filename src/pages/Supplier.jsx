/* eslint-disable */
import React, { useEffect, useState } from "react";

import { TabComponent } from "@syncfusion/ej2-react-navigations";

import SupplierProductsTab from "./SupplierProductsTab";
import SupplierGroupUsersTabX from "./SupplierGroupUsersTabX";
import useUserStore from "../stores/UserStore";

import { Header } from "../components";
import "../index.css";
import "../App.css";

/**
 * Supplier Component
 *
 * This component represents the Supplier Administrative page. It includes a header,
 * a loading spinner, and a tabbed interface for managing supplier-related data.
 *
 * @component
 * @returns {JSX.Element} The rendered Supplier component.
 *
 * @example
 * <Supplier />
 *
 * @description
 * - Displays a header with the category "Workside" and title "Supplier Administrative".
 * - Shows a loading spinner when `isLoading` is true.
 * - Contains a tabbed interface with two tabs:
 *   1. Products: Displays the `SupplierProductsTab` component.
 *   2. Group Setup: Displays the `SupplierGroupUsersTabX` component.
 * - Dynamically shows or hides the "Validate Users" tab based on the user's access level.
 *
 * @hook
 * - `useState`: Manages the `isLoading` and `showValidateUsersTab` states.
 * - `useEffect`: Sets the visibility of the "Validate Users" tab based on the user's access level.
 *
 * @dependencies
 * - `useUserStore`: Retrieves the user's access level from the global state.
 * - `Header`: Displays the page header.
 * - `TabComponent`: Renders the tabbed interface.
 * - `SupplierProductsTab`: Component for managing supplier products.
 * - `SupplierGroupUsersTabX`: Component for managing group users.
 */
const Supplier = () => {
	const [isLoading, setIsLoading] = useState(false);
	const accessLevel = useUserStore((state) => state.accessLevel);

	const [showValidateUsersTab, setShowValidateUsersTab] = useState(false);

	useEffect(() => {
		const SetAccessLevel = () => {
			if (accessLevel > 2) setShowValidateUsersTab(true);
		};
		SetAccessLevel();
	}, []);

	return (
		<div>
			<Header category="Workside" title="Supplier Administrative" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			<div className="ml-2.5">
				<TabComponent cssClass="e-fill" headerPlacement="Top">
					{/* <TabItemsDirective> */}
					<div className="e-tab-header">
						<div>Products</div>
						<div>Group Setup </div>
					</div>
					<div className="e-content">
						{/* Supplier-Products Tab */}
						<div>
							<SupplierProductsTab />
						</div>
						{/* Group Users Tab */}
						<div>
							<SupplierGroupUsersTabX />
						</div>
					</div>
				</TabComponent>
			</div>
		</div>
	);
};

export default Supplier;
