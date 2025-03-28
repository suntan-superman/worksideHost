/* eslint-disable */

import React, { useEffect, useState } from "react";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../styles/material.css";

// Set Selection Options
// Need To Determine These Options
const categoryOptions = [
	"Frac Services",
	"Cementing",
	"Drilling Tools Rental",
	"Inspection and Testing",
	"Containments",
	"Mud Management",
	"Generators, Engines",
	"Fluid Storage",
	"Rig Mats",
	"Rig Walking Systems",
	"Rig Moving",
	"Rig Cleaning",
	"Rig Maintenance",
	"Rig Decommissioning",
	"Rig Commissioning",
	"Rig Construction",
	"Rig Upgrades",
	"Rig Refurbishment",
	"Rig Inspection",
	"Rig Certification",
];

import { productStatusOptions } from "../data/worksideOptions";

import { GetProducts } from "../api/worksideAPI";

// TODO Complete the ProductsEditTemplate component
// "categoryname"
// "productname"
// "description"
// "status"
// "statusdate"

/**
 * ProductsEditTemplate is a React functional component used for editing or adding product details.
 * It provides a form interface with fields for category name, product/service name, description,
 * status, and status date. The component supports both read-only and editable modes based on the
 * `isAdd` property in the `props`.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.isAdd - Determines if the form is in "add" mode or "edit" mode.
 * @param {string} [props.categoryname] - The initial category name of the product.
 * @param {string} [props.productname] - The initial name of the product or service.
 * @param {string} [props.description] - The initial description of the product or service.
 * @param {string} [props.status] - The initial status of the product or service.
 * @param {Date} [props.statusdate] - The initial status date of the product or service.
 *
 * @returns {JSX.Element} A form interface for editing or adding product details.
 *
 * @example
 * <ProductsEditTemplate
 *   isAdd={true}
 *   categoryname="Electronics"
 *   productname="Smartphone"
 *   description="A high-end smartphone"
 *   status="ACTIVE"
 *   statusdate={new Date()}
 * />
 */
const ProductsEditTemplate = (props) => {
	const [data, setData] = useState({ ...props });
	const [readOnlyFlag, setReadOnlyFlag] = useState(false);
	const [allCategories, setAllCategories] = useState([]);

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

	// Handle input changes
	const onChange = (args) => {
		setData({ ...data, [args.target.name]: args.target.value });
	};

	const [isLoading, setIsLoading] = useState(false);

	const fetchOptions = async () => {
		setIsLoading(true);
		if (data.isAdd) {
			data.status = "ACTIVE";
			data.statusdate = new Date();
		}
		setIsLoading(false);
	};

	const fetchCategories = async () => {
		await GetProducts().then((response) => {
			const products = response?.data;
			if (products === undefined) return;
			const cats = [...new Set(products.map((p) => p.categoryname))];
			setAllCategories(cats);
		});
	};

	useEffect(() => {
		// Get Customer and Rig Company Options from Firm Collection
		fetchOptions();
		fetchCategories();
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
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field1"
						>
							Category Name
						</label>
						<DropDownListComponent
							id="categoryname"
							dataSource={allCategories}
							name="categoryname"
							value={data.categoryname}
							placeholder="Select Category"
							required={true}
							onChange={onChange}
							readonly={readOnlyFlag}
						/>
					</div>
					{/* Input 2 */}
					<div className="flex flex-col w-1/2">
						<label
							className={`${readOnlyFlag ? "text-red-500" : "text-black"} text-sm font-medium mb-1`}
							htmlFor="field2"
						>
							Product/Service
						</label>
						<input
							type="text"
							id="productname"
							name="productname"
							defaultValue={data.productname}
							className="e-input"
							placeholder="Enter Product/Service"
							required={true}
							onChange={onChange}
							disabled={readOnlyFlag}
							// readonly={readOnlyFlag}
						/>
					</div>
				</div>
				{/* Row 2 */}
				<div className="flex gap-4">
					{/* Input 3 */}
					<div className="flex flex-col w-full">
						<label
							className={"text-black text-sm font-medium mb-1"}
							htmlFor="field3"
						>
							Description
						</label>
						<input
							type="text"
							id="description"
							name="description"
							defaultValue={data.description}
							className="e-input"
							placeholder="Enter Description"
							required={true}
							onChange={onChange}
						/>
					</div>
				</div>
				{/* Row 3 */}
				<div className="flex gap-4">
					{/* Input 5 */}
					<div className="flex flex-col w-1/2">
						<label className="text-sm font-medium mb-1" htmlFor="field4">
							Product/Service Status
						</label>
						<DropDownListComponent
							id="status"
							name="status"
							dataSource={productStatusOptions}
							value={data.status}
							placeholder="Select Product Status"
							required={true}
							onChange={onChange}
						/>
					</div>
					{/* Input 6 */}
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

export default ProductsEditTemplate;

