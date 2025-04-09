/* eslint-disable */

import React, { useEffect, useState, useCallback } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";
import { areaOptions } from "../data/worksideOptions";
import { firmStatusOptions, firmTypeOptions } from "../data/worksideOptions";
import { GetAllFirmsForSelection } from "../api/worksideAPI";

/**
 * FirmEditTemplate Component
 *
 * This component renders a form for editing or adding firm details. It includes
 * various input fields for firm information such as name, area, type, address, city,
 * state, zip code, status, and status date. The component also handles read-only
 * states and dynamically fetches options for dropdown fields.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isAdd - Determines if the form is in "add" mode or "edit" mode.
 * @param {string} props.name - The name of the firm.
 * @param {string} props.area - The area of the firm.
 * @param {string} props.type - The type of the firm.
 * @param {string} props.address1 - The first line of the firm's address.
 * @param {string} props.address2 - The second line of the firm's address.
 * @param {string} props.city - The city of the firm.
 * @param {string} props.state - The state of the firm.
 * @param {string} props.zipCode - The zip code of the firm.
 * @param {string} props.status - The status of the firm (e.g., ACTIVE, INACTIVE).
 * @param {Date} props.statusdate - The date associated with the firm's status.
 * @param {function} props.onChange - Callback function to update parent component with form data.
 *
 * @returns {JSX.Element} A form for editing or adding firm details.
 *
 * @example
 * <FirmEditTemplate
 *   isAdd={true}
 *   name="Example Firm"
 *   area="Downtown"
 *   type="CUSTOMER"
 *   address1="123 Main St"
 *   address2="Suite 100"
 *   city="Metropolis"
 *   state="NY"
 *   zipCode="12345"
 *   status="ACTIVE"
 *   statusdate={new Date()}
 *   onChange={handleFormDataChange}
 * />
 */
const FirmEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);

	// Load Google Maps API
	useEffect(() => {
		const loadGoogleMaps = () => {
			const script = document.createElement("script");
			script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
			script.async = true;
			script.onload = () => setGoogleMapsLoaded(true);
			document.head.appendChild(script);
		};

		if (!window.google) {
			loadGoogleMaps();
		} else {
			setGoogleMapsLoaded(true);
		}
	}, []);

	// Update local state when props change
	useEffect(() => {
		setData({ ...props });
	}, [props]);

	const onChange = useCallback(
		(args) => {
			console.log(
				"Field changed:",
				args.target.name,
				"New value:",
				args.target.value,
			);
			const newData = { ...data, [args.target.name]: args.target.value };
			setData(newData);
			// Pass the updated data to the parent component
			if (props.onChange) {
				props.onChange(newData);
			}
		},
		[data, props],
	);

	// Fix for data.isAdd dependency
	useEffect(() => {
		// ReadOnly flag
		if (props.isAdd) {
			setReadOnlyFlag(false);
			setData((prev) => ({
				...prev,
				status: "ACTIVE",
				statusdate: new Date(),
			}));
			GetLatestEntries();
		} else {
			setReadOnlyFlag(true);
		}
	}, [props.isAdd]);

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

	// Fix for fetchOptions dependency
	const fetchOptions = useCallback(async () => {
		setIsLoading(true);
		await GetAllFirmsForSelection().then((response) => {
			// Get Customers
			const customerResult = response.data.filter(
				(json) => json.type === "CUSTOMER",
			);
			const customers = customerResult.map((r) => r.name);
			setCustomerOptions(customers);

			const rigResult = response.data.filter((r) => r.type === "RIGCOMPANY");
			// Extract names into an array
			const rigCompanies = rigResult.map((r) => r.name);
			setRigCompanyOptions(rigCompanies);
		});
		setIsLoading(false);
	}, []);

	useEffect(() => {
		// Get Customer and Rig Company Options from Firm Collection
		fetchOptions();
	}, [fetchOptions]);

	// const fetchContacts = async () => {
	// 	setIsLoading(true);
	// 	const response = await fetch(
	// 		`${process.env.REACT_APP_MONGO_URI}/api/contact`,
	// 	);
	// 	const json = await response.json();

	// 	// Get Customer Contacts
	// 	const result = json.filter((json) => json.firm === data.customer);
	// 	// Extract names into an array
	// 	const contacts = result.map((r) => r.username);
	// 	setContactOptions(contacts);

	// 	setIsLoading(false);
	// };

	// useEffect(() => {
	// 	// Get Contact Options from Contact Collection
	// 	fetchContacts();
	// }, [data.customer]);

	// Check if required fields are filled
	const isFormValid = () => {
		return data.name && data.area && data.type && data.city && data.state;
	};

	// Fix for geocodeAddress dependency
	const geocodeAddress = useCallback(async () => {
		if (!data.address1 || !data.city || !data.state) {
			alert("Please fill in all address fields before geocoding");
			return;
		}

		const fullAddress = `${data.address1}, ${data.city}, ${data.state} ${data.zipCode || ""}`;

		try {
			setIsGeocoding(true);
			const geocoder = new window.google.maps.Geocoder();
			const response = await geocoder.geocode({ address: fullAddress });

			if (response?.results?.[0]) {
				const { lat, lng } = response.results[0].geometry.location;
				setData((prev) => ({ ...prev, lat: lat(), lng: lng() }));
			} else {
				alert("Could not find coordinates for this address");
			}
		} catch (error) {
			console.error("Error geocoding address:", error);
			alert("Error geocoding address. Please try again.");
		} finally {
			setIsGeocoding(false);
		}
	}, [data.address1, data.city, data.state, data.zipCode]);

	useEffect(() => {
		if (
			data.type === "SUPPLIER" &&
			data.address1 &&
			data.city &&
			data.state &&
			data.zipCode
		) {
			geocodeAddress();
		}
	}, [
		data.type,
		data.address1,
		data.city,
		data.state,
		data.zipCode,
		geocodeAddress,
	]);

	const handleKeyDown = useCallback((e) => {
		console.log("KeyDown event:", e.key, "Target:", e.target.tagName);
		// Only prevent Enter key in input fields
		if (e.key === "Enter" && e.target.tagName === "INPUT") {
			console.log("Preventing Enter key in input field");
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}, []);

	const handleSubmit = (e) => {
		// Only prevent form submission if it's not from the save button
		if (!e.target.closest(".e-save")) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	};

	return (
		<div className="flex justify-center items-center bg-white">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			<form
				className="w-[600px] mx-[4px] space-y-2"
				onKeyDown={handleKeyDown}
				onSubmit={handleSubmit}
			>
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
							onKeyDown={handleKeyDown}
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
							dataSource={firmStatusOptions}
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
				{/* Row 6 - Only show for SUPPLIER type */}
				{data.type === "SUPPLIER" && (
					<div className="flex flex-col gap-2">
						<div className="flex gap-4">
							{/* Input 11 */}
							<div className="flex flex-col w-1/2">
								<label className="text-sm font-medium mb-1" htmlFor="field11">
									Latitude{" "}
									{isGeocoding && (
										<span className="text-xs text-gray-500">
											(Geocoding...)
										</span>
									)}
								</label>
								<input
									type="number"
									id="lat"
									name="lat"
									value={data.lat || ""}
									className="e-input"
									placeholder="Enter Latitude"
									step="0.000001"
									onChange={onChange}
									readOnly={true}
								/>
							</div>
							{/* Input 12 */}
							<div className="flex flex-col w-1/2">
								<label className="text-sm font-medium mb-1" htmlFor="field12">
									Longitude{" "}
									{isGeocoding && (
										<span className="text-xs text-gray-500">
											(Geocoding...)
										</span>
									)}
								</label>
								<input
									type="number"
									id="lng"
									name="lng"
									value={data.lng || ""}
									className="e-input"
									placeholder="Enter Longitude"
									step="0.000001"
									onChange={onChange}
									readOnly={true}
								/>
							</div>
						</div>
						<button
							type="button"
							onClick={geocodeAddress}
							disabled={isGeocoding || !googleMapsLoaded}
							className="self-end px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
						>
							{isGeocoding ? "Geocoding..." : "Get Coordinates"}
						</button>
					</div>
				)}
				{/* End of Input Fields */}
			</form>
		</div>
	);
};

export default FirmEditTemplate;

