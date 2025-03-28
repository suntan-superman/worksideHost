/* eslint-disable */
import React, { useEffect, useState } from "react";

import { TabComponent } from "@syncfusion/ej2-react-navigations";

import FirmsTab from "./FirmsTab";
import ContactsTab from "./ContactsTab";
import ValidateUsersTab from "./ValidateUsersTab";
import RigsTab from "./RigsTab";
import ProductsTab from "./ProductsTab";
import CustomerSupplierMSATabX from "./CustomerSupplierMSATabX";

import { Header } from "../components";
import "../index.css";
import "../App.css";

/**
 * Admin component renders the administrative dashboard for the application.
 * It dynamically displays tabs based on the user's access level, which is
 * retrieved from localStorage. The component also includes a loading spinner
 * when data is being processed.
 *
 * @component
 * @returns {JSX.Element} The rendered Admin component.
 *
 * @example
 * // Usage
 * <Admin />
 *
 * @description
 * - Displays a header with the category "Workside" and title "Administrative".
 * - Shows a loading spinner when `isLoading` is true.
 * - Dynamically renders tabs based on the `showValidateUsersTab` state:
 *   - If `showValidateUsersTab` is true, includes a "Validate Users" tab.
 *   - Otherwise, excludes the "Validate Users" tab.
 *
 * @state {boolean} isLoading - Indicates whether the component is in a loading state.
 * @state {boolean} showValidateUsersTab - Determines whether the "Validate Users" tab is displayed.
 *
 * @hook useEffect - Fetches the user's access level from localStorage on component mount
 * and updates the `showValidateUsersTab` state accordingly.
 */
const Admin = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [showValidateUsersTab, setShowValidateUsersTab] = useState(false);

	useEffect(() => {
		const GetAccessLevel = () => {
			const value = Number(localStorage.getItem("accessLevel"));
			console.log("Access Level: ", value);
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
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
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
