/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

import {
	contactClassOptions,
	statusOptions,
	accessLevelOptions,
} from "../data/worksideOptions";

import {
	GetAllFirms,
} from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

/**
 * ContactEditTemplate is a React functional component that renders a form for editing contact details.
 * It supports both read-only and editable modes based on the `isAdd` property in the `props`.
 * The component uses React hooks for state management and data fetching.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isAdd - Determines if the form is in "add" mode or "edit" mode.
 * @param {string} [props.firstname] - The first name of the contact.
 * @param {string} [props.lastname] - The last name of the contact.
 * @param {string} [props.firm] - The firm associated with the contact.
 * @param {string} [props.contactclass] - The contact class of the contact.
 * @param {string} [props.accesslevel] - The access level of the contact.
 * @param {string} [props.userpassword] - The password for the contact (read-only).
 * @param {string} [props.primaryemail] - The primary email of the contact.
 * @param {string} [props.secondaryemail] - The secondary email of the contact.
 * @param {string} [props.primaryphone] - The primary phone number of the contact.
 * @param {string} [props.secondaryphone] - The secondary phone number of the contact.
 * @param {string} [props.status] - The status of the contact.
 * @param {Date} [props.statusdate] - The date associated with the contact's status.
 *
 * @returns {JSX.Element} A JSX element that renders the contact edit form.
 *
 * @example
 * <ContactEditTemplate
 *   isAdd={true}
 *   firstname="John"
 *   lastname="Doe"
 *   firm="Example Firm"
 *   contactclass="VIP"
 *   accesslevel="Admin"
 *   userpassword="password123"
 *   primaryemail="john.doe@example.com"
 *   secondaryemail="j.doe@example.com"
 *   primaryphone="123-456-7890"
 *   secondaryphone="098-765-4321"
 *   status="ACTIVE"
 *   statusdate={new Date()}
 * />
 */
const ContactEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });

	// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		// console.log(`Field: ${args.target.name} Value: ${args.target.value}`);
		setData({ ...data, [args.target.name]: args.target.value });
	};

	const [isLoading, setIsLoading] = useState(false);
	const [firmOptions, setFirmOptions] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [modifyFlag, setModifyFlag] = useState(true);

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
			data.status = "ACTIVE";
			data.statusdate = new Date();
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	// Get the firms data
	const { data: firmData } = useQuery({
		queryKey: ["firms"],
		queryFn: () => GetAllFirms(),
		refetchInterval: 10000,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes
		retry: 3,
	});

	// Get Firms
	const getFirmOptions = (firms) => {
		if (firms === undefined || firms === null) return [];
		const firmList = firms.data?.map((f) => f.name);
		return firmList;
	};

	useEffect(() => {
		if (firmData) {
			setFirmOptions(getFirmOptions(firmData));
			setModifyFlag(false);
		}
	}, [firmData, modifyFlag]);

	return (
		<div className="flex justify-center items-center bg-white">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
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
							readonly={readOnlyFlag ? "true" : "false"}
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
							readonly={readOnlyFlag ? "true" : "false"}
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
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field4"
						>
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
							readonly={readOnlyFlag}
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
							readonly={"true"}
							s
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
						<label className="text-sm font-medium mb-1" htmlFor="field10">
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
						<label className="text-sm font-medium mb-1" htmlFor="field12">
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

