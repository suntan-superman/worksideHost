/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import "../styles/material.css";

import { areaOptions, projectStatusOptions } from "../data/worksideOptions";

const ProjectEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [validateLocationFlag, setValidateLocationFlag] = useState(false);
	const [userLatitude, setUserLatitude] = useState(0);
	const [userLongitude, setUserLongitude] = useState(0);

// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		// console.log(`Field: ${args.target.name} Value: ${args.target.value}`);
		if (args.target.name === "longdec" && validateLocationFlag) {
			const distance = haversineDistance(
				userLatitude,
				userLongitude,
				data.latdec,
				args.target.value,
			);
			if (distance > 100)
				alert(
					"Distance between user location and project location is greater than 100 miles",
				);
			// console.log(`Distance: ${distance}`, null, 2);
		}
		setData({ ...data, [args.target.name]: args.target.value });
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

	const GetCurrentLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const lat = position.coords.latitude;
				const long = position.coords.longitude;
				setData({ ...data, latdec: lat, longdec: long });
				setUserLatitude(lat);
				setUserLongitude(long);
				setValidateLocationFlag(true);
			});
		} else {
			alert("Geolocation is not supported by this browser.");
			setValidateLocationFlag(false);
		}
	};

	function haversineDistance(lat1, lon1, lat2, lon2) {
		const toRadians = (degree) => (degree * Math.PI) / 180; // Convert degrees to radians

		const R = 3958.8; // Radius of the Earth in miles
		const dLat = toRadians(lat2 - lat1); // Delta latitude
		const dLon = toRadians(lon2 - lon1); // Delta longitude
		const radLat1 = toRadians(lat1); // Latitude 1 in radians
		const radLat2 = toRadians(lat2); // Latitude 2 in radians

		// Haversine formula
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(radLat1) *
				Math.cos(radLat2) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;

		return distance; // Distance in miles
	}

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
			SetDefaultDates();
			GetCurrentLocation();
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	const SetDefaultDates = () => {
		// Set Status Date to Today
		let statusdate;
		let startdate;
		{
			const today = new Date();
			const dd = String(today.getDate()).padStart(2, "0");
			const mm = String(today.getMonth() + 1).padStart(2, "0");
			const yyyy = today.getFullYear();
			statusdate = `${yyyy}-${mm}-${dd}`;
		}
		{
			const tomorrow = new Date();
			tomorrow.setDate(tomorrow.getDate() + 1);
			const dd = String(tomorrow.getDate()).padStart(2, "0");
			const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
			const yyyy = tomorrow.getFullYear();
			startdate = `${yyyy}-${mm}-${dd}`;
		}
		setData({
			...data,
			statusdate: statusdate,
			projectedstartdate: startdate,
		});
	};

	const SetDefaultStartDate = () => {
		// Set Status Date to Today
		{
			const today = new Date();
			const dd = String(today.getDate()).padStart(2, "0");
			const mm = String(today.getMonth() + 1).padStart(2, "0");
			const yyyy = today.getFullYear();
			const formattedDate = `${yyyy}-${mm}-${dd}`;
			setData({ ...data, projectedstartdate: formattedDate });
		}
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
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
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
					{/* Input 2 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field2"
						>
							Customer
						</label>
						<DropDownListComponent
							id="customer"
							dataSource={customerOptions}
							name="customer"
							value={data.customer}
							placeholder="Select Customer"
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
							className={`${!data.isAdd ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field3"
						>
							Project Name
						</label>
						<input
							type="text"
							id="projectname"
							name="projectname"
							defaultValue={data.projectname}
							className="e-input"
							placeholder="Enter Project Name"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 4 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							Project Description
						</label>
						<input
							type="text"
							id="description"
							name="description"
							defaultValue={data.description}
							className="e-input"
							placeholder="Enter Project Description"
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 3 */}
				<div className="flex gap-4">
					{/* Input 5 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field5">
							Project Status
						</label>
						<DropDownListComponent
							id="status"
							name="status"
							dataSource={projectStatusOptions}
							value={data.status}
							placeholder="Select Project Status"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 6 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field6">
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
				{/* Row 4 */}
				<div className="flex gap-4">
					{/* Input 7 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field7">
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
					{/* Input 8 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field8">
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
						/>
					</div>
				</div>
				{/* Row 5 */}
				<div className="flex gap-4">
					{/* Input 9 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field9">
							Projected Start Date
						</label>
						<DatePickerComponent
							id="projectedstartdate"
							name="projectedstartdate"
							value={data.projectedstartdate}
							placeholder="Select Start Date"
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
							Actual Start Date
						</label>
						<DatePickerComponent
							id="actualstartdate"
							name="actualstartdate"
							value={data.actualstartdate}
							placeholder="Select Start Date"
							disabled={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 6 */}
				<div className="flex gap-4">
					{/* Input 11 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field11">
							Expected Duration
						</label>
						<NumericTextBoxComponent
							id="expectedduration"
							name="expectedduration"
							value={data.expectedduration}
							placeholder="Enter Expected Duration"
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
							Actual Duration
						</label>
						<NumericTextBoxComponent
							id="actualduration"
							name="actualduration"
							value={data.expectedduration}
							placeholder="Enter Actual Duration"
							disabled={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 7 */}
				<div className="flex gap-4">
					{/* Input 13 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field13">
							Latitude
						</label>
						<NumericTextBoxComponent
							id="latdec"
							name="latdec"
							value={data.latdec}
							placeholder="Enter Latitude"
							showSpinButton={false}
							decimals={5}
							format="n5"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 14 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field14">
							Longitude
						</label>
						<NumericTextBoxComponent
							id="longdec"
							name="longdec"
							value={data.longdec}
							placeholder="Enter Longitude"
							showSpinButton={false}
							decimals={5}
							format="n5"
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

export default ProjectEditTemplate;

