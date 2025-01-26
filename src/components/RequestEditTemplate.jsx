/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import {
	DatePickerComponent,
	DateTimePickerComponent,
} from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import "../styles/material.css";
import { toast } from "react-toastify";

import {
	GetAllProjects,
	GetAllFirms,
	GetProducts,
	GetAllContacts,
	GetSupplierProductsByProduct,
} from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

// Set Selection Options
// const categoryOptions = [
// 	"Frac Services",
// 	"Cementing",
// 	"Drilling Tools Rental",
// 	"Inspection and Testing",
// 	"Containments",
// 	"Mud Management",
// 	"Generators, Engines",
// 	"Fluid Storage",
// 	"Rig Mats",
// 	"Rig Walking Systems",
// 	"Rig Moving",
// 	"Rig Cleaning",
// 	"Rig Maintenance",
// 	"Rig Decommissioning",
// 	"Rig Commissioning",
// 	"Rig Construction",
// 	"Rig Upgrades",
// 	"Rig Refurbishment",
// 	"Rig Inspection",
// 	"Rig Certification",
// ];

import { requestStatusOptions } from "../data/worksideOptions";

const RequestEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });

	const [customerChangeFlag, setCustomerChangeFlag] = useState(false);

	// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		setData({ ...data, [args.target.name]: args.target.value });
		if (args.target.name === "requestcategory") {
			GetProducts().then(() => {
				FilterProducts(args.target.value);
			});
		}
		if (args.target.name === "vendortype") {
			if (args.target.value === "SSR") {
				GetSSRVendors();
			}
		}
		if (args.target.name === "customername") {
			setCustomerChangeFlag(true);
		}
	};

	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [rigCompanyContactOptions, setRigCompanyContactOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);
	const [projectOptions, setProjectOptions] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [msaVendorOptions, setMSAVendorOptions] = useState([]);
	const [allCategories, setAllCategories] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	
	const vendorTypeOptions = ["MSA", "OPEN", "SSR"];

	// Get the project data
	const { data: projData } = useQuery({
		queryKey: ["projects"],
		queryFn: () => GetAllProjects(),
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes+
		retry: 3,
	});

	// Get the firms data
	const { data: firmData } = useQuery({
		queryKey: ["firms"],
		queryFn: () => GetAllFirms(),
		enabled: !!projData, // Only retrieve data if projData is available
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes
		retry: 3,
	});

	// Get the products data
	const { data: productsData } = useQuery({
		queryKey: ["products"],
		queryFn: () => GetProducts(),
		refetchInterval: 10000 * 60 * 10, // 10 minutes
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes
		retry: 3,
	});

	// Get the contacts data
	const { data: contactsData } = useQuery({
		queryKey: ["contacts"],
		queryFn: () => GetAllContacts(),
		refetchInterval: 10000 * 60 * 10, // 10 minutes
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes
		retry: 3,
	});

	useEffect(() => {
		GetProducts().then(() => {
			if (data.requestcategory !== undefined)
				FilterProducts(data.requestcategory);
		});
	}, []);

	const getCustomers = (firms) => {
		if (firms === undefined || firms === null) return [];
		return firms.data.filter((firm) => firm.type === "CUSTOMER");
	};

	const getRigCompanies = (firms) => {
		if (firms === undefined || firms === null) return [];
		return firms.data.filter((firm) => firm.type === "RIGCOMPANY");
	};

	useEffect(() => {
		if (firmData === undefined || firmData === undefined) return;

		const customerResult = getCustomers(firmData);
		// Extract names into an array
		const customers = customerResult?.map((r) => r.name);
		setCustomerOptions(customers);

		// Get Rig Companies
		const rigResult = getRigCompanies(firmData);
		// Extract names into an array
		const rigCompanies = rigResult?.map((r) => r.name);
		setRigCompanyOptions(rigCompanies);

		// Get Projects
		if (projData !== undefined && projData !== null) {
			const projects = projData.data.map((p) => p.projectname);
			setProjectOptions(projects);
		}
	}, [projData, firmData]);

	useEffect(() => {
		if (productsData === undefined || productsData === null) return;
		const cats = [...new Set(productsData.data.map((p) => p.categoryname))];
		setAllCategories(cats);
		if (data.requestcategory !== undefined)
			FilterProducts(data.requestcategory);
	}, [productsData]);

	const FilterProducts = (selectedItem) => {
		const products = productsData?.data?.filter((p) => p.categoryname === selectedItem);
		const productList = [...new Set(products.map((p) => p.productname))];
		setFilteredProducts(productList);
	};

	const filterContactsByFirm = (contacts, firm) => {
  return contacts?.filter((contact) => contact?.firm === firm);
};

	// Get Customer Contacts
	useEffect(() => {
		if (contactsData === undefined || contactsData === null) return;

		const contacts = contactsData.data;
		const result = filterContactsByFirm(contacts, data.customername);
		const contactsList = result.map((r) => r.username);
		setContactOptions(contactsList);
		setCustomerChangeFlag(false);
	}, [contactsData, data.customername, customerChangeFlag]);

		// Get Rig Company Contacts
	useEffect(() => {
		// Get Customer Contact Options from Contact Collection
		if (contactsData === undefined || contactsData === null) return;
		const result = contactsData.data.filter(
			(contact) => contact.firm === data.rigcompany,
		);
		// Extract names into an array
		const contacts = result.map((r) => r.username);
		setRigCompanyContactOptions(contacts);
	}, [contactsData, data.rigcompany]);

	const extractProducts = (response) => {
		// Check if status is 200 and extract the data array
		if (response.length > 0 && response[0].status === 200) {
			return response[0].data;
		}
		return [];
	};
	const GetSSRVendors = async () => {
		if (data.requestcategory === undefined || data.requestname === undefined) {
			toast.error("Please select a Request Category and Request Name!");
			return;
		}
		GetSupplierProductsByProduct().then((response) => {
			const suppliers = extractProducts(response);
			const filteredSuppliers = suppliers.filter((s) => {
				if (
					s.category === data.requestcategory &&
					s.product === data.requestname
				) {
					return true;
				}
				return false;
			});
			if (filteredSuppliers.length === 0) {
				toast.error("No Sole Source Vendors/Suppliers Found!");
			} else {
				const suppliers = [
					...new Set(filteredSuppliers.map((s) => s.supplier)),
				];
				setMSAVendorOptions(suppliers);
			}
		});
	};


	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			data.datetimerequested = new Date();
			data.creationdate = new Date();
			data.status = "OPEN";
			data.statusdate = new Date();

			setReadOnlyFlag(false);
		} else {
			setReadOnlyFlag(true);
			GetProducts();
			FilterProducts(data.requestcategory);
		}
	}, [data.isAdd]);

	return (
		<div className="flex justify-center items-center bg-white">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			<div className="w-[600px] mx-[4px] space-y-2">
				{/* Row 1 */}
				<div className="flex gap-4">
					{/* Input 1 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
						>
							Request Category
						</label>
						<DropDownListComponent
							id="requestcategory"
							dataSource={allCategories}
							name="requestcategory"
							value={data.requestcategory}
							placeholder="Select Category"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 2 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field2"
						>
							Request Name
						</label>
						<DropDownListComponent
							id="requestname"
							dataSource={filteredProducts}
							name="requestname"
							value={data.requestname}
							placeholder="Select Request"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
				</div>
				{/* Row 2 */}
				<div className="flex gap-4">
					{/* Input 3 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field3"
						>
							Customer
						</label>
						<DropDownListComponent
							id="customername"
							name="customername"
							dataSource={customerOptions}
							value={data.customername}
							placeholder="Select Customer"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 4 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							Customer Contact
						</label>
						<DropDownListComponent
							id="customercontact"
							name="customercontact"
							dataSource={contactOptions}
							value={data.customercontact}
							placeholder="Select Customer Contact"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 3 */}
				<div className="flex gap-4">
					{/* Input 5 */}
					<div className="flex flex-col w-full">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field5"
						>
							Project Name
						</label>
						<DropDownListComponent
							id="projectname"
							name="projectname"
							dataSource={projectOptions}
							value={data.projectname}
							placeholder="Select Project"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
				</div>
				{/* Row 4 */}
				<div className="flex gap-4">
					{/* Input 6 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field6"
						>
							Rig Company
						</label>
						<DropDownListComponent
							id="rigcompany"
							name="rigcompany"
							dataSource={rigCompanyOptions}
							value={data.rigcompany}
							placeholder="Select Rig Company"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 7 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field7">
							Rig Company Contact
						</label>
						<DropDownListComponent
							id="rigcompanycontact"
							name="rigcompanycontact"
							dataSource={rigCompanyContactOptions}
							value={data.rigcompanycontact}
							placeholder="Select Rig Company Contact"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 5 */}
				<div className="flex gap-4">
					{/* Input 8 */}
					<div className="flex flex-col w-1/3">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field8"
						>
							Request Date
						</label>
						<DatePickerComponent
							id="creationdate"
							name="creationdate"
							value={data.creationdate}
							placeholder="Select Request Date"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 9 */}
					<div className="flex flex-col w-1/3">
						<label
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field9"
						>
							Date/Time Requested
						</label>
						<DateTimePickerComponent
							id="datetimerequested"
							name="datetimerequested"
							value={data.datetimerequested}
							placeholder="Select Date/Time Requested"
							disabled={false}
							onChange={onChange}
						/>
					</div>
					{/* Input 10 */}
					<div className="flex flex-col w-1/3">
						<label
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field10"
						>
							Quantity
						</label>
						<NumericTextBoxComponent
							id="quantity"
							value={data.quantity}
							placeholder="Enter Quantity"
							showSpinButton={false}
							decimals={2}
							format="n2"
							required={true}
						/>
					</div>
				</div>
				{/* Row 6 */}
				<div className="flex gap-4">
					{/* Input 11 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field11">
							Vendor Type
						</label>
						<DropDownListComponent
							id="vendortype"
							name="vendortype"
							dataSource={vendorTypeOptions}
							value={data.vendortype}
							placeholder="Select Vendor Type"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 12 */}
					<div className="flex flex-col w-1/2">
						<label
							className={"text-black text-sm font-medium mb-1"}
							htmlFor="field12"
						>
							SSR Vendor
						</label>
						<DropDownListComponent
							id="vendorName"
							name="vendorName"
							dataSource={msaVendorOptions}
							value={data.vendorName}
							placeholder="Select Sole Source Vendor"
							required={false}
							// readonly={data.vendorType !== "SSR"}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 7 */}
				<div className="flex gap-4">
					{/* Input 5 */}
					<div className="flex flex-col w-full">
						<label className="text-sm font-medium mb-1" htmlFor="field13">
							Comment
						</label>
						<input
							type="text"
							id="comments"
							name="comments"
							defaultValue={data?.comment}
							className="e-input"
							placeholder="Enter Comments"
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 8 */}
				<div className="flex gap-4">
					{/* Input 11 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field14">
							Status
						</label>
						<DropDownListComponent
							id="status"
							name="status"
							dataSource={requestStatusOptions}
							value={data.status}
							placeholder="Select Status"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 12 */}
					<div className="flex flex-col w-1/2">
						<label
							className={"text-black text-sm font-medium mb-1"}
							htmlFor="field15"
						>
							Status Date
						</label>
						<DatePickerComponent
							id="statusdate"
							name="statusdate"
							value={data.statusdate}
							placeholder="Select Status Date"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* End of Input Fields */}
			</div>
		</div>
	);
};

export default RequestEditTemplate;

