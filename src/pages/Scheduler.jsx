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

import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	setRef,
} from "@mui/material";
// import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { red, blue, green, grey, common } from "@mui/material/colors";

import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { MdFilterList } from "react-icons/md";

import { Header } from "../components";
import { format } from "date-fns";

// TODO: Implement Scheduler component
// Add Project and Requests to the Scheduler
// Show by Area
// Show by Rig Company
// Show By Rig
// Show Active Projects
// Show Pending Projects
// Show by Project Creator

const Scheduler = () => {
	const queryClient = useQueryClient();

	const [projects, setProjects] = useState([]);
	const [filteredProjects, setFilteredProjects] = useState([]);
	// const [requests, setRequests] = useState([]);
	const [projectData, setProjectData] = useState([]);
	const scheduleObj = useRef(null);
	const [filterLabel, setFilterLabel] = useState("All");
	const [showDialog, setShowDialog] = useState(false);
	const [showFilter, setShowFilter] = useState(false);

	let refreshFlag = false;

	const [schedulerHeight, setSchedulerHeight] = useState(
		window.innerHeight * 0.7,
	);

	const [reducerUpdate, forceReducerUpdate] = useReducer((x) => x + 1, 0);

	const localFilterData = localStorage.getItem("schedulerFilter");
	const [filterData, setFilterData] = useState(
		localFilterData === null
			? {
					allProjects: true,
					activeProjects: false,
					pendingProjects: false,
					canceledProjects: false,
					postponedProjects: false,
				}
			: JSON.parse(localFilterData),
	);

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

	function filterProjects(filter, projects) {
		console.log("Filter Object: ", filter);
		// If allProjects is true, return the full dataset
		if (filter.allProjects) {
			console.log("Filter Includes All Projects: ", filter.allProjects);
			refreshFlag = true;
			return projects;
		}
		console.log("Filter Includes Active Projects: ", filter.activeProjects);

		// Build an array of statuses to include based on the filter object
		const statusesToInclude = [];
		if (filter.activeProjects) {
			statusesToInclude.push("ACTIVE");
		}
		if (filter.pendingProjects) {
			statusesToInclude.push("PENDING");
		}
		if (filter.canceledProjects) {
			statusesToInclude.push("CANCELED");
		}
		if (filter.postponedProjects) {
			statusesToInclude.push("POSTPONED");
		}
		refreshFlag = true;

		// Filter the projects where the project's status matches one of the statusesToInclude
		return projects.filter((project) =>
			statusesToInclude.includes(project.status),
		);
	}

	function isJsonString(str) {
		try {
			JSON.parse(str);
			return true;
		} catch (e) {
			return false;
		}
	}

	useEffect(() => {
		if (projData) {
			// const filterData = localStorage.getItem("schedulerFilter");
			// if (filterData) {
			// 	setFilterData(JSON.parse(filterData));
			// }

			// if (isJsonString(filterData) === false) {
			// 	return;
			// }
			// refreshFlag = false;
			// const parsedFilterData = JSON.parse(filterData);
			// const filteredProjects = filterProjects(parsedFilterData, projData.data);

			setProjectData(FormatProjectData(projData.data));
		}
	}, [projData]);

	// useEffect(() => {
	// 	if (projData) {
	// 		const filterData = localStorage.getItem("schedulerFilter");
	// 		if (filterData) {
	// 			setFilterData(JSON.parse(filterData));
	// 		}

	// 		if (isJsonString(filterData) === false) {
	// 			return;
	// 		}
	// 		refreshFlag = false;
	// 		const parsedFilterData = JSON.parse(filterData);
	// 		const filteredProjects = filterProjects(parsedFilterData, projData.data);

	// 		setProjectData(FormatProjectData(filteredProjects));
	// 	}
	// }, [projData, refreshFlag]);

	// useEffect(() => {
	// 	// console.log("Reducer Updated");
	// 	queryClient.invalidateQueries({ queryKey: "projects", fetchType: "all" });
	// }, [reducerUpdate]);

	// useEffect(() => {
	// 	localStorage.setItem("schedulerFilter", JSON.stringify(filterData));
	// 	refreshFlag = true;
	// }, [filterData]);

	const FormatProjectData = (projects) => {
		const projectData = [];
		let activityColor = "";
		let projectDetails = "";

		for (const project of projects) {
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
				// Priority: project.priority,
				// Location: project.location,
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

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		await fetchProjects().then(() => {
	// 			fetchRequests();
	// 			setProjectData(FormatProjectData(projects));
	// 		});
	// 	};
	// 	fetchData();
	// }, []);

	const applyCategoryColor = (args, currentView) => {
		// const applyCategoryColor = (args) => {
		let displayFlag = false;
		const categoryColor = args.data.CategoryColor;

		// console.log(
		// 	`Before Display Flag: ${displayFlag} Status: ${args.data.Status}`,
		// );
		if (filterData.allProjects === true) {
			displayFlag = true;
		}
		if (filterData.allProjects === false) {
			if (filterData.activeProjects === true && args.data.Status === "ACTIVE") {
				displayFlag = true;
			} else if (
				filterData.pendingProjects === true &&
				args.data.Status === "PENDING"
			) {
				displayFlag = true;
			} else if (
				filterData.canceledProjects === true &&
				args.data.Status === "CANCELED"
			) {
				displayFlag = true;
			} else if (
				filterData.postponedProjects === true &&
				args.data.Status === "POSTPONED"
			) {
				displayFlag = true;
			} else {
				displayFlag = false;
			}
			// console.log(`After Display Flag: ${displayFlag}`);
			if (displayFlag === false) {
				args.element.style.display = "none";
				return;
			}
		}
		// if (!args.element || !categoryColor) {
		// 	return;
		// }
		// if (currentView === "Agenda") {
		// 	args.element.firstChild.style.borderLeftColor = categoryColor;
		// } else {
		args.element.style.backgroundColor = categoryColor;
		// }
	};

	const onEventRendered = (args) => {
		applyCategoryColor(args, scheduleObj.current?.currentView);
		args.element.setAttribute("aria-readonly", "true");
		args.element.classList.add("e-read-only-cells");
	};

	const dialogSave = () => {
		setShowDialog(false);
	};

	const dialogClose = () => {
		setShowDialog(false);
	};

	const OutputFilterLabel = () => {
		return (
			<div className="flex flow-row">
				{filterData.allProjects && (
					<p className="text-black text-sm font-bold">ALL</p>
				)}
				{filterData.activeProjects && (
					<p className="text-green-500 text-sm font-bold pr-2">Active</p>
				)}
				{filterData.pendingProjects && (
					<p className="text-blue-500 text-sm font-bold pr-2">Pending </p>
				)}
				{filterData.canceledProjects && (
					<p className="text-red-500 text-sm font-bold pr-2">Canceled </p>
				)}
				{filterData.postponedProjects && (
					<p className="text-black text-sm font-bold">Postponed </p>
				)}
			</div>
		);
	};

	if (isProjectsLoading) {
		// if (isProjectsLoading || isRequestsLoading) {
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
					<OutputFilterLabel />
				</div>
				<div className="mr-4">
					<button
						type="button"
						// onClick={() => setShowDialog(!showDialog)}
						onClick={() => showSuccessDialog("Waiting for Implementation...")}
					>
						<MdFilterList size={20} />
					</button>
				</div>
			</div>
			<ScheduleComponent
				// eventSettings={{ eventSettings }}
				ref={scheduleObj}
				eventRendered={onEventRendered}
				width={"98%"}
				height={schedulerHeight}
				eventSettings={{
					dataSource: projectData,
				}}
				// selectedDate={new Date(2023, 6, 15)} // Set default date to July 15, 2023
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
			<div className="items-center">
				{showDialog && (
					<SchedulerFilterModal
						open={showDialog}
						onOK={dialogSave}
						onClose={dialogClose}
						data={filterData}
						onUpdateData={setFilterData}
					/>
				)}
			</div>
		</div>
	);
};

const SchedulerFilterModal = ({ open, onOK, onClose, data, onUpdateData }) => {
	if (!open) return null;

	const [allChecked, setAllChecked] = useState(false);
	const [activeChecked, setActiveChecked] = React.useState(false);
	const [pendingChecked, setPendingChecked] = React.useState(true);
	const [canceledChecked, setCanceledChecked] = React.useState(false);
	const [postponedChecked, setPostponedChecked] = React.useState(false);
	// const [saveButtonDisabled, setSaveButtonDisabled] = React.useState(true);
	const [errorMsg, setErrorMsg] = useState("");

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#schedulerFilterDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	useEffect(() => {
		setAllChecked(data.allProjects);
		setActiveChecked(data.activeProjects);
		setPendingChecked(data.pendingProjects);
		setCanceledChecked(data.canceledProjects);
		setPostponedChecked(data.postponedProjects);
	}, []);

	const handleChange = (event) => {
		const { name, checked } = event.target;
		setErrorMsg("");

		switch (name) {
			case "allChecked":
				setAllChecked(checked);
				if (checked) {
					setActiveChecked(!checked);
					setPendingChecked(!checked);
					setCanceledChecked(!checked);
					setPostponedChecked(!checked);
				}
				break;
			case "activeChecked":
				setActiveChecked(checked);
				break;
			case "pendingChecked":
				setPendingChecked(checked);
				break;
			case "canceledChecked":
				setCanceledChecked(checked);
				break;
			case "postponedChecked":
				setPostponedChecked(checked);
				break;
			default:
				break;
		}
		// window.alert(`Event: ${JSON.stringify(event.target.name)}`);
		// setChecked(event.target.checked);
	};

	const ValidateData = () => {
		setErrorMsg("");

		if (allChecked) return true;
		if (activeChecked) return true;
		if (pendingChecked) return true;
		if (canceledChecked) return true;
		if (postponedChecked) return true;
		return false;
	};

	const onSaveData = () => {
		if (ValidateData() === true) {
			onUpdateData({
				allProjects: allChecked,
				activeProjects: activeChecked,
				pendingProjects: pendingChecked,
				canceledProjects: canceledChecked,
				postponedProjects: postponedChecked,
			});
			setErrorMsg("");
			onOK();
		} else {
			setErrorMsg("Select at least one filter option");
		}
	};

	return (
		<Dialog
			open={open}
			aria-labelledby="schedulerFilterDialog"
			PaperComponent={PaperComponent}
		>
			<DialogTitle id="schedulerFilterDialog">
				<span className="text-bold text-green-300">WORK</span>SIDE Scheduler
				Filter
			</DialogTitle>
			<DialogContent>
				{/* <Stack spacing={2} margin={3}> */}
				<FormGroup>
					{/* <Typography variant="h5">Label All</Typography> */}
					<FormControlLabel
						control={
							<Checkbox
								defaultChecked={data.allChecked}
								checked={allChecked}
								onChange={handleChange}
								name="allChecked"
								sx={{
									color: common.black,
									"&.Mui-checked": {
										color: common.black,
									},
								}}
							/>
						}
						label="All"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={activeChecked}
								onChange={handleChange}
								name="activeChecked"
								disabled={allChecked}
								sx={{
									color: green[800],
									"&.Mui-checked": {
										color: green[600],
									},
								}}
							/>
						}
						label="Active Projects"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={pendingChecked}
								onChange={handleChange}
								name="pendingChecked"
								disabled={allChecked}
								sx={{
									color: blue[800],
									"&.Mui-checked": {
										color: blue[600],
									},
								}}
							/>
						}
						label="Pending Projects"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={canceledChecked}
								onChange={handleChange}
								name="canceledChecked"
								disabled={allChecked}
								sx={{
									color: red[800],
									"&.Mui-checked": {
										color: red[600],
									},
								}}
							/>
						}
						label="Canceled Projects"
					/>
					<FormControlLabel
						control={
							<Checkbox
								checked={postponedChecked}
								onChange={handleChange}
								name="postponedChecked"
								disabled={allChecked}
								sx={{
									color: grey[800],
									"&.Mui-checked": {
										color: grey[600],
									},
								}}
							/>
						}
						label="Postponed Projects"
					/>
				</FormGroup>
				{errorMsg.length > 0 && (
					<div className="text-center">
						<p className="text-red-700 text-xs font-bold pt-2 pb-2">
							{errorMsg}
						</p>
					</div>
				)}
				{/* </Stack> */}
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					color="success"
					onClick={onSaveData}
					// disabled={saveButtonDisabled}
				>
					OK
				</Button>
				<Button variant="contained" color="error" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default Scheduler;