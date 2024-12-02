/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

import areaOptions from "../data/areaOptions";

const statusOptions = ["ACTIVE", "INACTIVE"];

const firmTypeOptions = ["CUSTOMER", "RIGCOMPANY", "SUPPLIER"];

const FirmEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);

	// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		// console.log(`Field: ${args.target.name} Value: ${args.target.value}`);
		setData({ ...data, [args.target.name]: args.target.value });
	};

	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
			data.status = "ACTIVE";
			data.statusdate = new Date();
			GetLatestEntries();
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	const GetLatestEntries = () => {
		const area = localStorage.getItem("firmsLatestArea");
		if (area) {
			data.area = area;
		}
		const type = localStorage.getItem("firmsLatestType");
		if (type) {
			data.type = type;
		}
		const city = localStorage.getItem("firmsLatestCity");
		if (city) {
			data.city = city;
		}
		const state = localStorage.getItem("firmsLatestState");
		if (state) {
			data.state = state;
		}
	};

	const fetchOptions = async () => {
		setIsLoading(true);
		const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/firm`);
		const json = await response.json();

		// Get Customers
		const customerResult = json.filter((json) => json.type === "CUSTOMER");
		// Extract names into an array
		const customers = customerResult.map((r) => r.name);
		setCustomerOptions(customers);

		// Get Rig Companies
		const rigResult = json.filter((json) => json.type === "RIGCOMPANY");
		// Extract names into an array
		const rigCompanies = rigResult.map((r) => r.name);
		setRigCompanyOptions(rigCompanies);

		setIsLoading(false);
	};

	const fetchContacts = async () => {
		setIsLoading(true);
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/contact`,
		);
		const json = await response.json();

		// Get Customer Contacts
		const result = json.filter((json) => json.firm === data.customer);
		// Extract names into an array
		const contacts = result.map((r) => r.username);
		setContactOptions(contacts);

		setIsLoading(false);
	};

	useEffect(() => {
		// Get Customer and Rig Company Options from Firm Collection
		fetchOptions();
	}, []);

	useEffect(() => {
		// Get Contact Options from Contact Collection
		fetchContacts();
	}, [data.customer]);

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
					<div className="flex flex-col w-full">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
						>
							Firm Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							defaultValue={data.name}
							className="e-input"
							placeholder="Enter Firm Name"
							required={true}
							onChange={onChange}
							disabled={readOnlyFlag}
						/>
					</div>
				</div>
				{/* Row 2 */}
				<div className="flex gap-4">
					{/* Input 2 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field2"
						>
							Area
						</label>
						<DropDownListComponent
							id="area"
							dataSource={areaOptions}
							name="area"
							value={data.area}
							placeholder="Select Area"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 3 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field3"
						>
							Type
						</label>
						<DropDownListComponent
							id="type"
							dataSource={firmTypeOptions}
							name="type"
							value={data.type}
							placeholder="Select Firm Type"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
				</div>
				{/* Row 3 */}
				<div className="flex gap-4">
					{/* Input 4 */}
					<div className="flex flex-col w-1/2">
						<label
							className={"text-black text-sm font-medium mb-1"}
							htmlFor="field4"
						>
							Address 1
						</label>
						<input
							type="text"
							id="address1"
							name="address1"
							defaultValue={data.address1}
							className="e-input"
							placeholder="Enter Address"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 5 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field5">
							Address 2
						</label>
						<input
							type="text"
							id="address2"
							name="address2"
							defaultValue={data.address2}
							className="e-input"
							placeholder="Enter Address"
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 4 */}
				<div className="flex gap-4">
					{/* Input 6 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field6">
							City
						</label>
						<input
							type="text"
							id="city"
							name="city"
							defaultValue={data.city}
							className="e-input"
							placeholder="Enter City"
							onChange={onChange}
						/>
					</div>
					{/* Input 7 */}
					<div className="flex flex-col w-1/4">
						<label className="text-sm font-medium mb-1" htmlFor="field7">
							State
						</label>
						<input
							type="text"
							id="state"
							name="state"
							defaultValue={data.state}
							className="e-input"
							placeholder="Enter State"
							onChange={onChange}
						/>
					</div>
					{/* Input 8 */}
					<div className="flex flex-col w-1/4">
						<label className="text-sm font-medium mb-1" htmlFor="field8">
							Zip
						</label>
						<input
							type="text"
							id="zipCode"
							name="zipCode"
							defaultValue={data.zipCode}
							className="e-input"
							placeholder="Enter Zip Code"
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 5 */}
				<div className="flex gap-4">
					{/* Input 9 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field9">
							Status
						</label>
						<DropDownListComponent
							id="status"
							name="status"
							dataSource={statusOptions}
							value={data.status}
							placeholder="Select Status"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 10 */}
					<div className="flex flex-col w-1/2">
						<label
							className={"text-black text-sm font-medium mb-1"}
							htmlFor="field10"
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

export default FirmEditTemplate;

