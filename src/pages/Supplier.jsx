/* eslint-disable */
import React, { useEffect, useState } from "react";

import { TabComponent } from "@syncfusion/ej2-react-navigations";

import SupplierProductsTab from "./SupplierProductsTab";
import SupplierGroupsTab from "./SupplierGroupsTab";
import SupplierGroupsUsersTab from "./SupplierGroupsUsersTab";
import SupplierGroupUsersTabX from "./SupplierGroupUsersTabX";
import useUserStore from "../stores/UserStore";

import { Header } from "../components";
import "../index.css";
import "../App.css";

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
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
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
