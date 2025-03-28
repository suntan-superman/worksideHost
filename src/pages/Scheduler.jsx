/* eslint-disable */
import React, { useEffect, useState, useRef, useReducer } from "react";
import {
	ScheduleComponent,
	Day,
	Week,
	WorkWeek,
	Month,
	Agenda,
	Inject,
	Resize,
	DragAndDrop,
	ViewsDirective,
} from "@syncfusion/ej2-react-schedule";
import { GetAllProjects } from "../api/worksideAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { showSuccessDialog } from "../utils/useSweetAlert";
import { Header } from "../components";
import { format } from "date-fns";
import { MdFilterList } from "react-icons/md";
import SchedulerFilterDialog from "../components/SchedulerFilterDialog";
import { Box, Chip } from "@mui/material";

// TODO: Implement Scheduler component
// Add Project and Requests to the Scheduler
// Show by Area
// Show by Rig Company
// Show By Rig
// Show Active Projects
// Show Pending Projects
// Show by Project Creator

/**
 * Scheduler component that displays a calendar view of projects with filtering options.
 *
 * This component uses the `react-query` library to fetch project data and the Syncfusion
 * Scheduler component to render the calendar. Users can filter projects by status and company,
 * and the filters are persisted in localStorage.
 *
 * @component
 * @returns {JSX.Element} The Scheduler component.
 *
 * @example
 * <Scheduler />
 *
 * @description
 * - Fetches project data using `useQuery` and formats it for the Scheduler.
 * - Allows filtering of projects by status and company.
 * - Displays a loading spinner while project data is being fetched.
 * - Automatically adjusts the Scheduler height on window resize.
 *
 * @state {Array} projects - The list of all projects.
 * @state {Array} filteredProjects - The list of filtered projects.
 * @state {Array} projectData - The formatted project data for the Scheduler.
 * @state {boolean} showFilter - Whether the filter dialog is visible.
 * @state {Array} selectedStatuses - The selected project statuses for filtering.
 * @state {Array} selectedCompanies - The selected companies for filtering.
 * @state {number} schedulerHeight - The height of the Scheduler component.
 * @state {number} reducerUpdate - A state value to force component updates.
 *
 * @dependencies
 * - `useQuery` from `react-query` for fetching project data.
 * - `ScheduleComponent` from Syncfusion for rendering the calendar.
 * - `localStorage` for persisting filter settings.
 *
 * @functions
 * - `FormatProjectData`: Formats raw project data into a structure suitable for the Scheduler.
 * - `applyCategoryColor`: Applies category colors to events based on their status.
 * - `onEventRendered`: Handles the rendering of events in the Scheduler.
 * - `handleFilterApply`: Applies the selected filters and updates the state.
 * - `handleRemoveFilter`: Removes a specific filter and updates the state.
 *
 * @hooks
 * - `useState` for managing component state.
 * - `useEffect` for handling side effects like window resize and data updates.
 * - `useReducer` for forcing component updates.
 * - `useQueryClient` for managing query cache.
 */
const Scheduler = () => {
	const queryClient = useQueryClient();
	const [projects, setProjects] = useState([]);
	const [filteredProjects, setFilteredProjects] = useState([]);
	const [projectData, setProjectData] = useState([]);
	const scheduleObj = useRef(null);
	const [showFilter, setShowFilter] = useState(false);
	const [selectedStatuses, setSelectedStatuses] = useState(() => {
		const saved = localStorage.getItem("schedulerStatusFilters");
		return saved ? JSON.parse(saved) : [];
	});
	const [selectedCompanies, setSelectedCompanies] = useState(() => {
		const saved = localStorage.getItem("schedulerCompanyFilters");
		return saved ? JSON.parse(saved) : [];
	});

	const refreshFlag = false;

	const [schedulerHeight, setSchedulerHeight] = useState(
		window.innerHeight * 0.7,
	);

	const [reducerUpdate, forceReducerUpdate] = useReducer((x) => x + 1, 0);

	useEffect(() => {
		const handleResize = () => {
			setSchedulerHeight(window.innerHeight * 0.7);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	// Get the project data
	const {
		data: projData,
		isProjectsLoading,
		refetch: refetchProjects,
	} = useQuery({
		queryKey: ["projects"],
		queryFn: () => GetAllProjects(),
		refetchInterval: 1000 * 60,
		refetchOnReconnect: true,
		refetchOnWindowFocus: true,
		staleTime: 1000 * 60 * 10, // 10 minutes+
		retry: 3,
	});

	useEffect(() => {
		if (projData) {
			setProjectData(FormatProjectData(projData.data));
		}
	}, [projData]);

	const FormatProjectData = (projects) => {
		const projectData = [];
		let activityColor = "";
		let projectDetails = "";

		for (const project of projects) {
			if (
				selectedStatuses.length > 0 &&
				!selectedStatuses.includes(project.status)
			) {
				continue;
			}
			if (
				selectedCompanies.length > 0 &&
				!selectedCompanies.includes(project.customer)
			) {
				continue;
			}

			const startDate = new Date(project.projectedstartdate);
			const endDate = new Date(
				new Date(startDate).setDate(
					startDate.getDate() + project.expectedduration,
				),
			).toDateString();

			switch (project.status) {
				case "ACTIVE":
					activityColor = "#16A34A";
					break;
				case "COMPLETED":
					activityColor = "#1F2937";
					break;
				case "CANCELLED":
					activityColor = "#E11D48";
					break;
				case "POSTPONED":
					activityColor = "#94A3B8";
					break;
				default:
					activityColor = "#2563EB";
					break;
			}
			projectDetails = `Project: ${project.projectname}\nStatus: ${project.status}\nStart Date: ${format(startDate, "MMMM do yyyy")}\nEnd Date: ${format(endDate, "MMMM do yyyy")}\nRig Company: ${project.rigcompany}\nDescription: ${project.description}`;

			const data = {
				Id: project._id,
				Subject: project.projectname,
				StartTime: startDate,
				EndTime: endDate,
				IsAllDay: true,
				Description: projectDetails,
				Status: project.status,
				CategoryColor: activityColor,
			};
			projectData.push(data);
		}
		return projectData;
	};

	const eventSettings = {
		dataSource: projectData,
		fields: {
			Id: "Id",
			Subject: { name: "Subject" },
			StartTime: { name: "StartTime" },
			EndTime: { name: "EndTime" },
			CategoryColor: "CategoryColor",
			IsAllDay: true,
			Description: { name: "Description" },
		},
	};

	const applyCategoryColor = (args, currentView) => {
		let displayFlag = false;
		const categoryColor = args.data.CategoryColor;

		if (selectedStatuses.length === 0 && selectedCompanies.length === 0) {
			displayFlag = true;
		} else {
			if (
				selectedStatuses.includes(args.data.Status) ||
				selectedCompanies.includes(args.data.customer)
			) {
				displayFlag = true;
			}
		}

		if (displayFlag === false) {
			args.element.style.display = "none";
			return;
		}

		args.element.style.backgroundColor = categoryColor;
	};

	const onEventRendered = (args) => {
		applyCategoryColor(args, scheduleObj.current?.currentView);
		args.element.setAttribute("aria-readonly", "true");
		args.element.classList.add("e-read-only-cells");
	};

	const handleFilterApply = (filters) => {
		setSelectedStatuses(filters.statuses);
		setSelectedCompanies(filters.companies);
		localStorage.setItem(
			"schedulerStatusFilters",
			JSON.stringify(filters.statuses),
		);
		localStorage.setItem(
			"schedulerCompanyFilters",
			JSON.stringify(filters.companies),
		);
		setShowFilter(false);
	};

	const handleRemoveFilter = (type, value) => {
		if (type === "status") {
			const newStatuses = selectedStatuses.filter((s) => s !== value);
			setSelectedStatuses(newStatuses);
			localStorage.setItem(
				"schedulerStatusFilters",
				JSON.stringify(newStatuses),
			);
		} else {
			const newCompanies = selectedCompanies.filter((c) => c !== value);
			setSelectedCompanies(newCompanies);
			localStorage.setItem(
				"schedulerCompanyFilters",
				JSON.stringify(newCompanies),
			);
		}
	};

	if (isProjectsLoading) {
		return (
			<div className="flex-grow bg-white pl-2 relative h-full">
				<Header category="Workside" title="Scheduler" />
				<div className="absolute top-[50%] left-[50%]">
					<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex-grow bg-white pl-2 relative h-full">
			<Header category="Workside" title="Scheduler" />
			<div className="flex flex-row justify-items-end justify-between gap-5 pr-2 pl-2 pt-1">
				<div className="flex flex-row gap-2">
					<p className="text-black text-sm font-bold">Filter Setting: </p>
					<div className="flex gap-1 flex-wrap">
						{selectedStatuses.map((status) => (
							<Chip
								key={`status-${status}`}
								label={status}
								onDelete={() => handleRemoveFilter("status", status)}
								sx={{ backgroundColor: "green", color: "white" }}
							/>
						))}
						{selectedCompanies.map((company) => (
							<Chip
								key={`company-${company}`}
								label={company}
								onDelete={() => handleRemoveFilter("company", company)}
								sx={{ backgroundColor: "green", color: "white" }}
							/>
						))}
					</div>
				</div>
				<div className="mr-4">
					<button type="button" onClick={() => setShowFilter(true)}>
						<MdFilterList size={20} />
					</button>
				</div>
			</div>
			<ScheduleComponent
				ref={scheduleObj}
				eventRendered={onEventRendered}
				width={"98%"}
				height={schedulerHeight}
				eventSettings={{
					dataSource: projectData,
				}}
				readonly={true}
				currentView="Month"
			>
				<ViewsDirective>
					<Day />
					<Week />
					<WorkWeek />
					<Month />
				</ViewsDirective>
				<Inject
					services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
				/>
			</ScheduleComponent>

			<SchedulerFilterDialog
				open={showFilter}
				onClose={() => setShowFilter(false)}
				onApply={handleFilterApply}
				projectData={projData?.data}
			/>
		</div>
	);
};

export default Scheduler;