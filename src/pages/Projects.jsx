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

/**
 * The `Projects` component renders a page with a header and tabbed content
 * based on the user's access level. It displays different tabs and content
 * depending on whether the user's access level is greater than 2 or not.
 *
 * @component
 * @returns {JSX.Element} The rendered Projects page.
 *
 * @description
 * - Uses `useState` to manage loading state and access level.
 * - Uses `useEffect` to retrieve and set the user's access level and grid row settings from localStorage.
 * - Displays a loading spinner when `isLoading` is true.
 * - Renders different tabbed content based on the `accessLevel`:
 *   - Access level > 2: Displays tabs for Projects, Requestors, and Documents.
 *   - Access level <= 2: Displays only the Projects tab.
 *
 * @example
 * // Example usage:
 * <Projects />
 */
const Projects = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [accessLevel, setAccessLevel] = useState(-1);

	useEffect(() => {
		const numGridRows = Number(localStorage.getItem("numGridRows"));
		if (numGridRows) gridPageSize = numGridRows;
		const value = Number(localStorage.getItem("accessLevel"));
		if (value) {
			setAccessLevel(value);
		}
	}, []);

	return (
		<div>
			<Header category="Workside" title="Projects" />
			{isLoading && (
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
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
