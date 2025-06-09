/* eslint-disable */

import React, { useEffect, useState, useCallback } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import {
	DatePickerComponent,
	DateTimePickerComponent,
} from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import "../styles/material.css";

import {
	GetAllProjects,
	GetAllFirms,
	GetProducts,
	GetAllContacts,
	GetSupplierProductsByProduct,
	getRequestTemplates,
	createRequestTemplate,
} from "../api/worksideAPI";
import { useQuery } from "@tanstack/react-query";

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";
import useUserStore from "../stores/UserStore";

import { requestStatusOptions } from "../data/worksideOptions";

/**
 * RequestEditTemplate Component
 *
 * This component is used to create or edit a request template. It provides a form
 * with various input fields for capturing request details such as category, name,
 * customer, project, rig company, vendor type, and more. It also supports loading
 * and saving templates for reuse.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.rowData - The data for the current request being edited.
 *
 * @returns {JSX.Element} The rendered RequestEditTemplate component.
 *
 * @example
 * <RequestEditTemplate rowData={rowData} />
 *
 * @description
 * - Initializes form data based on the provided `rowData` or stored preferences.
 * - Allows users to load predefined templates or save the current form as a template.
 * - Dynamically updates dropdown options based on selected values (e.g., filtering products by category).
 * - Uses `useQuery` hooks to fetch data for projects, firms, products, and contacts.
 * - Handles input changes and updates the form state accordingly.
 * - Provides dialogs for selecting and saving templates.
 *
 * @dependencies
 * - React hooks: `useState`, `useEffect`, `useCallback`
 * - External libraries: `DropDownListComponent`, `DatePickerComponent`, `DateTimePickerComponent`, `NumericTextBoxComponent`
 * - Data fetching: `useQuery` from React Query
 *
 * @state
 * - `formData` (Object): The state for the form data.
 * - `templates` (Array): The list of available templates.
 * - `isLoadingTemplates` (boolean): Indicates if templates are being loaded.
 * - `showTemplateDialog` (boolean): Controls the visibility of the template selection dialog.
 * - `showSaveTemplateDialog` (boolean): Controls the visibility of the save template dialog.
 * - `newTemplateName` (string): The name of the new template being saved.
 * - `templateError` (string): Error message for template-related operations.
 * - Various dropdown options and filtered data states.
 *
 * @methods
 * - `getDefaultDateTime`: Returns the default date/time for the form.
 * - `getStoredPreferences`: Retrieves stored preferences from localStorage.
 * - `savePreferences`: Saves form data to localStorage as preferences.
 * - `FilterProducts`: Filters products based on the selected category.
 * - `GetSSRVendors`: Fetches Sole Source Vendors based on the selected category and product.
 * - `fetchTemplates`: Fetches the list of templates for the user.
 * - `handleTemplateSelection`: Applies a selected template to the form.
 * - `handleSaveTemplate`: Saves the current form data as a new template.
 *
 * @hooks
 * - `useEffect`: Used for initial data loading and updating dependent states.
 * - `useCallback`: Memoizes functions to prevent unnecessary re-renders.
 *
 * @notes
 * - The component uses hardcoded user ID for template operations (to be replaced with actual user ID).
 * - Includes loading indicators and error handling for data fetching and template operations.
 */
const RequestEditTemplate = (props) => {
	console.log("RequestEditTemplate - props:", props);

	// Extract data from props
	const data = props.rowData || props;
	const isNewRequest = !data._id;

	console.log("RequestEditTemplate - data:", {
		isNewRequest,
		data,
		props,
	});

	const userId = useUserStore((state) => state.userID);
	const [customerChangeFlag, setCustomerChangeFlag] = useState(false);

	// Function to get default date/time
	const getDefaultDateTime = () => {
		const now = new Date();
		const nextHour = new Date(now);
		nextHour.setHours(now.getHours() + 1);
		nextHour.setMinutes(0);
		nextHour.setSeconds(0);
		nextHour.setMilliseconds(0);
		return nextHour;
	};

	// Function to get stored preferences
	const getStoredPreferences = useCallback(() => {
		const defaults = {
			customername: localStorage.getItem("lastCustomer") || "",
			customercontact: localStorage.getItem("lastCustomerContact") || "",
			projectname: localStorage.getItem("lastProject") || "",
			rigcompany: localStorage.getItem("lastRigCompany") || "",
			rigcompanycontact: localStorage.getItem("lastRigCompanyContact") || "",
			status: localStorage.getItem("lastStatus") || "OPEN",
		};
		return defaults;
	}, []);

	const [formData, setFormData] = useState(() => {
		const storedPrefs = getStoredPreferences();
		const now = new Date();

		console.log("RequestEditTemplate - Initializing formData:", {
			isNewRequest,
			storedPrefs,
			data,
		});

		// For existing records, use the data directly
		if (!isNewRequest) {
			console.log("Editing existing record with data:", data);
			return {
				...data,
				requestcategory: data.requestcategory || data.categoryname || "",
				requestname: data.requestname || "",
				quantity: data.quantity || 1,
				comments: data.comments || "",
				vendortype: data.vendortype || "MSA",
				vendorName: data.vendorName || data.ssrVendorName || "",
				status: data.status || "NOT-AWARDED",
				statusdate: data.statusdate ? new Date(data.statusdate) : now,
				datetimerequested: data.datetimerequested
					? new Date(data.datetimerequested)
					: getDefaultDateTime(),
				creationdate: data.creationdate ? new Date(data.creationdate) : now,
				customername: data.customername || "",
				customercontact: data.customercontact || "",
				projectname: data.projectname || "",
				rigcompany: data.rigcompany || "",
				rigcompanycontact: data.rigcompanycontact || "",
			};
		}

		// For new records, use stored preferences
		return {
			requestcategory: "",
			requestname: "",
			quantity: 1,
			comments: "",
			vendortype: "MSA",
			vendorName: "",
			status: storedPrefs.status || "NOT-AWARDED",
			statusdate: now,
			datetimerequested: getDefaultDateTime(),
			creationdate: now,
			customername: storedPrefs.customername || "",
			customercontact: storedPrefs.customercontact || "",
			projectname: storedPrefs.projectname || "",
			rigcompany: storedPrefs.rigcompany || "",
			rigcompanycontact: storedPrefs.rigcompanycontact || "",
		};
	});

	useEffect(() => {
		if (props && props._id) {
			if (formData.isNewRequest || formData._id !== props._id) {
				setFormData((prevData) => ({
					...prevData,
					isNewRequest: false,
					...props,
				}));
				console.log("Editing existing record with data:", props);
			}
		} else {
			if (!formData.isNewRequest) {
				setFormData((prevData) => ({
					...prevData,
					isNewRequest: true,
				}));
				console.log("Creating new record");
			}
		}
	}, [props, formData.isNewRequest, formData._id]);

	const handleSave = () => {
		if (!formData.isNewRequest && formData._id) {
			console.log("Saving existing record with ID:", formData._id);
			// Ensure the _id is included in the save payload for updates
			const saveData = {
				...formData,
				_id: formData._id,
			};
			console.log("Save payload for update:", saveData);
			// Call save API or pass data to parent
		} else {
			console.log("Adding new record");
			// Exclude _id for new records
			const saveData = {
				...formData,
				_id: undefined,
			};
			console.log("Save payload for new record:", saveData);
			// Handle new record save logic
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
	const [products, setProducts] = useState([]);
	const [allProducts, setAllProducts] = useState([]);

	const vendorTypeOptions = ["MSA", "OPEN", "SSR"];

	// Update FilterProducts function to be memoized
	const FilterProducts = useCallback(
		(selectedCategory) => {
			try {
				if (!selectedCategory || !allProducts?.length) {
					console.log("No category selected or no products available");
					setFilteredProducts([]);
					return;
				}

				const filtered = allProducts
					.filter((p) => p.categoryname === selectedCategory)
					.map((p) => ({
						text: p.productname,
						value: p.productname,
					}));
				const uniqueFiltered = [...new Set(filtered.map(JSON.stringify))].map(
					JSON.parse,
				);
				setFilteredProducts(uniqueFiltered);
			} catch (error) {
				console.error("Error filtering products:", error);
				setFilteredProducts([]);
			}
		},
		[allProducts],
	);

	// Add useEffect to handle initial data loading
	useEffect(() => {
		const isNewRequest = !data._id;
		if (isNewRequest) {
			const storedPrefs = getStoredPreferences();
			console.log("Loading stored preferences for new request:", storedPrefs);

			setFormData((prev) => ({
				...prev,
				customername: storedPrefs.customername || "",
				customercontact: storedPrefs.customercontact || "",
				projectname: storedPrefs.projectname || "",
				rigcompany: storedPrefs.rigcompany || "",
				rigcompanycontact: storedPrefs.rigcompanycontact || "",
				status: storedPrefs.status || "NOT-AWARDED",
			}));
		} else {
			console.log("Editing existing request with data:", {
				requestcategory: data.requestcategory,
				requestname: data.requestname,
				vendortype: data.vendortype,
				ssrVendorName: data.ssrVendorName,
			});

			// Set the category and product immediately
			if (data.requestcategory) {
				console.log("Setting category:", data.requestcategory);
				setFormData((prev) => ({
					...prev,
					requestcategory: data.requestcategory,
					requestname: data.requestname || "",
				}));

				// Then filter products for this category
				console.log("Filtering products for category:", data.requestcategory);
				FilterProducts(data.requestcategory);
			}
		}
	}, [
		data._id,
		getStoredPreferences,
		FilterProducts,
		data.requestcategory,
		data.requestname,
		data.vendortype,
		data.ssrVendorName,
	]);

	// Add useEffect to handle SSR vendor population for existing records
	useEffect(() => {
		if (
			formData.requestcategory &&
			formData.requestname &&
			formData.vendortype === "SSR"
		) {
			console.log("Form data has SSR requirements, triggering GetSSRVendors");
			GetSSRVendors();
		}
	}, [formData.requestcategory, formData.requestname, formData.vendortype]);

	// Template state
	const [templates, setTemplates] = useState([]);
	const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
	const [showTemplateDialog, setShowTemplateDialog] = useState(false);
	const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
	const [newTemplateName, setNewTemplateName] = useState("");
	const [templateError, setTemplateError] = useState("");
	const [templateVisibility, setTemplateVisibility] = useState("private");
	const [templateVisibilityFilter, setTemplateVisibilityFilter] =
		useState("all");

	// Handle input changes
	const onChange = (args) => {
		console.log("RequestEditTemplate onChange - args:", args);
		let name;
		let value;

		if (args.target) {
			name = args.target.name;
			value = args.target.value;
		} else if (args.value !== undefined) {
			name = args.element.id;
			value = args.value;
		} else if (args.itemData) {
			name = args.element.id;
			value = args.itemData.value || args.itemData.text;
		}

		console.log("RequestEditTemplate onChange - name:", name, "value:", value);

		setFormData((prevData) => {
			const newData = { ...prevData, [name]: value };
			console.log("RequestEditTemplate onChange - newData:", newData);

			// Notify parent component of changes
			if (props.onChange) {
				props.onChange(newData);
			}

			return newData;
		});

		if (name === "requestcategory") {
			FilterProducts(value);
		}
		if (name === "vendortype" && value === "SSR") {
			GetSSRVendors();
		}
		if (name === "customername") {
			setCustomerChangeFlag(true);
			setFormData((prev) => ({ ...prev, customercontact: "" }));
		}
		if (name === "rigcompany") {
			setFormData((prev) => ({ ...prev, rigcompanycontact: "" }));
		}
	};

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
	const { data: productsData, isLoading: isLoadingProducts } = useQuery({
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

	// Update useEffect for initial product loading
	useEffect(() => {
		if (productsData?.data) {
			// Extract unique categories and sort them alphabetically
			const uniqueCategories = [
				...new Set(productsData.data.map((p) => p.categoryname)),
			]
				.filter(Boolean)
				.sort();
			// Format categories for dropdown
			const formattedCategories = uniqueCategories.map((category) => ({
				text: category,
				value: category,
			}));
			// Set all products and categories
			setAllProducts(productsData.data);
			setAllCategories(formattedCategories);
		}
	}, [productsData]);

	// Separate useEffect for filtered products
	useEffect(() => {
		if (allProducts.length > 0 && formData.requestcategory) {
			const filteredProducts = allProducts
				.filter((p) => p.categoryname === formData.requestcategory)
				.map((p) => ({
					text: p.productname,
					value: p.productname,
				}));
			setFilteredProducts([...new Set(filteredProducts)]);
		} else {
			setFilteredProducts([]);
		}
	}, [allProducts, formData.requestcategory]);

	const getCustomers = useCallback((firms) => {
		if (firms === undefined || firms === null) return [];
		return firms.data.filter((firm) => firm.type === "CUSTOMER");
	}, []);

	const getRigCompanies = useCallback((firms) => {
		if (firms === undefined || firms === null) return [];
		return firms.data.filter((firm) => firm.type === "RIGCOMPANY");
	}, []);

	useEffect(() => {
		if (firmData === undefined || firmData === null) return;

		// Get Customers
		const customerResult = getCustomers(firmData);
		const customers = customerResult?.map((r) => ({
			text: r.name,
			value: r.name,
		}));
		setCustomerOptions(customers);

		// Get Rig Companies
		const rigResult = getRigCompanies(firmData);
		const rigCompanies = rigResult?.map((r) => ({
			text: r.name,
			value: r.name,
		}));
		setRigCompanyOptions(rigCompanies);

		// Get Projects
		if (projData?.data) {
			const projects = projData.data.map((p) => ({
				text: p.projectname,
				value: p.projectname,
			}));
			setProjectOptions(projects);
		}
	}, [firmData, projData, getCustomers, getRigCompanies]);

	// Memoize filterContactsByFirm
	const filterContactsByFirm = useCallback((contacts, firm) => {
		return contacts?.filter((contact) => contact?.firm === firm);
	}, []);

	// Get Customer Contacts
	useEffect(() => {
		if (contactsData === undefined || contactsData === null) return;

		const contacts = contactsData.data;
		const result = filterContactsByFirm(contacts, formData.customername);
		const contactsList = result.map((r) => ({
			text: r.username,
			value: r.username,
		}));
		setContactOptions(contactsList);
		setCustomerChangeFlag(false);
	}, [contactsData, formData.customername, filterContactsByFirm]);

	// Get Rig Company Contacts
	useEffect(() => {
		if (contactsData === undefined || contactsData === null) return;
		const result = contactsData.data.filter(
			(contact) => contact.firm === formData.rigcompany,
		);
		// Format contacts for dropdown
		const contacts = result.map((r) => ({
			text: r.username,
			value: r.username,
		}));
		setRigCompanyContactOptions(contacts);
	}, [contactsData, formData.rigcompany]);

	const extractProducts = (response) => {
		if (Array.isArray(response) && response.length > 0) {
			// Check if response is an array and has data
			// Check if the first item has status and data
			if (response[0].status === 200 && response[0].data) {
				return response[0].data;
			}
		}
		if (response?.data) {
			// If response is directly an object with data
			return response.data;
		}
		return [];
	};

	const GetSSRVendors = async () => {
		try {
			if (
				formData.requestcategory === undefined ||
				formData.requestname === undefined ||
				!formData.requestcategory ||
				!formData.requestname
			) {
				await showErrorDialog(
					"Please select a Request Category and Request Name!",
				);
				return;
			}

			const response = await GetSupplierProductsByProduct(
				formData.requestcategory,
				formData.requestname,
			);

			const suppliers = extractProducts(response);

			const filteredSuppliers = suppliers.filter((s) => {
				const matches =
					s.category === formData.requestcategory &&
					s.product === formData.requestname;
				return matches;
			});

			if (filteredSuppliers.length === 0) {
				showErrorDialog("No Sole Source Vendors/Suppliers Found!");
			} else {
				const uniqueSuppliers = [
					...new Set(filteredSuppliers.map((s) => s.supplier)),
				];
				setMSAVendorOptions(uniqueSuppliers);
			}
		} catch (error) {
			console.error("Error in GetSSRVendors:", error);
			showErrorDialog(`Error fetching suppliers: ${error.message}`);
		}
	};

	// Template handling functions
	const fetchTemplates = useCallback(async () => {
		// if (!userId) return;
		// TODO: Remove this once we have a user ID
		const userId = "679d76fde33b65f7d45013e4";
		setIsLoadingTemplates(true);
		try {
			const response = await getRequestTemplates(userId);
			if (!response?.data) {
				throw new Error("No templates data received");
			}
			setTemplates(response.data);
		} catch (error) {
			console.error("Error fetching templates:", error);
			setTemplateError("Failed to load templates");
		} finally {
			setIsLoadingTemplates(false);
		}
	}, []); // Remove userId from dependencies since it's hardcoded for now

	const handleTemplateSelection = useCallback(
		async (template) => {
			try {
				if (!template?.category || !template?.product) {
					throw new Error("Invalid template data");
				}

				// Update form data first
				setFormData((prev) => ({
					...prev,
					requestcategory: template.category,
					requestname: template.product,
					quantity: Number.isInteger(template.quantity) ? template.quantity : 1,
					comments: template.comment || "",
					vendortype: template.preferredVendorType || "MSA",
					vendorName: template.preferredVendor || "",
				}));

				// Filter products for the selected category
				FilterProducts(template.category);

				// Handle vendor type
				const vendorTypeDropdown =
					document.getElementById("vendortype")?.ej2_instances?.[0];
				if (vendorTypeDropdown) {
					switch (template.preferredVendorType) {
						case "SSR":
							if (template.preferredVendor) {
								const response = await GetSupplierProductsByProduct(
									template.category,
									template.product,
								);
								const suppliers = response?.data?.filter(
									(s) =>
										s.category === template.category &&
										s.product === template.product,
								);

								if (suppliers?.length > 0) {
									const suppliersList = suppliers.map((s) => s.supplier);
									setMSAVendorOptions(suppliersList);
									vendorTypeDropdown.value = "SSR";

									setTimeout(() => {
										const vendorNameDropdown =
											document.getElementById("vendorName")?.ej2_instances?.[0];
										if (vendorNameDropdown) {
											vendorNameDropdown.value = template.preferredVendor;
										}
									}, 100);
								}
							}
							break;
						case "OPEN":
							vendorTypeDropdown.value = "OPEN";
							break;
						default:
							vendorTypeDropdown.value = "MSA";
					}
				}

				// Update the comments input field directly
				const commentsInput = document.getElementById("comments");
				if (commentsInput) {
					commentsInput.value = template.comment || "";
				}

				setShowTemplateDialog(false);
				await showSuccessDialogWithTimer("Template applied successfully");
			} catch (error) {
				console.error("Error applying template:", error);
				await showErrorDialog(`Failed to apply template: ${error.message}`);
			}
		},
		[FilterProducts],
	);

	const isFormValid = () => {
		return (
			formData.requestcategory &&
			formData.requestname &&
			formData.customername &&
			formData.projectname &&
			formData.rigcompany &&
			formData.vendortype &&
			(formData.vendortype !== "SSR" || formData.vendorName)
		);
	};

	const handleSaveTemplate = async () => {
		try {
			if (!newTemplateName.trim()) {
				throw new Error("Template name is required");
			}

			if (!isFormValid()) {
				throw new Error(
					"Please fill in all required fields before saving the template",
				);
			}

			const existingTemplate = templates.find(
				(t) => t.name.toLowerCase() === newTemplateName.toLowerCase(),
			);

			if (existingTemplate) {
				throw new Error("Template name already exists");
			}

			const templateData = {
				name: newTemplateName,
				description: `${formData.requestcategory} - ${formData.requestname} template`,
				category: formData.requestcategory,
				product: formData.requestname,
				comment: formData.comments,
				quantity: formData.quantity,
				preferredVendorType: formData.vendortype,
				preferredVendor:
					formData.vendortype === "SSR" ? formData.vendorName : null,
				createdBy: userId,
				visibility: templateVisibility,
			};

			const response = await createRequestTemplate(templateData);
			if (!response?.data) {
				throw new Error("Failed to create template");
			}

			setShowSaveTemplateDialog(false);
			setNewTemplateName("");
			setTemplateError("");
			setTemplateVisibility("private");
			await showSuccessDialogWithTimer("Template saved successfully");
			await fetchTemplates();
		} catch (error) {
			console.error("Save template error:", error);
			setTemplateError(error.message);
			await showErrorDialog(error.message);
		}
	};

	// Update the template dialog to ensure it shows templates
	const renderTemplateDialog = () =>
		showTemplateDialog && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg w-96">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">Select Template</h2>
						<button
							type="button"
							className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded"
							onClick={() => setShowTemplateDialog(false)}
						>
							×
						</button>
					</div>
					<div className="mb-4">
						<label
							className="block text-sm font-medium text-gray-700 mb-2"
							htmlFor="templateVisibilityFilter"
						>
							Template Visibility
						</label>
						<select
							id="templateVisibilityFilter"
							className="w-full p-2 border rounded"
							value={templateVisibilityFilter}
							onChange={(e) => setTemplateVisibilityFilter(e.target.value)}
						>
							<option value="all">All Templates</option>
							<option value="private">Private Templates</option>
							<option value="public">Public Templates</option>
						</select>
					</div>
					{isLoadingTemplates ? (
						<div className="text-center">Loading templates...</div>
					) : templateError ? (
						<div className="text-red-500">{templateError}</div>
					) : templates.length === 0 ? (
						<div className="text-center text-gray-600">
							No templates available
						</div>
					) : (
						<div className="max-h-60 overflow-y-auto">
							{templates
								.filter(
									(template) =>
										templateVisibilityFilter === "all" ||
										template.visibility === templateVisibilityFilter,
								)
								.map((template) => (
									<button
										type="button"
										key={template._id}
										className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
										onClick={() => handleTemplateSelection(template)}
									>
										<div className="flex justify-between items-center">
											<div>
												<h3 className="font-bold">{template.name}</h3>
												<p className="text-sm text-gray-600">
													{template.description}
												</p>
											</div>
											<span
												className={`text-xs px-2 py-1 rounded ${
													template.visibility === "public"
														? "bg-green-100 text-green-800"
														: "bg-gray-100 text-gray-800"
												}`}
											>
												{template.visibility === "public"
													? "Public"
													: "Private"}
											</span>
										</div>
									</button>
								))}
						</div>
					)}
				</div>
			</div>
		);

	const renderSaveTemplateDialog = () =>
		showSaveTemplateDialog && (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg w-96">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-bold">Save as Template</h2>
						<button
							type="button"
							className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded"
							onClick={() => setShowSaveTemplateDialog(false)}
						>
							×
						</button>
					</div>
					<input
						type="text"
						className="w-full p-2 border rounded mb-4"
						placeholder="Template Name"
						value={newTemplateName}
						onChange={(e) => setNewTemplateName(e.target.value)}
					/>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Template Visibility
						</label>
						<select
							className="w-full p-2 border rounded"
							value={templateVisibility}
							onChange={(e) => setTemplateVisibility(e.target.value)}
						>
							<option value="private">Private (Only visible to me)</option>
							<option value="public">Public (Visible to all users)</option>
						</select>
					</div>
					{templateError && (
						<div className="text-red-500 mb-4">{templateError}</div>
					)}
					<div className="flex justify-end gap-4">
						<button
							type="button"
							className="bg-gray-500 text-white px-4 py-2 rounded"
							onClick={() => setShowSaveTemplateDialog(false)}
						>
							Cancel
						</button>
						<button
							type="button"
							className={`${
								isFormValid() ? "bg-green-500" : "bg-gray-400"
							} text-white px-4 py-2 rounded`}
							onClick={handleSaveTemplate}
							disabled={!isFormValid()}
						>
							Save
						</button>
					</div>
				</div>
			</div>
		);

	// Load templates on initial render
	useEffect(() => {
		fetchTemplates();
	}, [fetchTemplates]);

	return (
		<div className="flex justify-center items-center bg-white">
			<style>
				{`
					.e-custom {
						width: 100%;
						min-height: 40px;
						background-color: white;
						border: 1px solid #ddd;
						border-radius: 4px;
						padding: 8px;
					}
					.e-custom .e-input {
						height: 100%;
						padding: 8px;
					}
					.e-custom .e-input-group {
						border: none;
					}
					.e-custom .e-input-group-icon {
						background-color: transparent;
					}
					.e-custom .e-input-group-icon.e-ddl-icon {
						background-color: transparent;
					}
					.e-custom .e-input-group-icon.e-ddl-icon:hover {
						background-color: #f5f5f5;
					}
					.e-custom .e-input-group-icon.e-ddl-icon:active {
						background-color: #e0e0e0;
					}
				`}
			</style>
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			{renderTemplateDialog()}
			{renderSaveTemplateDialog()}
			<div className="w-[600px] mx-[4px] space-y-2">
				{/* Template buttons at the top */}
				<div className="flex justify-end gap-2 mb-4">
					<button
						type="button"
						className="bg-green-500 hover:drop-shadow-xl hover:bg-light-gray p-2 rounded-lg items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 font-bold"
						onClick={async () => {
							await fetchTemplates();
							setShowTemplateDialog(true);
						}}
					>
						Load Template
					</button>
					<button
						type="button"
						className="bg-green-500 hover:drop-shadow-xl hover:bg-light-gray p-2 rounded-lg items-center justify-center border-2 border-solid border-black border-r-4 border-b-4 font-bold"
						onClick={() => setShowSaveTemplateDialog(true)}
					>
						Save as Template
					</button>
				</div>

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
							name="requestcategory"
							dataSource={allCategories}
							fields={{ text: "text", value: "value" }}
							value={formData.requestcategory}
							// placeholder="Select Category"
							popupHeight="300px"
							enabled={true}
							onChange={onChange}
							allowFiltering={true}
							filterType="Contains"
							showSelectAll={false}
							showDropDownIcon={true}
							showClearButton={true}
							floatLabelType="Auto"
							cssClass="e-custom"
							index={allCategories.findIndex(
								(cat) => cat.value === formData.requestcategory,
							)}
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
							name="requestname"
							dataSource={filteredProducts}
							fields={{ text: "text", value: "value" }}
							value={formData.requestname}
							placeholder="Select Request"
							popupHeight="300px"
							enabled={true}
							onChange={onChange}
							allowFiltering={true}
							filterType="Contains"
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
							fields={{ text: "text", value: "value" }}
							value={formData.customername}
							placeholder="Select Customer"
							onChange={(args) => {
								onChange(args);
							}}
							cssClass="e-custom"
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
							fields={{ text: "text", value: "value" }}
							value={formData.customercontact}
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
							fields={{ text: "text", value: "value" }}
							value={formData.projectname}
							placeholder="Select Project"
							onChange={(args) => {
								onChange(args);
							}}
							cssClass="e-custom"
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
							fields={{ text: "text", value: "value" }}
							value={formData.rigcompany}
							placeholder="Select Rig Company"
							onChange={(args) => {
								onChange(args);
							}}
							cssClass="e-custom"
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
							fields={{ text: "text", value: "value" }}
							value={formData.rigcompanycontact}
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
							value={formData.creationdate}
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
							value={formData.datetimerequested}
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
							name="quantity"
							value={formData.quantity}
							min={1}
							defaultValue={1}
							placeholder="Enter Quantity"
							showSpinButton={false}
							decimals={2}
							format="n2"
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
							Vendor Type
						</label>
						<DropDownListComponent
							id="vendortype"
							name="vendortype"
							dataSource={vendorTypeOptions}
							value={formData.vendortype}
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
							value={formData.vendorName}
							placeholder="Select Sole Source Vendor"
							required={false}
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
							value={formData.status}
							// placeholder="Select Status"
							required={true}
							onChange={onChange}
							showDropDownIcon={true}
							showClearButton={true}
							floatLabelType="Auto"
							cssClass="e-custom"
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
							value={formData.statusdate}
							placeholder="Select Status Date"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* End of Input Fields */}

				{/* Bottom button container */}
				<div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
					{/* Remove the template buttons from here */}
				</div>
			</div>
		</div>
	);
};

export default RequestEditTemplate;

