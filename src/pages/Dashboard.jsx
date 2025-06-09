/* eslint-disable */
import React from "react";
import Grid from "@mui/material/Grid2";
import dayjs from "dayjs";

import { RequestsAwardedThisWeek } from "./components/RequestsAwardedThisWeek";
import { RequestsAwardedThisMonth } from "./components/RequestsAwardedThisMonth";
import { RequestsCompletedThisWeek } from "./components/RequestsCompletedThisWeek";
import { RequestsCompletedThisMonth } from "./components/RequestsCompletedThisMonth";
import { LatestRequests } from "./components/LatestRequests";
import { TopRatedSuppliers } from "./components/TopRatedSuppliers";
import { Header } from "../components";

/**
 * Dashboard component that displays an overview of the Workside application.
 *
 * This component renders a dashboard with the following sections:
 * - Summary cards for requests awarded and completed this week/month.
 * - A list of top-rated suppliers.
 * - A list of the latest requests.
 *
 * @component
 * @returns {JSX.Element} The rendered Dashboard component.
 *
 * @example
 * <Dashboard />
 *
 * @description
 * The component uses the following data:
 * - `supplierList`: An array of supplier objects with `id`, `name`, and `rating`.
 * - `requestList`: An array of request objects with `id`, `project`, `request`, `status`, and `createdAt`.
 *
 * The layout is structured using Material-UI's Grid system:
 * - The first row contains summary cards for requests awarded and completed.
 * - The second row contains a list of top-rated suppliers and the latest requests.
 *
 * Props passed to child components:
 * - `TopRatedSuppliers`: Receives `supplierList` as the `suppliers` prop.
 * - `LatestRequests`: Receives `requestList` as the `requests` prop.
 */
export default function Dashboard() {
	const supplierList = [
		{
			id: "PRD-005",
			name: "Halliburton",
			rating: "5",
		},
		{
			id: "PRD-004",
			name: "Baker Hughes",
			rating: "4.9",
		},
		{
			id: "PRD-003",
			name: "EnergyLink",
			rating: "4.9",
		},
		{
			id: "PRD-002",
			name: "Basic",
			rating: "4.85",
		},
		{
			id: "PRD-001",
			name: "San Joaquin Bit",
			rating: "3.0",
		},
	];

	const requestList = [
		{
			id: "ORD-007",
			project: "383-26R Redrill",
			request: "Drill Bit",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-006",
			project: "66-7Z Pump Change",
			request: "Electrical",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-004",
			project: "35-18g Pump Change",
			request: "Welder",
			status: "awarded",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-003",
			project: "25A-18g Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-002",
			project: "388-22R Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
	];

	return (
		<div className="ml-3">
			<Header category="Workside" title="Dashboard" />
			<Grid container spacing={2} sx={{ height: "100vh", width: "80vw" }}>
				<Grid container sx={{ height: "25%" }} spacing={2}>
					{/* Requests Awarded This Week Card */}
					<Grid xs={12} sm={6} md={4}>
						<RequestsAwardedThisWeek
							diff={12}
							trend="up"
							sx={{ height: "100%" }}
							value="37"
						/>
					</Grid>

					{/* Total Requests Awarded This Month Card */}
					<Grid xs={12} sm={6} md={4}>
						<RequestsAwardedThisMonth
							diff={16}
							trend="down"
							sx={{ height: "100%" }}
							value="87"
						/>
					</Grid>

					{/* Requests Completed This Week Card */}
					<Grid xs={12} sm={6} md={4}>
						<RequestsCompletedThisWeek
							diff={18}
							trend="up"
							sx={{ height: "100%" }}
							value="42"
						/>
					</Grid>

					{/* Total Requests Completed This Month Card */}
					<Grid xs={12} sm={6} md={4}>
						<RequestsCompletedThisMonth
							diff={19}
							trend="down"
							sx={{ height: "100%" }}
							value="128"
						/>
					</Grid>
				</Grid>
				<br />
				<br />
				{/* Second Row - 2 Items */}
				<Grid container sx={{ height: "75%", width: "100%" }} spacing={2}>
					{/* Top-Rated Suppliers */}
					<Grid xs={12} sm={6} md={4}>
						<TopRatedSuppliers
							suppliers={supplierList}
							sx={{ height: "100%", width: "100%" }}
						/>
					</Grid>

					{/* Latest Requests */}
					<Grid xs={12} sm={6} md={8}>
						<LatestRequests
							requests={requestList}
							sx={{ height: "100%", width: "100%" }}
						/>
					</Grid>
				</Grid>
			</Grid>
		</div>
	);
}

