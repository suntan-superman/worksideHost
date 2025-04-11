/* eslint-disable */

import React, { useEffect, useState, useCallback } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";
import { areaOptions } from "../data/worksideOptions";
import { firmStatusOptions, firmTypeOptions } from "../data/worksideOptions";
import { GetAllFirms, GetAllFirmsForSelection } from "../api/worksideAPI";
import { showSuccessDialog } from "../utils/useSweetAlert";

const FirmEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [isGeocoding, setIsGeocoding] = useState(false);
	const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [rigCompanyOptions, setRigCompanyOptions] = useState([]);
	const [contactOptions, setContactOptions] = useState([]);
	const [existingFirm, setExistingFirm] = useState(null);
	const [showExistingFirmModal, setShowExistingFirmModal] = useState(false);
	const [fieldValidation, setFieldValidation] = useState({
		name: false,
		area: false,
		type: false,
		city: false,
		state: false,
		status: false,
		statusdate: false,
	});
	const [isFormValid, setIsFormValid] = useState(false);

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
		if (props.isAdd) {
			setData({
				name: "",
				area: "",
				type: "",
				address1: "",
				address2: "",
				city: "",
				state: "",
				zipCode: "",
				status: "ACTIVE",
				statusdate: new Date(),
				lat: "",
				lng: "",
			});
		} else {
			setData({ ...props });
		}
	}, [props]);

	const checkExistingFirm = useCallback(
		async (firmName) => {
			if (!firmName) return;
			try {
				const response = await GetAllFirms();
				const foundFirm = response.data.find(
					(firm) =>
						firm.name.toLowerCase() === firmName.toLowerCase() &&
						firm._id !== data._id,
				);
				setExistingFirm(foundFirm);
			} catch (error) {
				console.error("Error checking firm existence:", error);
			}
		},
		[data._id],
	);

	const handleNameBlur = useCallback(
		(e) => {
			checkExistingFirm(e.target.value);
		},
		[checkExistingFirm],
	);

	// Update form validation when data changes
	useEffect(() => {
		const requiredFields = [
			"name",
			"area",
			"type",
			"city",
			"state",
			"status",
			"statusdate",
		];

		// Create a new validation state object
		const newValidationState = {};
		requiredFields.forEach((fieldName) => {
			const value = data[fieldName];
			newValidationState[fieldName] =
				value !== undefined && value !== null && value !== "";
		});

		// Update the validation state
		setFieldValidation(newValidationState);

		// Update parent component with validation state
		if (props.onChange) {
			const isValid = Object.values(newValidationState).every(
				(v) => v === true,
			);
			props.onChange({
				...data,
				isValid,
				validationErrors: newValidationState,
			});
		}
	}, [data, props.onChange]);

	const handleSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();

		// Only handle save button clicks
		if (!e.target.closest(".e-save")) {
			return false;
		}

		// Check if form is valid
		const isValid = Object.values(fieldValidation).every((v) => v === true);
		if (!isValid) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}

		// Pass the form data back to the parent component
		if (props.onChange) {
			props.onChange({
				...data,
				isValid,
				validationErrors: fieldValidation,
			});
		}
	};

	// Fix for geocodeAddress dependency
	const geocodeAddress = useCallback(async () => {
		if (!data.address1 || !data.city || !data.state) {
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
			}
		} catch (error) {
			console.error("Error geocoding address:", error);
		} finally {
			setIsGeocoding(false);
		}
	}, [data.address1, data.city, data.state, data.zipCode]);

	const onChange = useCallback(
		(args) => {
			const newData = { ...data };

			if (args.target) {
				// Handle input fields
				newData[args.target.name] = args.target.value;
			} else if (args.value !== undefined) {
				// Handle Syncfusion components
				const fieldName = args.element.id;
				newData[fieldName] = args.value;

				// If type changes to SUPPLIER, trigger geocoding if address fields are filled
				if (fieldName === "type" && args.value === "SUPPLIER") {
					setData(newData);
					if (newData.address1 && newData.city && newData.state) {
						setTimeout(() => {
							geocodeAddress();
						}, 0);
					}
					return;
				}
			}

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

	useEffect(() => {
		if (
			data.type === "SUPPLIER" &&
			data.address1 &&
			data.city &&
			data.state &&
			googleMapsLoaded
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
		googleMapsLoaded,
	]);

	const handleKeyDown = useCallback((e) => {
		// Only prevent Enter key in input fields
		if (e.key === "Enter" && e.target.tagName === "INPUT") {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}, []);

	// Initialize field validation on component mount
	useEffect(() => {
		const initialValidation = {
			name: Boolean(data.name),
			area: Boolean(data.area),
			type: Boolean(data.type),
			city: Boolean(data.city),
			state: Boolean(data.state),
			status: Boolean(data.status),
			statusdate: Boolean(data.statusdate),
		};
		setFieldValidation(initialValidation);
	}, [
		data.name,
		data.area,
		data.type,
		data.city,
		data.state,
		data.status,
		data.statusdate,
	]);

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
							onBlur={handleNameBlur}
							disabled={readOnlyFlag}
							onKeyDown={handleKeyDown}
						/>
						{existingFirm && (
							<div className="text-red-500 text-sm mt-1">
								Firm already exists. Click{" "}
								<button
									type="button"
									className="text-blue-500 underline"
									onClick={() => setShowExistingFirmModal(true)}
								>
									here
								</button>{" "}
								to view details.
							</div>
						)}
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
							value={data.area}
							placeholder="Select Area"
							required={true}
							change={onChange}
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
							value={data.type}
							placeholder="Select Firm Type"
							required={true}
							change={onChange}
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
							required={true}
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
							required={true}
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
							change={onChange}
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
							change={onChange}
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
					</div>
				)}
				{/* End of Input Fields */}
			</form>

			{/* Existing Firm Details Modal */}
			{showExistingFirmModal && existingFirm && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-lg w-[600px] max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">Existing Firm Details</h2>
							<button
								type="button"
								onClick={() => setShowExistingFirmModal(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						</div>
						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<span className="font-medium block mb-1">Name:</span>
									<span>{existingFirm.name}</span>
								</div>
								<div>
									<span className="font-medium block mb-1">Type:</span>
									<span>{existingFirm.type}</span>
								</div>
								<div>
									<span className="font-medium block mb-1">Area:</span>
									<span>{existingFirm.area}</span>
								</div>
								<div>
									<span className="font-medium block mb-1">Status:</span>
									<span>{existingFirm.status}</span>
								</div>
							</div>
							<div>
								<span className="font-medium block mb-1">Address:</span>
								<div className="space-y-1">
									<span>{existingFirm.address1}</span>
									{existingFirm.address2 && (
										<span>, {existingFirm.address2}</span>
									)}
									<div>
										{existingFirm.city && <span>{existingFirm.city}, </span>}
										{existingFirm.state && <span>{existingFirm.state} </span>}
										{existingFirm.zipCode && (
											<span>{existingFirm.zipCode}</span>
										)}
									</div>
								</div>
							</div>
							<div>
								<span className="font-medium block mb-1">Status Date:</span>
								<span>
									{existingFirm.statusdate
										? new Date(existingFirm.statusdate).toLocaleDateString()
										: "N/A"}
								</span>
							</div>
						</div>
						<div className="mt-6 flex justify-end">
							<button
								type="button"
								onClick={() => setShowExistingFirmModal(false)}
								className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default FirmEditTemplate;

