/* eslint-disable */
import React, { useState, useEffect } from "react";
import { TabComponent } from "@syncfusion/ej2-react-navigations";
import ProjectsTab from "./ProjectsTab";
import ProjectRequestorsTab from "./ProjectRequestorsTab";
import ProjectDocumentsTab from "./ProjectDocumentsTab";

import { Header } from "../components";
import "../index.css";
import "../App.css";

let gridPageSize = 8;

const Projects = () => {
	const [isLoading, setIsLoading] = useState(false);
  let accessLevel = 0; 

	
	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
		const value = localStorage.getItem("accessLevel");
		if (value) {
			accessLevel = value;
		}
	}, []);

	return (
		<div>
			<Header category="Workside" title="Projects" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-900" />
				</div>
			)}
			{accessLevel > 2 && (
				<div className="ml-2.5">
					<TabComponent cssClass="e-fill" headerPlacement="Top">
						{/* <TabItemsDirective> */}
						<div className="e-tab-header">
							<div className="text-xs font-bold">Projects</div>
							<div className="text-xs font-bold">Requestors</div>
							<div className="text-xs font-bold">Documents</div>
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
							{/* Project Documents Tab */}
							<div className="absolute top-[10px] left-[10px] w-[100%] flex flex-row items-center justify-start">
								<ProjectDocumentsTab />
							</div>
						</div>
					</TabComponent>
				</div>
			)}
			{accessLevel <= 2 && (
				<div className="ml-2.5">
					<TabComponent cssClass="e-fill" headerPlacement="Top">
						{/* <TabItemsDirective> */}
						<div className="e-tab-header">
							<div className="text-xs font-bold">Projects</div>
						</div>
						<div className="e-content">
							{/* Projects Tab */}
							<div className="absolute top-[10px] left-[10px] w-[100%] flex flex-row items-center justify-start">
								<ProjectsTab />
							</div>
						</div>
					</TabComponent>
				</div>
			)}
		</div>
	);
};

export default Projects;
