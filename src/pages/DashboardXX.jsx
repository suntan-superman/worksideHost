/* eslint-disable */
import React from "react";
import Grid2 from "@mui/material/Grid2";
import dayjs from "dayjs";

import { RequestsAwardedThisWeek } from "./components/RequestsAwardedThisWeek";
import { RequestsAwardedThisMonth } from "./components/RequestsAwardedThisMonth";
import { RequestsCompletedThisWeek } from "./components/RequestsCompletedThisWeek";
import { RequestsCompletedThisMonth } from "./components/RequestsCompletedThisMonth";
import { LatestRequests } from "./components/LatestRequests";
import { TopRatedSuppliers } from "./components/TopRatedSuppliers";
import { Header } from "../components";

/**
 * DashboardXX Component
 *
 * This component renders the main dashboard for the Workside application.
 * It displays various statistics, top-rated suppliers, and the latest requests.
 *
 * @component
 * @returns {JSX.Element} The rendered DashboardXX component.
 *
 * @example
 * <DashboardXX />
 *
 * @description
 * The dashboard is divided into two main sections:
 * 1. A top row displaying summary cards for requests awarded and completed.
 * 2. A bottom row displaying a list of top-rated suppliers and the latest requests.
 *
 * @property {Array<Object>} supplierList - A list of suppliers with their details.
 * @property {string} supplierList[].id - The unique identifier for the supplier.
 * @property {string} supplierList[].name - The name of the supplier.
 * @property {string} supplierList[].rating - The rating of the supplier.
 *
 * @property {Array<Object>} requestList - A list of requests with their details.
 * @property {string} requestList[].id - The unique identifier for the request.
 * @property {string} requestList[].project - The project associated with the request.
 * @property {string} requestList[].request - The type of request.
 * @property {string} requestList[].status - The current status of the request.
 * @property {Date} requestList[].createdAt - The creation date and time of the request.
 *
 * @dependencies
 * - `dayjs` for date manipulation.
 * - `Header` component for displaying the page header.
 * - `Grid2` component for layout and spacing.
 * - `RequestsAwardedThisWeek`, `RequestsAwardedThisMonth`, `RequestsCompletedThisWeek`,
 *   `RequestsCompletedThisMonth` components for displaying summary cards.
 * - `TopRatedSuppliers` component for displaying the list of top-rated suppliers.
 * - `LatestRequests` component for displaying the list of latest requests.
 */
export default function DashboardXX() {
	const supplierList = [
		{
			id: "PRD-005",
			name: "Halliburton",
			rating: "4.9",
		},
		{
			id: "PRD-004",
			name: "Baker Hughes",
			rating: "4.7",
		},
		{
			id: "PRD-003",
			name: "EnergyLink",
			rating: "4.6",
		},
		{
			id: "PRD-002",
			name: "Basic",
			rating: "4.55",
		},
		{
			id: "PRD-001",
			name: "San Joaquin Bit",
			rating: "3.5",
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
			{/* <div className="ml-3"> */}
			<Header category="Workside" title="Dashboard" />
			<Grid2 container spacing={2} sx={{ height: "100vh", width: "100vw" }}>
				<Grid2 container sx={{ height: "25%" }} spacing={2}>
					{/* <Grid2 container spacing={3}> */}
					{/* Requests Awarded This Week Card */}
					<Grid2 xs={3}>
						{/* <Grid2 lg={3} sm={6} xs={12}> */}
						<RequestsAwardedThisWeek
							diff={12}
							trend="up"
							sx={{ height: "100%" }}
							value="37"
						/>
					</Grid2>

					{/* Total Requests Awarded This Month Card */}
					<Grid2 xs={3}>
						{/* <Grid2 lg={3} sm={6} xs={12}> */}
						<RequestsAwardedThisMonth
							diff={16}
							trend="down"
							sx={{ height: "100%" }}
							value="87"
						/>
					</Grid2>

					{/* Requests Completed This Week Card */}
					<Grid2 xs={3}>
						{/* <Grid2 lg={3} sm={6} xs={12}> */}
						<RequestsCompletedThisWeek
							diff={18}
							trend="up"
							sx={{ height: "100%" }}
							value="42"
						/>
					</Grid2>

					{/* Total Requests Completed This Month Card */}
					<Grid2 xs={3}>
						{/* <Grid2 lg={3} sm={6} xs={12}> */}
						<RequestsCompletedThisMonth
							diff={19}
							trend="down"
							sx={{ height: "100%" }}
							value="128"
						/>
					</Grid2>
				</Grid2>
				<br />
				<br />
				{/* Second Row - 2 Items */}
				{/* First Item - 1/3 Width */}
				<Grid2 container sx={{ height: "75%", width: "100%" }} spacing={2}>
					{/* <Grid2 container spacing={3}> */}
					{/* Top-Rated Suppliers */}
					<Grid2 xs={4}>
						<TopRatedSuppliers
							suppliers={supplierList}
							sx={{ height: "100%", width: "100%" }}
						/>
					</Grid2>

					{/* Latest Requests */}
					<Grid2 xs={8}>
						<LatestRequests
							requests={requestList}
							sx={{ height: "100%", width: "100%" }}
						/>
					</Grid2>
				</Grid2>
				{/* </Grid2> */}
			</Grid2>
		</div>
	);
}
