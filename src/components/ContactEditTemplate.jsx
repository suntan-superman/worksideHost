/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import "../styles/material.css";

// Set Selection Options
const contactClassOptions = [
	"CUSTOMER",
	"RIGCOMPANY",
	"SUPPLIER",
	"DELIVERYASSOC",
];

const statusOptions = ["ACTIVE", "INACTIVE", "PENDING"];

const accessLevelOptions = ["ADMIN", "GUEST", "STANDARD", "POWER"];

// TODO Complete the ContactEditTemplate component

const ContactEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });

	// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		console.log(`Field: ${args.target.name} Value: ${args.target.value}`);
		setData({ ...data, [args.target.name]: args.target.value });
	};

	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);
	const [firmOptions, setFirmOptions] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	const fetchOptions = async () => {
		setIsLoading(true);
		const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/firm`);
		const json = await response.json();

		const firms = json.map((r) => r.name);
		setFirmOptions(firms);

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
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
						>
							First Name
						</label>
						<input
							type="text"
							id="firstname"
							name="firstname"
							defaultValue={data.firstname}
							className="e-input"
							placeholder="Enter First Name"
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
							Last Name
						</label>
						<input
							type="text"
							id="lastname"
							name="lastname"
							defaultValue={data.lastname}
							className="e-input"
							placeholder="Enter Last Name"
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
							Firm
						</label>
						<DropDownListComponent
							id="firm"
							name="firm"
							dataSource={firmOptions}
							value={data.firm}
							placeholder="Select Firm"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 4 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							Contact Class
						</label>
						<DropDownListComponent
							id="contactclass"
							name="contactclass"
							dataSource={contactClassOptions}
							value={data.contactclass}
							placeholder="Select Contact Class"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 3 */}
				<div className="flex gap-4">
					{/* Input 5 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field5">
							Access Level
						</label>
						<DropDownListComponent
							id="accesslevel"
							name="accesslevel"
							dataSource={accessLevelOptions}
							value={data.accesslevel}
							placeholder="Select Access Level"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 6 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field6">
							Password
						</label>
						{/* Need to hide the password */}
						<input
							type="password"
							id="userpassword"
							name="userpassword"
							defaultValue={data.userpassword}
							className="e-input"
							placeholder="Enter Password"
							required={true}
							onChange={onChange}
							readonly={"true"}
						/>
					</div>
				</div>
				{/* Row 4 */}
				<div className="flex gap-4">
					{/* Input 7 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field7"
						>
							Primary Email
						</label>
						<input
							type="text"
							id="primaryemail"
							name="primaryemail"
							defaultValue={data.primaryemail}
							className="e-input"
							placeholder="Enter Primary Email"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 8 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field8">
							Secondary Email
						</label>
						<input
							type="text"
							id="secondaryemail"
							name="secondaryemail"
							defaultValue={data.secondaryemail}
							className="e-input"
							placeholder="Enter Secondary Email"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 5 */}
				<div className="flex gap-4">
					{/* Input 9 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field9">
							Primary Phone
						</label>
						<input
							type="text"
							id="primaryphone"
							name="primaryphone"
							defaultValue={data.primaryphone}
							className="e-input"
							placeholder="Enter Primary Phone"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 10 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field10"
						>
							Secondary Phone
						</label>
						<input
							type="text"
							id="secondaryphone"
							name="secondaryphone"
							defaultValue={data.secondaryphone}
							className="e-input"
							placeholder="Enter Secondary Phone"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 6 */}
				<div className="flex gap-4">
					{/* Input 11 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field11">
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
					{/* Input 12 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field12"
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

export default ContactEditTemplate;

