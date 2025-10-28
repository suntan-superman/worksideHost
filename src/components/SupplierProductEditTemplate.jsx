/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

const productStatusOptions = ["ACTIVE", "INACTIVE"];

let productOptions = null;

import {
	GetProducts,
	GetAllFirms,
	GetSupplierIDFromName,
	GetAllSuppliers,
} from "../api/worksideAPI";

// TODO Complete the SupplierProductEditTemplate component

/**
 * SupplierProductEditTemplate component is used to manage the editing of supplier products.
 * It provides a form interface for selecting suppliers, categories, products, and updating their statuses.
 * The component dynamically filters products based on the selected category and handles read-only states
 * for existing data entries.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isAdd - Determines if the form is in "add" mode or "edit" mode.
 * @param {string} props.supplier - The selected supplier name.
 * @param {string} props.category - The selected category name.
 * @param {string} props.product - The selected product name.
 * @param {string} props.status - The current status of the product.
 * @param {Date} props.statusdate - The date associated with the current status.
 *
 * @returns {JSX.Element} The rendered SupplierProductEditTemplate component.
 *
 * @example
 * <SupplierProductEditTemplate
 *   isAdd={true}
 *   supplier="Supplier A"
 *   category="Category 1"
 *   product="Product X"
 *   status="ACTIVE"
 *   statusdate={new Date()}
 * />
 */
const SupplierProductEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	// const [productOptions, setProductOptions] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [currentCategory, setCurrentCategory] = useState("");
	const [duplicateError, setDuplicateError] = useState("");

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

	const FilterProducts = (selectedItem) => {
		if (productOptions !== null && productOptions.length > 0) {
			const products = productOptions.filter(
				(p) => p.categoryname === selectedItem,
			);
			const productList = [...new Set(products.map((p) => p.productname))];
			setFilteredProducts(productList);
		}
	};

	// Add function to get supplier ID
	const getSupplierId = async (supplierName) => {
		console.log("Getting supplier ID for:", supplierName);
		try {
			const response = await GetAllSuppliers();
			console.log("All suppliers response:", response);
			if (response.status === 200 && response.data) {
				const supplier = response.data.find((s) => s.name === supplierName);
				if (supplier) {
					console.log("Found supplier:", supplier);
					return supplier._id;
				}
			}
			console.log("No supplier ID found");
			return null;
		} catch (error) {
			console.error("Error getting supplier ID:", error);
			return null;
		}
	};

	// Handle input changes
	const checkForDuplicate = async (supplier, category, product) => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/supplierproduct/check-duplicate`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						supplier,
						categoryname: category,
						productname: product,
					}),
				},
			);
			const data = await response.json();
			return data.exists;
		} catch (error) {
			console.error("Error checking for duplicate:", error);
			return false;
		}
	};

	const onChange = async (args) => {
		console.log("SupplierProductEditTemplate - onChange called with:", args);
		const newData = { ...data };

		// Handle different types of input changes
		if (args.target) {
			// Regular input change
			newData[args.target.name] = args.target.value;
			console.log(
				"Updated field:",
				args.target.name,
				"with value:",
				args.target.value,
			);
		} else if (args.element) {
			// Syncfusion component change
			const fieldName = args.element.id;
			newData[fieldName] = args.value;
			console.log("Updated field:", fieldName, "with value:", args.value);
		}

		setData(newData);

		if (args.target?.name === "category") {
			setCurrentCategory(args.target.value);
			FilterProducts(args.target.value);
		}

		// Check for duplicate if all three fields are present
		if (newData.supplier && newData.category && newData.product) {
			const isDuplicate = await checkForDuplicate(
				newData.supplier,
				newData.category,
				newData.product,
			);
			if (isDuplicate) {
				setDuplicateError(
					"This combination of supplier, category, and product already exists.",
				);
			} else {
				setDuplicateError("");
			}
		} else {
			setDuplicateError("");
		}

		// Pass the updated data to the parent component
		if (props.onChange) {
			console.log(
				"SupplierProductEditTemplate - Sending data to parent:",
				newData,
			);
			props.onChange(newData);
		}
	};

	const [isLoading, setIsLoading] = useState(false);

	const fetchSupplierOptions = async () => {
		setIsLoading(true);
		await GetAllFirms().then((response) => {
			const jsonData = response?.data;
			if (jsonData === undefined) {
				setIsLoading(false);
				return;
			}
			// Get Suppliers
			const supplierResult = jsonData.filter(
				(json) => json.type === "SUPPLIER",
			);
			// Extract names into an array
			const suppliers = supplierResult.map((r) => r.name);
			setSupplierOptions(suppliers);
			fetchProducts();
		});
		setIsLoading(false);
	};

	const GetFilteredProducts = (args) => {
		const products = productOptions.filter(
			(p) => p.categoryname === args.itemData,
		);
		const productList = [...new Set(products.map((p) => p.productname))];
		setFilteredProducts(productList);
	};

	const SetFilteredProducts = (category) => {
		const products = productOptions.filter((p) => p.categoryname === category);
		// console.log(`Category: ${category} Products: ${JSON.stringify(products)}`);
		const productList = [...new Set(products.map((p) => p.productname))];
		// console.log(`Product List: ${JSON.stringify(productList)}`);
		setFilteredProducts(productList);
	};

	const getUniqueProductNames = (categoryName) => {
		// console.log(
		// 	`New Filtered Products Category: ${categoryName} ${JSON.stringify(productOptions)}`,
		// );

		const filteredProducts = productOptions
			.filter((item) => item.categoryname === categoryName) // Filter by category
			.map((item) => item.productname); // Extract product names
		// console.log(
		// 	`New Filtered Products Function: ${JSON.stringify(filteredProducts)}`,
		// );
		return [...new Set(filteredProducts)]; // Remove duplicates using Set
	};

	const fetchProducts = async () => {
		await GetProducts().then((response) => {
			productOptions = response.data;
			const cats = [...new Set(response.data.map((p) => p.categoryname))];
			setCategoryOptions(cats);
			if (data.isAdd === false) {
				const filteredProducts = getUniqueProductNames(data.category);
				setFilteredProducts(filteredProducts);
			}
		});
	};

	useEffect(() => {
		FilterProducts(currentCategory);
	}, [currentCategory]);

	useEffect(() => {
		fetchSupplierOptions();
		fetchProducts();
	}, []);

	return (
		<div className="flex justify-center items-center bg-white">
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500" />
				</div>
			)}
			<div className="w-[600px] mx-[4px] space-y-2">
				{duplicateError && (
					<div className="text-red-500 text-sm mb-2">{duplicateError}</div>
				)}
				{/* Row 1 */}
				<div className="flex gap-4">
					{/* Input 1 */}
					<div className="flex flex-col w-full">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
						>
							Supplier
						</label>
						<DropDownListComponent
							id="supplier"
							dataSource={supplierOptions}
							name="supplier"
							value={data.supplier}
							placeholder="Select Supplier"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
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
							Category
						</label>
						<DropDownListComponent
							id="category"
							// dataSource={categoryOptions}
							dataSource={categoryOptions}
							name="category"
							value={data.category}
							placeholder="Select Category"
							required={true}
							onChange={onChange}
							// onSelect={GetFilteredProducts}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 3 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field3"
						>
							Product/Service
						</label>
						<DropDownListComponent
							id="product"
							dataSource={filteredProducts}
							name="product"
							value={data.product}
							placeholder="Select Product/Service"
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
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							Project Status
						</label>
						<DropDownListComponent
							id="status"
							name="status"
							dataSource={productStatusOptions}
							value={data.status}
							placeholder="Select Status"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 5 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field5">
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

export default SupplierProductEditTemplate;

