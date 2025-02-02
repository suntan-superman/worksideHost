/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

const productStatusOptions = ["ACTIVE", "INACTIVE"];

let productOptions = null;

import { GetProducts, GetAllFirms } from "../api/worksideAPI";

// TODO Complete the SupplierProductEditTemplate component

const SupplierProductEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	// const [productOptions, setProductOptions] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [currentCategory, setCurrentCategory] = useState("");

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

	// Handle input changes
	const onChange = (args) => {
		// Only for debugging purposes
		setData({ ...data, [args.target.name]: args.target.value });
		if (args.target.name === "category") {
			setCurrentCategory(args.target.value);
			FilterProducts(args.target.value);
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
				// window.alert(`Edit Mode: ${data.category} Product: ${data.product}`);
				const filteredProducts = getUniqueProductNames(data.category);
				// window.alert(`New Filtered Products: ${filteredProducts}`);
				setFilteredProducts(filteredProducts);
				// SetFilteredProducts(data.category);
			}
		});
		// const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/product`);
		// const json = await response.json();
		// // setProductOptions(json);
		// productOptions = json;
		// // console.log(`Product Options: ${JSON.stringify(json)}`);
		// const cats = [...new Set(json.map((p) => p.categoryname))];
		// setCategoryOptions(cats);
		// if (data.isAdd === false) {
		// 	// window.alert(`Edit Mode: ${data.category} Product: ${data.product}`);
		// 	const filteredProducts = getUniqueProductNames(data.category);
		// 	// window.alert(`New Filtered Products: ${filteredProducts}`);
		// 	setFilteredProducts(filteredProducts);
		// 	// SetFilteredProducts(data.category);
		// }
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

