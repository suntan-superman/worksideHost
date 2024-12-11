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

const statusOptions = ["ACTIVE", "INACTIVE"];

// TODO Complete the ProductsEditTemplate component
// "categoryname"
// "productname"
// "description"
// "status"
// "statusdate"

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
		const strAPI = `${process.env.REACT_APP_MONGO_URI}/api/product`;

		try {
			const response = await axios.get(strAPI);
			const products = response.data;
			const cats = [...new Set(products.map((p) => p.categoryname))];
			setAllCategories(cats);
		} catch (error) {
			console.log("error", error);
		}
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
					<div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-900" />
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
							dataSource={statusOptions}
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

