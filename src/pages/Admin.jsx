/* eslint-disable */
import React, { useEffect, useState } from "react";

import { TabComponent } from "@syncfusion/ej2-react-navigations";

import FirmsTab from "./FirmsTab";
import ContactsTab from "./ContactsTab";
import ValidateUsersTab from "./ValidateUsersTabX";
import RigsTab from "./RigsTab";
import ProductsTab from "./ProductsTab";
import CustomerSupplierMSATabX from "./CustomerSupplierMSATabX";

import { Header } from "../components";
import "../index.css";
import "../App.css";

const Admin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showValidateUsersTab, setShowValidateUsersTab] = useState(false);

	useEffect(() => {
		const GetAccessLevel = () => {
			const value = localStorage.getItem("accessLevel");
			if (value) {
				if (value > 2) setShowValidateUsersTab(true);
				return value;
			}
			return 0;
		};
		GetAccessLevel();
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
				{showValidateUsersTab && (
					<TabComponent cssClass="e-fill" headerPlacement="Top">
						{/* <TabItemsDirective> */}
						<div className="e-tab-header">
							<div>Companies</div>
							<div>Contacts</div>
							<div>Validate Users</div>
							<div>Rigs</div>
							<div>Products/Services</div>
							<div>Supplier MSA</div>
						</div>
						<div className="e-content">
							<div>
								<FirmsTab />
							</div>
							{/* Contacts Tab */}
							<div>
								<ContactsTab />
							</div>
							<div>
								<ValidateUsersTab />
							</div>
							{/* Rigs Tab */}
							<div>
								<RigsTab />
							</div>
							{/* Products/Services Tab */}
							<div>
								<ProductsTab />
							</div>
							{/* Customer Supplier MSA Tab */}
							<div>
								<CustomerSupplierMSATabX />
							</div>
						</div>
					</TabComponent>
				)}
				{!showValidateUsersTab && (
					<TabComponent cssClass="e-fill" headerPlacement="Top">
						{/* <TabItemsDirective> */}
						<div className="e-tab-header">
							<div>Companies</div>
							<div>Contacts</div>
							<div>Rigs</div>
							<div>Products/Services</div>
							<div>Supplier MSA</div>
						</div>
						<div className="e-content">
							<div>
								<FirmsTab />
							</div>
							{/* Contacts Tab */}
							<div>
								<ContactsTab />
							</div>
							{/* Rigs Tab */}
							<div>
								<RigsTab />
							</div>
							{/* Products/Services Tab */}
							<div>
								<ProductsTab />
							</div>
							{/* Customer Supplier MSA Tab */}
							<div>
								<CustomerSupplierMSATabX />
							</div>
						</div>
					</TabComponent>
				)}
			</div>
		</div>
	);
};

export default Admin;
