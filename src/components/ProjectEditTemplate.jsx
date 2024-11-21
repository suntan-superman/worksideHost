import React, { useRef, useState } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Edit,
	Inject,
} from "@syncfusion/ej2-react-grids";
import { DialogEditEventArgs } from "@syncfusion/ej2-grids";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";

// Sample data for DataGrid
const data = [
	{
		id: 1,
		area: "North",
		projectName: "Project Alpha",
		originator: "John Doe",
		startDate: new Date(2023, 10, 1),
		expectedDuration: 30,
	},
	{
		id: 2,
		area: "South",
		projectName: "Project Beta",
		originator: "Jane Smith",
		startDate: new Date(2023, 11, 15),
		expectedDuration: 45,
	},
];

const areaOptions = ["North", "South", "East", "West"];
const originatorOptions = [
	"John Doe",
	"Jane Smith",
	"Mike Brown",
	"Anna Taylor",
];

const ProjectEditTemplate = (args) => {
	return (
		<div>
			<div className="mb-3">
				<label>Area</label>
				<DropDownListComponent
					id="area"
					dataSource={areaOptions}
					value={args.area}
					placeholder="Select Area"
				/>
			</div>
			<div className="mb-3">
				<label>Project Name</label>
				<input
					type="text"
					id="projectName"
					defaultValue={args.projectName}
					className="e-input"
					placeholder="Enter Project Name"
				/>
			</div>
			<div className="mb-3">
				<label>Originator</label>
				<DropDownListComponent
					id="originator"
					dataSource={originatorOptions}
					value={args.originator}
					placeholder="Select Originator"
				/>
			</div>
			<div className="mb-3">
				<label>Start Date</label>
				<DatePickerComponent
					id="startDate"
					value={args.startDate}
					placeholder="Select Start Date"
				/>
			</div>
			<div className="mb-3">
				<label>Expected Duration (Days)</label>
				<NumericTextBoxComponent
					id="expectedDuration"
					value={args.expectedDuration}
					placeholder="Enter Duration"
				/>
			</div>
		</div>
	);
};

export default ProjectEditTemplate;
