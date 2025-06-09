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
import RouteDesigner from "./route-designer/RouteDesigner";
import { RouteProvider } from "./route-designer/RouteContext";
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
	const [isRouteDesignerFullscreen, setIsRouteDesignerFullscreen] = useState(false);

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

	// Helper functions for workload analysis
	const calculateTotalHours = (deliveryAssociateId) => {
		// Calculate total hours for this delivery associate
		const associateAssignments = assignments.filter(
			assignment => assignment.deliveryAssociateId === deliveryAssociateId
		);
		return associateAssignments.reduce((total, assignment) => {
			return total + (assignment.estimatedHours || 0);
		}, 0);
	};

	const calculateAssignmentCount = (deliveryAssociateId) => {
		// Count assignments for this delivery associate
		return assignments.filter(
			assignment => assignment.deliveryAssociateId === deliveryAssociateId
		).length;
	};

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

	const renderEmptyState = (tab) => {
		const emptyStateStyles = {
			textAlign: "center",
			padding: "2rem",
			backgroundColor: "background.paper",
			borderRadius: 1,
			boxShadow: 1,
		};

		switch (tab) {
			case 0: // Schedule View
				return (
					<Box sx={emptyStateStyles}>
						<Typography variant="h6" gutterBottom color="text.secondary">
							No Delivery Schedule Found
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							The Schedule View provides a calendar overview of all delivery
							assignments. Here you can:
						</Typography>
						<Box
							sx={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
						>
							<Typography component="ul" color="text.secondary">
								<li>View all delivery requests in a calendar format</li>
								<li>Track delivery status and progress</li>
								<li>Monitor delivery associate availability</li>
								<li>Identify scheduling conflicts</li>
								<li>Plan and optimize delivery routes</li>
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							New delivery schedules will appear here once they are created in
							the system.
						</Typography>
					</Box>
				);
			case 1: // Assignments
				return (
					<Box sx={emptyStateStyles}>
						<Typography variant="h6" gutterBottom color="text.secondary">
							No Delivery Assignments Found
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							The Assignments view is your central hub for managing delivery
							schedules. Here you can:
						</Typography>
						<Box
							sx={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
						>
							<Typography component="ul" color="text.secondary">
								<li>View and manage all delivery requests</li>
								<li>Assign delivery associates to specific requests</li>
								<li>Track estimated hours and travel times</li>
								<li>
									Monitor delivery status (pending, in progress, completed)
								</li>
								<li>Quickly identify and resolve scheduling conflicts</li>
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							New assignments will appear here once they are created in the
							system.
						</Typography>
					</Box>
				);
			case 2: // Workload Analysis
				return (
					<Box sx={emptyStateStyles}>
						<Typography variant="h6" gutterBottom color="text.secondary">
							No Workload Data Available
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							The Workload Analysis view helps you optimize delivery associate
							schedules and workloads. Here you can:
						</Typography>
						<Box
							sx={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
						>
							<Typography component="ul" color="text.secondary">
								<li>View total hours assigned to each delivery associate</li>
								<li>Analyze the number of assignments per associate</li>
								<li>Monitor travel times and wait times</li>
								<li>Identify and prevent workload conflicts</li>
								<li>Balance workloads across the delivery team</li>
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							Workload data will be displayed here once assignments are created
							and delivery associates are assigned.
						</Typography>
					</Box>
				);
			case 3: // Logistics Expert
				return (
					<Box sx={emptyStateStyles}>
						<Typography variant="h6" gutterBottom color="text.secondary">
							No Logistics Expert Assignments
						</Typography>
						<Typography variant="body1" color="text.secondary" paragraph>
							The Logistics Expert view provides advanced assignment management
							capabilities. Here you can:
						</Typography>
						<Box
							sx={{ textAlign: "left", maxWidth: "600px", margin: "0 auto" }}
						>
							<Typography component="ul" color="text.secondary">
								<li>
									Make sophisticated assignments with detailed time estimates
								</li>
								<li>Set specific arrival and departure times for deliveries</li>
								<li>
									Add detailed notes and instructions for complex deliveries
								</li>
								<li>Manage multiple stops and optimize routes</li>
								<li>Handle special delivery requirements and constraints</li>
							</Typography>
						</Box>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
							Advanced assignments will appear here once they are created using
							the Logistics Expert features.
						</Typography>
					</Box>
				);
			default:
				return null;
		}
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
					<Tab label="Route Optimizer" />
				</Tabs>
			</Paper>

			{isLoadingAssignments || isLoadingDAs ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress color="success" />
				</Box>
			) : (
				<>
					{selectedTab === 0 && (
						<>
							<DeliveryScheduleView
								selectedDate={selectedDate}
								onDateChange={handleDateChange}
								assignments={assignments}
								deliveryAssociates={deliveryAssociates?.data || []}
								onAssignmentSelect={handleAssignmentSelect}
								onLogisticsExpertSelect={handleLogisticsExpertSelect}
							/>
							{(!assignments || assignments.length === 0) &&
								renderEmptyState(0)}
						</>
					)}
					{selectedTab === 1 && (
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Delivery Assignments
							</Typography>
							{!assignments || assignments.length === 0 ? (
								renderEmptyState(1)
							) : (
								<Grid container spacing={2}>
									{assignments.map((assignment) => (
										<Grid item xs={12} sm={6} md={4} key={assignment._id}>
											<Paper sx={{ p: 2 }}>
												<Typography variant="subtitle1">
													Request ID: {assignment.requestID}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Category: {assignment.requestCategory}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Status: {assignment.status}
												</Typography>
												<Button
													variant="contained"
													color="success"
													size="small"
													onClick={() => handleAssignmentSelect(assignment)}
													sx={{ mt: 1 }}
												>
													Assign DA
												</Button>
											</Paper>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					)}
					{selectedTab === 2 && (
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Delivery Associate Workloads
							</Typography>
							{!assignments || assignments.length === 0 ? (
								renderEmptyState(2)
							) : (
								<Grid container spacing={2}>
									{(deliveryAssociates?.data || []).map((da) => (
										<Grid item xs={12} sm={6} md={4} key={da._id}>
											<Paper sx={{ p: 2 }}>
												<Typography variant="subtitle1">{da.name}</Typography>
												<Typography variant="body2" color="text.secondary">
													Total Hours: {calculateTotalHours(da._id)}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Assignments: {calculateAssignmentCount(da._id)}
												</Typography>
											</Paper>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					)}
					{selectedTab === 3 && (
						<Box sx={{ mb: 2 }}>
							<Typography variant="h6" gutterBottom>
								Logistics Expert Assignments
							</Typography>
							{!assignments || assignments.length === 0 ? (
								renderEmptyState(3)
							) : (
								<Grid container spacing={2}>
									{assignments.map((assignment) => (
										<Grid item xs={12} sm={6} md={4} key={assignment._id}>
											<Paper sx={{ p: 2 }}>
												<Typography variant="subtitle1">
													Request ID: {assignment.requestID}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Category: {assignment.requestCategory}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Status: {assignment.status}
												</Typography>
												<Button
													variant="contained"
													color="success"
													size="small"
													onClick={() =>
														handleLogisticsExpertSelect(assignment)
													}
													sx={{ mt: 1 }}
												>
													Advanced Assignment
												</Button>
											</Paper>
										</Grid>
									))}
								</Grid>
							)}
						</Box>
					)}
					{selectedTab === 4 && !isRouteDesignerFullscreen && (
						<Box sx={{ mb: 2 }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
								<Typography variant="h6">
									Route Optimizer
								</Typography>
								<Button
									variant="contained"
									color="primary"
									onClick={() => setIsRouteDesignerFullscreen(true)}
									sx={{ 
										bgcolor: 'success.main',
										'&:hover': { bgcolor: 'success.dark' }
									}}
								>
									🔍 Fullscreen View
								</Button>
							</Box>
							<RouteProvider>
								<Box 
									sx={{ 
										height: 'calc(100vh - 300px)',
										border: '1px solid #ddd',
										borderRadius: 1,
										overflow: 'hidden',
										position: 'relative'
									}}
								>
									<RouteDesigner />
								</Box>
							</RouteProvider>
						</Box>
					)}
				</>
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

			{/* Fullscreen Route Designer Overlay */}
			{isRouteDesignerFullscreen && (
				<Box
					sx={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						zIndex: 9999,
						bgcolor: 'background.default'
					}}
				>
					{/* Fullscreen Header with Exit Button */}
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							zIndex: 10000,
							bgcolor: 'white',
							borderBottom: '1px solid #ddd',
							px: 3,
							py: 2,
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							boxShadow: 1
						}}
					>
						<Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
							Route Optimizer - Fullscreen Mode
						</Typography>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => setIsRouteDesignerFullscreen(false)}
							sx={{ 
								bgcolor: 'error.main',
								'&:hover': { bgcolor: 'error.dark' }
							}}
						>
							✕ Exit Fullscreen
						</Button>
					</Box>

					{/* Fullscreen Route Designer */}
					<Box sx={{ pt: '64px', height: '100vh' }}>
						<RouteProvider>
							<Box sx={{ height: 'calc(100vh - 64px)' }}>
								<RouteDesigner />
							</Box>
						</RouteProvider>
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default LogisticsExpertDashboard; 