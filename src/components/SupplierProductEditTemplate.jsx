/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

const statusOptions = ["ACTIVE", "INACTIVE"];

// TODO Complete the SupplierProductEditTemplate component

const SupplierProductEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [productOptions, setProductOptions] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [currentCategory, setCurrentCategory] = useState("");

	useEffect(() => {
		// ReadOnly flag
		if (data.isAdd) {
			setReadOnlyFlag(false);
		} else {
			setReadOnlyFlag(true);
		}
	}, [data.isAdd]);

	const FilterProducts = (selectedItem) => {
		const products = productOptions.filter(
			(p) => p.categoryname === selectedItem,
		);
		const productList = [...new Set(products.map((p) => p.productname))];
		setFilteredProducts(productList);
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
		const response = await fetch(`${process.env.REACT_APP_MONGO_URI}/api/firm`);
		const json = await response.json();
		// Get Customers
		const supplierResult = json.filter((json) => json.type === "SUPPLIER");
		// Extract names into an array
		const suppliers = supplierResult.map((r) => r.name);
		setSupplierOptions(suppliers);
		fetchProducts();
		setIsLoading(false);
	};

	const GetFilteredProducts = (args) => {
		const products = productOptions.filter(
			(p) => p.categoryname === args.itemData,
		);
		const productList = [...new Set(products.map((p) => p.productname))];
		setFilteredProducts(productList);
	};

	const fetchProducts = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_MONGO_URI}/api/product`,
		);
		const json = await response.json();
		setProductOptions(json);
		const cats = [...new Set(json.map((p) => p.categoryname))];
		setCategoryOptions(cats);
	};

	useEffect(() => {
		FilterProducts(currentCategory);
	}, [currentCategory]);

	useEffect(() => {
		// Get Customer and Rig Company Options from Firm Collection
		fetchSupplierOptions();
		fetchProducts();
	}, []);

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
							dataSource={statusOptions}
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

