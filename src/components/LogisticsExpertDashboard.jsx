/* eslint-disable */
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	Box,
	Paper,
	Typography,
	Tabs,
	Tab,
	Button,
	CircularProgress,
	useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { format, addDays, parseISO } from "date-fns";
import DeliveryScheduleView from "./DeliveryScheduleView";
import DeliveryAssociateDialog from "./DeliveryAssociateDialog";
import LogisticsExpertDialog from "./LogisticsExpertDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import {
	fetchDeliveryAssignments,
	GetDeliveryAssociates,
} from "../api/worksideAPI";

/**
 * LogisticsExpertDashboard component
 *
 * A comprehensive dashboard for logistics experts to manage delivery schedules,
 * assign delivery associates, and monitor workloads.
 *
 * @component
 * @returns {JSX.Element} The rendered LogisticsExpertDashboard component
 */
const LogisticsExpertDashboard = () => {
	const theme = useTheme();
	const [selectedTab, setSelectedTab] = useState(0);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedAssignment, setSelectedAssignment] = useState(null);
	const [isDADialogOpen, setIsDADialogOpen] = useState(false);
	const [isLogisticsExpertDialogOpen, setIsLogisticsExpertDialogOpen] =
		useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [confirmDialogConfig, setConfirmDialogConfig] = useState({
		title: "",
		message: "",
		onConfirm: null,
	});

	// Fetch delivery assignments for the selected date range
	const { data: assignmentsResponse, isLoading: isLoadingAssignments } =
		useQuery({
			queryKey: ["deliveryAssignments", format(selectedDate, "yyyy-MM-dd")],
			queryFn: () =>
				fetchDeliveryAssignments({
					startDate: format(selectedDate, "yyyy-MM-dd"),
					endDate: format(addDays(selectedDate, 7), "yyyy-MM-dd"),
				}),
		});

	// Extract the actual array of assignments from the response
	const assignments = Array.isArray(assignmentsResponse?.data)
		? assignmentsResponse.data
		: Array.isArray(assignmentsResponse)
			? assignmentsResponse
			: [];

	// Fetch all delivery associates
	const { data: deliveryAssociates, isLoading: isLoadingDAs } = useQuery({
		queryKey: ["deliveryAssociates"],
		queryFn: GetDeliveryAssociates,
	});

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleAssignmentSelect = (assignment) => {
		setSelectedAssignment(assignment);
		setIsDADialogOpen(true);
	};

	const handleLogisticsExpertSelect = (assignment) => {
		setSelectedAssignment(assignment);
		setIsLogisticsExpertDialogOpen(true);
	};

	const handleDAAssignment = async (
		deliveryAssociateId,
		estimatedHours,
		notes,
		timeEstimates,
	) => {
		try {
			// API call to update assignment will be implemented here
			setIsDADialogOpen(false);
			// Show success message
			console.log("Assignment updated:", {
				deliveryAssociateId,
				estimatedHours,
				notes,
				timeEstimates,
			});
		} catch (error) {
			// Show error message
			console.error("Error updating assignment:", error);
		}
	};

	const handleCancelAssignment = (assignment) => {
		setConfirmDialogConfig({
			title: "Cancel Assignment",
			message: "Are you sure you want to cancel this delivery assignment?",
			onConfirm: async () => {
				try {
					// API call to cancel assignment will be implemented here
					setIsConfirmDialogOpen(false);
					// Show success message
				} catch (error) {
					// Show error message
				}
			},
		});
		setIsConfirmDialogOpen(true);
	};

	const handlePostponeAssignment = (assignment) => {
		setConfirmDialogConfig({
			title: "Postpone Assignment",
			message: "Are you sure you want to postpone this delivery assignment?",
			onConfirm: async () => {
				try {
					// API call to postpone assignment will be implemented here
					setIsConfirmDialogOpen(false);
					// Show success message
				} catch (error) {
					// Show error message
				}
			},
		});
		setIsConfirmDialogOpen(true);
	};

	if (isLoadingAssignments || isLoadingDAs) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="400px"
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h4" gutterBottom>
				Logistics Management Dashboard
			</Typography>

			<Paper sx={{ mb: 3 }}>
				<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					indicatorColor="success"
					textColor="success"
					sx={{
						"& .MuiTab-root": {
							color: "text.primary",
							"&.Mui-selected": {
								color: "success.main",
							},
						},
						"& .MuiTabs-indicator": {
							backgroundColor: "success.main",
						},
					}}
				>
					<Tab label="Schedule View" />
					<Tab label="Assignments" />
					<Tab label="Workload Analysis" />
					<Tab label="Logistics Expert" />
				</Tabs>
			</Paper>

			{selectedTab === 0 && (
				<DeliveryScheduleView
					selectedDate={selectedDate}
					onDateChange={handleDateChange}
					onAssignmentSelect={handleAssignmentSelect}
					assignments={assignments}
				/>
			)}

			{selectedTab === 1 && (
				<Grid container spacing={3}>
					{assignments?.map((assignment) => (
						<Grid item xs={12} md={6} lg={4} key={assignment._id}>
							<Paper sx={{ p: 2 }}>
								<Typography variant="h6">{assignment.requestName}</Typography>
								<Typography color="textSecondary">
									Customer: {assignment.customerName}
								</Typography>
								<Typography color="textSecondary">
									Date: {format(parseISO(assignment.deliveryDate), "PPP")}
								</Typography>
								<Typography color="textSecondary">
									DA: {assignment.deliveryAssociateName || "Unassigned"}
								</Typography>
								<Box sx={{ mt: 2 }}>
									<Button
										variant="contained"
										color="success"
										onClick={() => handleAssignmentSelect(assignment)}
										sx={{ mr: 1 }}
									>
										Assign DA
									</Button>
									<Button
										variant="outlined"
										color="error"
										onClick={() => handleCancelAssignment(assignment)}
										sx={{ mr: 1 }}
									>
										Cancel
									</Button>
									<Button
										variant="outlined"
										color="warning"
										onClick={() => handlePostponeAssignment(assignment)}
									>
										Postpone
									</Button>
								</Box>
							</Paper>
						</Grid>
					))}
				</Grid>
			)}

			{selectedTab === 2 && (
				<Box>
					<Typography variant="h6" gutterBottom>
						Workload Analysis
					</Typography>
					{/* Workload analysis visualization will be implemented here */}
				</Box>
			)}

			{selectedTab === 3 && (
				<Box>
					<Typography variant="h6" gutterBottom>
						Logistics Expert View
					</Typography>
					<Grid container spacing={3}>
						{assignments?.map((assignment) => (
							<Grid item xs={12} md={6} lg={4} key={assignment._id}>
								<Paper sx={{ p: 2 }}>
									<Typography variant="h6">{assignment.requestName}</Typography>
									<Typography color="textSecondary">
										Customer: {assignment.customerName}
									</Typography>
									<Typography color="textSecondary">
										Date: {format(parseISO(assignment.deliveryDate), "PPP")}
									</Typography>
									<Typography color="textSecondary">
										Time: {format(parseISO(assignment.deliveryDate), "p")}
									</Typography>
									<Typography color="textSecondary">
										DA: {assignment.deliveryAssociateName || "Unassigned"}
									</Typography>
									<Box sx={{ mt: 2 }}>
										<Button
											variant="contained"
											color="success"
											onClick={() => handleLogisticsExpertSelect(assignment)}
											sx={{ mr: 1 }}
										>
											Advanced Assignment
										</Button>
									</Box>
								</Paper>
							</Grid>
						))}
					</Grid>
				</Box>
			)}

			{selectedAssignment && (
				<>
					<DeliveryAssociateDialog
						open={isDADialogOpen}
						onClose={() => setIsDADialogOpen(false)}
						requestID={selectedAssignment.requestId}
						deliveryDate={selectedAssignment.deliveryDate}
						requestCategory={selectedAssignment.requestCategory}
						onAssign={handleDAAssignment}
					/>

					<LogisticsExpertDialog
						open={isLogisticsExpertDialogOpen}
						onClose={() => setIsLogisticsExpertDialogOpen(false)}
						requestID={selectedAssignment.requestId}
						deliveryDate={selectedAssignment.deliveryDate}
						requestCategory={selectedAssignment.requestCategory}
						onAssign={handleDAAssignment}
						locationData={{
							supplier: { lat: 40.7128, lng: -74.006 }, // Example coordinates
							destination: { lat: 40.7589, lng: -73.9851 }, // Example coordinates
						}}
					/>
				</>
			)}

			<ConfirmationDialog
				open={isConfirmDialogOpen}
				title={confirmDialogConfig.title}
				message={confirmDialogConfig.message}
				onConfirm={confirmDialogConfig.onConfirm}
				onCancel={() => setIsConfirmDialogOpen(false)}
			/>
		</Box>
	);
};

export default LogisticsExpertDashboard; 