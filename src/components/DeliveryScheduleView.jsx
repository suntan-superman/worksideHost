/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Box,
	Paper,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	IconButton,
	Tooltip,
	Divider,
	Alert,
} from "@mui/material";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { GetDeliveryAssociates } from "../api/worksideAPI";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import "../styles/datepicker.css";

/**
 * DeliveryScheduleView Component
 *
 * This component displays a calendar view of delivery assignments, allowing users to:
 * - View assignments by date range
 * - Filter by request type and delivery associate
 * - Visualize workload distribution
 * - See estimated delivery times
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.supplierId - The ID of the supplier to fetch delivery associates for
 * @param {Function} props.onAssignmentClick - Callback when an assignment is clicked
 *
 * @returns {JSX.Element} The rendered component
 */
const DeliveryScheduleView = ({ supplierId, onAssignmentClick }) => {
	// State for filters
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(addDays(new Date(), 7));
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedDA, setSelectedDA] = useState("all");
	const [requestCategories, setRequestCategories] = useState([]);
	const [categories, setCategories] = useState([]);
	const [scheduleData, setScheduleData] = useState([]);

	// Fetch delivery associates
	const { data: deliveryAssociatesResponse, isLoading: isLoadingDAs } =
		useQuery({
			queryKey: ["deliveryAssociates", supplierId],
			queryFn: () => GetDeliveryAssociates(supplierId),
			enabled: !!supplierId,
		});

	// Extract the actual array of delivery associates from the response
	const deliveryAssociates = deliveryAssociatesResponse?.data || [];

	// Fetch request categories
	const { data: productsData } = useQuery({
		queryKey: ["products"],
		queryFn: async () => {
			const response = await axios.get(
				`${process.env.REACT_APP_MONGO_URI}/api/products`,
			);
			return response.data;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Fetch delivery assignments
	const { data: assignmentsData, isLoading } = useQuery({
		queryKey: [
			"delivery-assignments",
			startDate,
			endDate,
			selectedCategory,
			selectedDA,
		],
		queryFn: async () => {
			const response = await axios.get(
				`${process.env.REACT_APP_MONGO_URI}/api/delivery-assignments`,
				{
					params: {
						startDate: format(startDate, "yyyy-MM-dd"),
						endDate: format(endDate, "yyyy-MM-dd"),
						category: selectedCategory !== "all" ? selectedCategory : undefined,
						deliveryAssociateId: selectedDA !== "all" ? selectedDA : undefined,
					},
				},
			);
			return response.data;
		},
		enabled: !!startDate && !!endDate,
		staleTime: 1 * 60 * 1000, // 1 minute
	});

	// Process data when it's loaded
	useEffect(() => {
		if (productsData?.data) {
			const uniqueCategories = [
				...new Set(productsData.data.map((product) => product.categoryname)),
			];
			setCategories(uniqueCategories);
		}
	}, [productsData]);

	useEffect(() => {
		if (assignmentsData?.data) {
			setScheduleData(assignmentsData.data);
		}
	}, [assignmentsData]);

	// Fetch request categories (this would come from your API)
	useEffect(() => {
		// This is a placeholder - replace with actual API call
		const categories = [
			"Equipment",
			"Personnel",
			"Material",
			"Service",
			"Other",
		];
		setRequestCategories(categories);
	}, []);

	// Generate date range for the schedule view
	const dateRange = [];
	let currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		dateRange.push(new Date(currentDate));
		currentDate = addDays(currentDate, 1);
	}

	// Calculate workload for each delivery associate
	const calculateWorkload = (daId, date) => {
		// This would be replaced with actual data from your API
		// For now, returning mock data
		return Math.floor(Math.random() * 8); // Random hours between 0-8
	};

	// Handle date range change
	const handleStartDateChange = (args) => {
		setStartDate(args.value);
	};

	const handleEndDateChange = (args) => {
		setEndDate(args.value);
	};

	// Handle refresh
	const handleRefresh = () => {
		// This would trigger a refetch of the data
		// For now, just log a message
		console.log("Refreshing data...");
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" gutterBottom>
				Delivery Schedule
			</Typography>

			{/* Filters */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="subtitle2" gutterBottom>
							Start Date
						</Typography>
						<DatePickerComponent
							value={startDate}
							change={handleStartDateChange}
							format="MM/dd/yyyy"
							placeholder="Select start date"
							cssClass="e-custom-datepicker"
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Typography variant="subtitle2" gutterBottom>
							End Date
						</Typography>
						<DatePickerComponent
							value={endDate}
							change={handleEndDateChange}
							format="MM/dd/yyyy"
							placeholder="Select end date"
							cssClass="e-custom-datepicker"
						/>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth>
							<InputLabel sx={{ "&.Mui-focused": { color: "green" } }}>
								Category
							</InputLabel>
							<Select
								value={selectedCategory}
								label="Category"
								onChange={(e) => setSelectedCategory(e.target.value)}
								sx={{
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
									".MuiSvgIcon-root": {
										color: "green",
									},
								}}
							>
								<MenuItem value="all">All Categories</MenuItem>
								{categories.map((category) => (
									<MenuItem key={category} value={category}>
										{category}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={6} md={2}>
						<FormControl fullWidth>
							<InputLabel sx={{ "&.Mui-focused": { color: "green" } }}>
								Delivery Associate
							</InputLabel>
							<Select
								value={selectedDA}
								label="Delivery Associate"
								onChange={(e) => setSelectedDA(e.target.value)}
								disabled={isLoadingDAs}
								sx={{
									"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
									"&:hover .MuiOutlinedInput-notchedOutline": {
										borderColor: "green",
									},
									".MuiSvgIcon-root": {
										color: "green",
									},
								}}
							>
								<MenuItem value="all">All DAs</MenuItem>
								{deliveryAssociates.map((da) => (
									<MenuItem key={da._id} value={da._id}>
										{da.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid
						item
						xs={12}
						md={2}
						sx={{ display: "flex", justifyContent: "flex-end" }}
					>
						<Tooltip title="Refresh">
							<IconButton onClick={handleRefresh} sx={{ color: "green" }}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</Paper>

			{/* Schedule Table */}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Date</TableCell>
							<TableCell>Delivery Associate</TableCell>
							<TableCell>Request</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Customer</TableCell>
							<TableCell>Estimated Hours</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{dateRange.map((date) => {
							// This would be replaced with actual data from your API
							// For now, generating mock data
							const assignments = deliveryAssociates
								.filter((da) => selectedDA === "all" || da._id === selectedDA)
								.map((da) => {
									// Randomly decide if this DA has an assignment on this date
									const hasAssignment = Math.random() > 0.7;
									if (!hasAssignment) return null;

									const workload = calculateWorkload(da._id, date);
									const categories = [
										"Equipment",
										"Personnel",
										"Material",
										"Service",
										"Other",
									];
									const category =
										categories[Math.floor(Math.random() * categories.length)];

									// Skip if category filter is active and doesn't match
									if (
										selectedCategory !== "all" &&
										category !== selectedCategory
									) {
										return null;
									}

									return {
										da,
										request: `Request ${Math.floor(Math.random() * 1000)}`,
										category,
										customer: `Customer ${Math.floor(Math.random() * 100)}`,
										estimatedHours: workload,
										status: Math.random() > 0.5 ? "Confirmed" : "Pending",
									};
								})
								.filter(Boolean);

							if (assignments.length === 0) {
								return (
									<TableRow key={date.toISOString()}>
										<TableCell colSpan={7} align="center">
											{format(date, "MMM d, yyyy")} - No assignments
										</TableCell>
									</TableRow>
								);
							}

							return assignments.map((assignment, index) => (
								<TableRow
									key={`${date.toISOString()}-${assignment.da._id}-${index}`}
									hover
									onClick={() => onAssignmentClick?.(assignment.da._id, date)}
									sx={{ cursor: "pointer" }}
								>
									{index === 0 && (
										<TableCell rowSpan={assignments.length}>
											{format(date, "MMM d, yyyy")}
										</TableCell>
									)}
									<TableCell>{assignment.da.name}</TableCell>
									<TableCell>{assignment.request}</TableCell>
									<TableCell>{assignment.category}</TableCell>
									<TableCell>{assignment.customer}</TableCell>
									<TableCell>{assignment.estimatedHours} hrs</TableCell>
									<TableCell>
										<Typography
											variant="body2"
											color={
												assignment.status === "Confirmed"
													? "success.main"
													: "warning.main"
											}
										>
											{assignment.status}
										</Typography>
									</TableCell>
								</TableRow>
							));
						})}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Workload Summary */}
			<Paper sx={{ p: 2, mt: 3 }}>
				<Typography variant="h6" gutterBottom>
					Workload Summary
				</Typography>
				<Divider sx={{ mb: 2 }} />
				<Grid container spacing={2}>
					{deliveryAssociates.map((da) => {
						// Calculate total workload for this DA in the selected date range
						const totalWorkload = dateRange.reduce(
							(sum, date) => sum + calculateWorkload(da._id, date),
							0,
						);
						const avgWorkload = totalWorkload / dateRange.length;

						return (
							<Grid item xs={12} sm={6} md={4} key={da._id}>
								<Paper
									sx={{
										p: 2,
										bgcolor:
											avgWorkload > 6 ? "warning.light" : "background.paper",
									}}
								>
									<Typography variant="subtitle1">{da.name}</Typography>
									<Typography variant="body2">
										Total Hours: {totalWorkload}
									</Typography>
									<Typography variant="body2">
										Average Hours/Day: {avgWorkload.toFixed(1)}
									</Typography>
									{avgWorkload > 6 && (
										<Alert severity="warning" sx={{ mt: 1 }}>
											High workload detected
										</Alert>
									)}
								</Paper>
							</Grid>
						);
					})}
				</Grid>
			</Paper>
		</Box>
	);
};

export default DeliveryScheduleView; 