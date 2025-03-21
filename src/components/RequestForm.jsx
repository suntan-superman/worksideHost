import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	DropDownListComponent,
	DatePickerComponent,
	DateTimePickerComponent,
	NumericTextBoxComponent,
} from "@syncfusion/ej2-react-dropdowns";
import { Button, CircularProgress, Alert } from "@mui/material";
import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
import {
	GetProducts,
	GetAllSupplierGroupData,
	GetSupplierIDFromName,
	SaveNewRequest,
	UpdateRequest,
} from "../api/worksideAPI";

const RequestForm = ({
	initialData = null,
	onSuccess,
	onCancel,
	isEditMode = false,
}) => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState(() => {
		const storedPrefs = getStoredPreferences();
		const now = new Date();

		return {
			requestcategory: "",
			requestname: "",
			quantity: 1,
			comments: "",
			vendortype: "MSA",
			vendorName: "",
			status: isEditMode
				? initialData?.status
				: storedPrefs.status || "NOT-AWARDED",
			statusdate: now,
			datetimerequested: getDefaultDateTime(),
			creationdate: now,
			customername: isEditMode
				? initialData?.customername
				: storedPrefs.customername,
			customercontact: isEditMode
				? initialData?.customercontact
				: storedPrefs.customercontact,
			projectname: isEditMode
				? initialData?.projectname
				: storedPrefs.projectname,
			rigcompany: isEditMode ? initialData?.rigcompany : storedPrefs.rigcompany,
			rigcompanycontact: isEditMode
				? initialData?.rigcompanycontact
				: storedPrefs.rigcompanycontact,
			...initialData,
		};
	});

	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Get stored preferences from localStorage
	const getStoredPreferences = () => {
		return {
			customername: localStorage.getItem("lastCustomer") || "",
			customercontact: localStorage.getItem("lastCustomerContact") || "",
			projectname: localStorage.getItem("lastProject") || "",
			rigcompany: localStorage.getItem("lastRigCompany") || "",
			rigcompanycontact: localStorage.getItem("lastRigCompanyContact") || "",
			status: localStorage.getItem("lastStatus") || "OPEN",
		};
	};

	// Save preferences to localStorage
	const savePreferences = (data) => {
		localStorage.setItem("lastCustomer", data.customername || "");
		localStorage.setItem("lastCustomerContact", data.customercontact || "");
		localStorage.setItem("lastProject", data.projectname || "");
		localStorage.setItem("lastRigCompany", data.rigcompany || "");
		localStorage.setItem("lastRigCompanyContact", data.rigcompanycontact || "");
		localStorage.setItem("lastStatus", data.status || "OPEN");
	};

	// Get default date time
	const getDefaultDateTime = () => {
		const now = new Date();
		now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
		return now;
	};

	// Fetch products data
	const { data: productsData, isLoading: isLoadingProducts } = useQuery({
		queryKey: ["products"],
		queryFn: GetProducts,
	});

	// Fetch supplier data
	const { data: supplierData, isLoading: isLoadingSuppliers } = useQuery({
		queryKey: ["suppliers"],
		queryFn: GetAllSupplierGroupData,
	});

	// Mutation for saving/updating request
	const requestMutation = useMutation({
		mutationFn: async (data) => {
			if (isEditMode) {
				return UpdateRequest({ reqID: initialData._id, reqData: data });
			}
			return SaveNewRequest(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["requests"]);
			showSuccessDialogWithTimer(
				`Request ${isEditMode ? "Updated" : "Created"} Successfully`,
			);
			onSuccess?.();
		},
		onError: (error) => {
			showErrorDialog(error.message || "Failed to save request");
		},
	});

	// Handle input changes
	const handleChange = (args) => {
		if (args.value !== undefined) {
			const name = args.element?.id || args.target?.name;
			const value = args.itemData?.value || args.value;

			setFormData((prev) => {
				const newData = { ...prev, [name]: value };
				// Save preferences when relevant fields change
				if (
					[
						"customername",
						"customercontact",
						"projectname",
						"rigcompany",
						"rigcompanycontact",
						"status",
					].includes(name)
				) {
					savePreferences(newData);
				}
				return newData;
			});

			// Clear errors when field is modified
			if (errors[name]) {
				setErrors((prev) => ({ ...prev, [name]: "" }));
			}
		}
	};

	// Validate form
	const validateForm = () => {
		const newErrors = {};
		if (!formData.requestcategory)
			newErrors.requestcategory = "Request category is required";
		if (!formData.requestname)
			newErrors.requestname = "Request name is required";
		if (!formData.customername)
			newErrors.customername = "Customer name is required";
		if (!formData.projectname)
			newErrors.projectname = "Project name is required";
		if (!formData.quantity || formData.quantity < 1)
			newErrors.quantity = "Valid quantity is required";
		if (!formData.datetimerequested)
			newErrors.datetimerequested = "Request date/time is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await requestMutation.mutateAsync(formData);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Loading state
	if (isLoadingProducts || isLoadingSuppliers) {
		return (
			<div className="flex justify-center items-center h-64">
				<CircularProgress />
			</div>
		);
	}

	return (
		<div className="p-6 bg-white rounded-lg shadow-md">
			<div className="space-y-6">
				{/* Request Category and Name */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="requestcategory"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Request Category
						</label>
						<DropDownListComponent
							id="requestcategory"
							dataSource={productsData?.data || []}
							fields={{ text: "text", value: "value" }}
							value={formData.requestcategory}
							onChange={handleChange}
							placeholder="Select Category"
							popupHeight="300px"
							allowFiltering={true}
							filterType="Contains"
							cssClass="e-custom"
						/>
						{errors.requestcategory && (
							<p className="mt-1 text-sm text-red-600">
								{errors.requestcategory}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="requestname"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Request Name
						</label>
						<DropDownListComponent
							id="requestname"
							dataSource={productsData?.data || []}
							fields={{ text: "text", value: "value" }}
							value={formData.requestname}
							onChange={handleChange}
							placeholder="Select Request"
							popupHeight="300px"
							allowFiltering={true}
							filterType="Contains"
						/>
						{errors.requestname && (
							<p className="mt-1 text-sm text-red-600">{errors.requestname}</p>
						)}
					</div>
				</div>

				{/* Customer Information */}
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="customername"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Customer
						</label>
						<DropDownListComponent
							id="customername"
							dataSource={[]} // Add customer data source
							fields={{ text: "text", value: "value" }}
							value={formData.customername}
							onChange={handleChange}
							placeholder="Select Customer"
							cssClass="e-custom"
						/>
						{errors.customername && (
							<p className="mt-1 text-sm text-red-600">{errors.customername}</p>
						)}
					</div>
					<div>
						<label
							htmlFor="customercontact"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Customer Contact
						</label>
						<DropDownListComponent
							id="customercontact"
							dataSource={[]} // Add contact data source
							fields={{ text: "text", value: "value" }}
							value={formData.customercontact}
							onChange={handleChange}
							placeholder="Select Contact"
						/>
					</div>
				</div>

				{/* Project Information */}
				<div>
					<label
						htmlFor="projectname"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Project Name
					</label>
					<DropDownListComponent
						id="projectname"
						dataSource={[]} // Add project data source
						fields={{ text: "text", value: "value" }}
						value={formData.projectname}
						onChange={handleChange}
						placeholder="Select Project"
						cssClass="e-custom"
					/>
					{errors.projectname && (
						<p className="mt-1 text-sm text-red-600">{errors.projectname}</p>
					)}
				</div>

				{/* Request Details */}
				<div className="grid grid-cols-3 gap-4">
					<div>
						<label
							htmlFor="creationdate"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Request Date
						</label>
						<DatePickerComponent
							id="creationdate"
							value={formData.creationdate}
							onChange={handleChange}
							placeholder="Select Date"
						/>
					</div>
					<div>
						<label
							htmlFor="datetimerequested"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Date/Time Requested
						</label>
						<DateTimePickerComponent
							id="datetimerequested"
							value={formData.datetimerequested}
							onChange={handleChange}
							placeholder="Select Date/Time"
						/>
						{errors.datetimerequested && (
							<p className="mt-1 text-sm text-red-600">
								{errors.datetimerequested}
							</p>
						)}
					</div>
					<div>
						<label
							htmlFor="quantity"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Quantity
						</label>
						<NumericTextBoxComponent
							id="quantity"
							value={formData.quantity}
							min={1}
							onChange={handleChange}
							placeholder="Enter Quantity"
							showSpinButton={false}
							decimals={2}
							format="n2"
						/>
						{errors.quantity && (
							<p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
						)}
					</div>
				</div>

				{/* Comments */}
				<div>
					<label
						htmlFor="comments"
						className="block text-sm font-medium text-gray-700 mb-1"
					>
						Comments
					</label>
					<textarea
						id="comments"
						value={formData.comments}
						onChange={(e) =>
							handleChange({
								value: e.target.value,
								element: { id: "comments" },
							})
						}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
						rows={4}
						placeholder="Enter comments..."
					/>
				</div>

				{/* Form Actions */}
				<div className="flex justify-end space-x-4 pt-4 border-t">
					<Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<CircularProgress size={24} color="inherit" />
						) : isEditMode ? (
							"Update Request"
						) : (
							"Create Request"
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default RequestForm; 