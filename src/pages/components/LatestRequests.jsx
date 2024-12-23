/* eslint-disable */

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import { DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import dayjs from "dayjs";
// import LatestRequestsModal from "./LatestRequestsModal";

// Status Map for the Chip Component
const statusMap = {
	pending: { label: "Pending", color: "warning" },
	awarded: { label: "Awarded", color: "success" },
	completed: { label: "Completed", color: "error" },
};

export function LatestRequests({ requests = [], sx }) {
	const [viewRequestsFlag, setViewRequestsFlag] = useState(false);

	const OnCloseViewRequestsDialog = () => {
		setViewRequestsFlag(false);
	};

	return (
		<Card sx={sx}>
			{/* Header */}
			<Typography color="green" variant="h6" sx={{ textAlign: "left" }}>
				Latest Requests
			</Typography>
			{/* <CardHeader title="Latest Requests" /> */}
			<Divider />

			{/* Table Container */}
			<Box sx={{ overflowX: "auto" }}>
				<Table sx={{ minWidth: "800px" }}>
					<TableHead>
						<TableRow>
							<TableCell>Project</TableCell>
							<TableCell>Request</TableCell>
							<TableCell sortDirection="desc">Date</TableCell>
							<TableCell>Status</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{requests.map((request) => {
							const { label, color } = statusMap[request.status] ?? {
								label: "Unknown",
								color: "default",
							};

							return (
								<TableRow hover key={request.id}>
									<TableCell>{request.project}</TableCell>
									<TableCell>{request.request}</TableCell>
									<TableCell>
										{dayjs(request.createdAt).format("MMM D, YYYY")}
									</TableCell>
									<TableCell>
										<Chip color={color} label={label} size="small" />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Box>

			<Divider />

			{/* Card Actions */}
			<CardActions sx={{ justifyContent: "flex-end" }}>
				<Button
					color="inherit"
					endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
					size="small"
					variant="text"
					onClick={() => setViewRequestsFlag(true)}
				>
					View all
				</Button>
			</CardActions>
			<div>
				{viewRequestsFlag && (
					<LatestRequestsModal
						open={viewRequestsFlag}
						onClose={OnCloseViewRequestsDialog}
					/>
				)}
			</div>
		</Card>
	);
}

const LatestRequestsModal = ({ open, onClose }) => {
	const requestList = [
		{
			id: "ORD-001",
			project: "383-26R Redrill",
			request: "Drill Bit",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-002",
			project: "66-7Z Pump Change",
			request: "Electrical",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-003",
			project: "35-18g Pump Change",
			request: "Welder",
			status: "awarded",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-004",
			project: "25A-18g Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-005",
			project: "388-22R Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-006",
			project: "383-26R Redrill",
			request: "Drill Bit",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-007",
			project: "66-7Z Pump Change",
			request: "Electrical",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-008",
			project: "35-18g Pump Change",
			request: "Welder",
			status: "awarded",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-009",
			project: "25A-18g Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-010",
			project: "388-22R Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-011",
			project: "383-26R Redrill",
			request: "Drill Bit",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-012",
			project: "66-7Z Pump Change",
			request: "Electrical",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-013",
			project: "35-18g Pump Change",
			request: "Welder",
			status: "awarded",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-014",
			project: "25A-18g Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
		{
			id: "ORD-015",
			project: "388-22R Side Track",
			request: "Vacuum Truck",
			status: "pending",
			createdAt: dayjs().subtract(10, "minutes").toDate(),
		},
	];

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#viewRequestsDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	return (
		<div>
			<Dialog
				open={open}
				aria-labelledby="viewRequestsDialog"
				PaperComponent={PaperComponent}
				sx={{
					"& .MuiDialog-paper": {
						minWidth: "1000px", // Set minimum width for the dialog
					},
				}}
			>
				<DialogTitle id="viewRequestsDialog">
					<Box display="flex" justifyContent="center">
						<Typography
							component="span"
							sx={{ color: "green", fontSize: 24, fontWeight: "bold" }}
						>
							WORK
						</Typography>
						<Typography
							component="span"
							sx={{ color: "black", fontSize: 24, fontWeight: "bold" }}
						>
							SIDE
						</Typography>
					</Box>
					{/* Subtitle */}
					<Typography
						sx={{
							color: "black",
							fontSize: 20,
							fontWeight: "normal",
							textAlign: "center",
							marginTop: 1, // Add some spacing between header and subtitle
						}}
					>
						Latest Requests
					</Typography>
				</DialogTitle>
				<DialogContent style={{ width: "100%", height: "600px" }}>
					{/* Table Container */}
					<Box sx={{ overflowX: "auto" }}>
						<Table sx={{ width: "100%" }}>
							<TableHead>
								<TableRow>
									<TableCell>Project</TableCell>
									<TableCell>Request</TableCell>
									<TableCell sortDirection="desc">Date</TableCell>
									<TableCell>Status</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{requestList.map((request) => {
									const { label, color } = statusMap[request.status] ?? {
										label: "Unknown",
										color: "default",
									};

									return (
										<TableRow hover key={request.id}>
											<TableCell>{request.project}</TableCell>
											<TableCell>{request.request}</TableCell>
											<TableCell>
												{dayjs(request.createdAt).format("MMM D, YYYY")}
											</TableCell>
											<TableCell>
												<Chip color={color} label={label} size="small" />
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</Box>
					{/* <FormGroup>
						<p className="text-red-700 text-xs font-bold pt-2 pb-2">
							View Requests
						</p>
					</FormGroup> */}
				</DialogContent>
				<DialogActions>
					<Button variant="contained" color="success" onClick={onClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

