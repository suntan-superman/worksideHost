/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { UseStateContext } from "../contexts/ContextProvider";
import "../styles/material.css";

import {
	GetAllSuppliers,
	GetCustomerSupplierMSAData,
} from "../api/worksideAPI";

// Set Selection Options
import { msaStatusOptions } from "../data/worksideOptions";

const CustomerSupplierMSAEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [customerSupplierMSAData, setCustomerSupplierMSAData] = useState([]);
	const { companyID, companyName } = UseStateContext();

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
			data.customername = companyName;
			data.status = "ACTIVE";
			data.statusdate = new Date();
			data.msastatus = "ACTIVE";
			data.msastatusdate = new Date();

			const newDate = new Date();
			newDate.setFullYear(data.msastatusdate.getFullYear() + 1);
			data.msarenewaldate = newDate;
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	// Handle input changes
	const onChange = (args) => {
		// TODO: Add code to handle Supplier Name change
		if (args.target.name === "suppliername" && data.isAdd) {
			if (
				DoesMSARecordExist(customerSupplierMSAData, args.target.value) === true
			) {
				window.alert("Customer-Supplier MSA Record Already Exists");
				return;
			}
			// Get Supplier ID
			// setData({ ...data, [args.target.name]: args.value });
		}
		setData({ ...data, [args.target.name]: args.target.value });
	};

	const DoesMSARecordExist = (dataset, supplierName) => {
		return dataset.some((item) => item.suppliername === supplierName);
	};

	const [isLoading, setIsLoading] = useState(false);

	const fetchOptions = async () => {
		setIsLoading(true);
		if (data.isAdd) {
			data.customername = companyName;
			data.status = "ACTIVE";
			data.statusdate = new Date();
			data.msastatus = "ACTIVE";
			data.msastatusdate = new Date();

			const newDate = new Date();
			newDate.setFullYear(data.msastatusdate.getFullYear() + 1);
			data.msarenewaldate = newDate;
		}
		setIsLoading(false);
	};

	const fetchSuppliers = async () => {
		setIsLoading(true);
		await GetAllSuppliers().then((response) => {
			if (response.status === 200) {
				const suppliers = response.data.map((r) => r.name);
				setSupplierOptions(suppliers);
				setIsLoading(false);
			} else {
				console.log("Error: ", response.status);
			}
		});
		setIsLoading(false);
	};

	const fetchCustomerSupplierMSAData = async (id) => {
		setCustomerSupplierMSAData([]);
		if (id) {
			GetCustomerSupplierMSAData(id).then((response) => {
				if (response.status === 200) {
					if (response.data) {
						setCustomerSupplierMSAData(response.data);
					} else {
						console.log("Customer-Supplier MSA Not Found");
					}
				}
			});
		}
	};

	useEffect(() => {
		fetchOptions();
		if (data.isAdd) {
			fetchCustomerSupplierMSAData(companyID).then(() => {
				fetchSuppliers();
			});
		}
	}, []);

	return (
		<div className="flex justify-center items-center bg-white">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			<div className="w-[300px] mx-[4px] space-y-2">
				{/* Row 1 */}
				{/* <div className="flex gap-4"> */}
				{/* Input 1 */}
				<div className="flex flex-col w-full">
					<label
						className={"text-red-500 text-sm font-medium mb-1"}
						htmlFor="field1"
					>
						Customer Name
					</label>
					<input
						type="text"
						id="customername"
						name="customername"
						defaultValue={data.customername}
						className="e-input"
						placeholder="Enter Customer name"
						required={true}
						// onChange={onChange}
						disabled={true}
						readonly={true}
					/>
					{/* </div> */}
				</div>
				{/* Input 2 */}
				{/* <div className="w-[400px] mx-[4px] space-y-2"> */}
				<div className="flex flex-col  w-full">
					<label
						className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
						htmlFor="field2"
					>
						Supplier Name
					</label>
					{!data.isAdd && (
						<label className={"text-black text-sm font-medium mb-1"}>
							{data.suppliername}
						</label>
					)}
					{data.isAdd && (
						<DropDownListComponent
							id="suppliername"
							dataSource={supplierOptions}
							name="suppliername"
							value={data.suppliername}
							placeholder="Select Supplier"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					)}
				</div>
				{/* </div> */}
				{/* Row 2 */}
				{/* <div className="w-[600px] mx-[4px] space-y-2"> */}
				<div className="flex flex-col  w-full">
					{/* Input 3 */}
					<div className="flex flex-col w-full">
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							MSA Status
						</label>
						<DropDownListComponent
							id="msastatus"
							name="msastatus"
							dataSource={msaStatusOptions}
							value={data.msastatus}
							placeholder="Select MSA Status"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Input 4 */}
				<div className="flex flex-col w-full">
					<label className="text-sm font-medium mb-1" htmlFor="field5">
						MSA Status Date
					</label>
					<DatePickerComponent
						id="msastatusdate"
						name="msastatusdate"
						value={data.msastatusdate}
						placeholder="Select Status Date"
						required={true}
						onChange={onChange}
					/>
				</div>
				{/* Input 5 */}
				<div className="flex flex-col w-full">
					<label className="text-sm font-medium mb-1" htmlFor="field5">
						MSA Renewal Date
					</label>
					<DatePickerComponent
						id="msarenewaldate"
						name="msarenewaldate"
						value={data.msarenewaldate}
						placeholder="Select Renewal Date"
						required={true}
						onChange={onChange}
					/>
				</div>
			</div>
			{/* End of Input Fields */}
			{/* </div> */}
		</div>
	);
};

export default CustomerSupplierMSAEditTemplate;

