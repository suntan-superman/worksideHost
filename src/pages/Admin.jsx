/* eslint-disable */
import React, { useEffect, useState } from "react";

import { TabComponent } from "@syncfusion/ej2-react-navigations";

import ValidateUsersTab from "./ValidateUsersTab";
import FirmsTab from "./FirmsTab";
import ContactsTab from "./ContactsTab";
import NewRigsTab from "./NewRigsTab";
import ProductsTab from "./ProductsTab";
import SupplierProductsTab from "./SupplierProductsTab";
import useUserStore from "../stores/UserStore";

import { Header } from "../components";
import "../index.css";
import "../App.css";

const Admin = () => {
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
				<Header category="Workside" title="Administrative" />
				{isLoading && (
					<div className="absolute top-[50%] left-[50%]">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
					</div>
				)}
				<div className="ml-2.5">
					<TabComponent cssClass="e-fill" headerPlacement="Top">
						{/* <TabItemsDirective> */}
						<div className="e-tab-header">
							<div>Companies</div>
							<div>Rigs</div>
							<div>Contacts</div>
							<div>Products/Services</div>
							<div>Supplier-Products</div>
							<div>Validate Users</div>
						</div>
						<div className="e-content">
							<div>
								<FirmsTab />
							</div>
							{/* Rigs Tab */}
							<div>
								<NewRigsTab />
							</div>
							{/* Contacts Tab */}
							<div>
								<ContactsTab />
							</div>
							{/* Products/Services Tab */}
							<div>
								<ProductsTab />
							</div>
							{/* Supplier-Products Tab */}
							<div>
								<SupplierProductsTab />
							</div>
							{/* End of Supplier-Products Tab */}
							<div>
								<ValidateUsersTab />
							</div>
						</div>
					</TabComponent>
				</div>
			</div>
		);
};

export default Admin;
