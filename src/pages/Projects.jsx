/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import {
	GridComponent,
	ColumnsDirective,
	ColumnDirective,
	Selection,
	Edit,
	Filter,
	Inject,
	Page,
	Toolbar,
	Resize,
	Freeze,
} from "@syncfusion/ej2-react-grids";
import { toast } from "react-toastify";
import { TabComponent } from "@syncfusion/ej2-react-navigations";
import ProjectsTab from "./ProjectsTab";
import ProjectRequestorsTab from "./ProjectRequestorsTab";

import { Header } from "../components";
import "../index.css";
import "../App.css";

const gridPageSize = 8;

const Projects = () => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div>
			<Header category="Workside" title="Projects" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			<TabComponent cssClass="e-fill" headerPlacement="Top">
				{/* <TabItemsDirective> */}
				<div className="e-tab-header">
					<div className="text-xs font-bold">Projects</div>
					<div className="text-xs font-bold">Requestors</div>
				</div>
				<div className="e-content">
					{/* Projects Tab */}
					<div className="absolute top-[10px] left-[10px] w-[100%] flex flex-row items-center justify-start">
						<ProjectsTab />
					</div>
					{/* Project Requestors Tab */}
					<div className="absolute top-[10px] left-[10px] w-[100%] flex flex-row items-center justify-start">
						<ProjectRequestorsTab />
					</div>
				</div>
			</TabComponent>
		</div>
	);
};

export default Projects;
