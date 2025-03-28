/* eslint-disable */

import React, { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import { DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { DotsThreeVertical as DotsThreeVerticalIcon } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
// import dayjs from "dayjs";

export function TopRatedSuppliers({ suppliers = [], sx }) {
	const [viewRatingsFlag, setViewRatingsFlag] = useState(false);
	const [viewSupplierDetailsFlag, setViewSupplierDetailsFlag] = useState(false);

	const OnCloseViewRatingsDialog = () => {
		setViewRatingsFlag(false);
	};

	const OnCloseCloseDetailsDialog = () => {
		setViewSupplierDetailsFlag(false);
	};

	return (
		<Card sx={{ minWidth: "300px" }}>
			{/* Card Header */}
			<Typography color="green" variant="h6" sx={{ textAlign: "left" }}>
				Top-Rated Suppliers
			</Typography>
			<Divider />

			{/* Supplier List */}
			<List sx={{ minWidth: "50%" }}>
				{suppliers.map((supplier, index) => (
					<ListItem divider={index < suppliers.length - 1} key={supplier.id}>
						{/* Product Details */}
						<ListItemText
							primary={supplier.name}
							secondary={`Rating: ${supplier.rating} Stars`}
							// secondary={`Updated ${dayjs(supplier.updatedAt).format("MMM D, YYYY")}`}
						/>
						<Rating
							name="text-feedback"
							value={Number.parseFloat(supplier.rating)}
							readOnly
							precision={0.5}
							size="small"
							emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="8" />}
						/>

						{/* Action Icon */}
						<IconButton
							edge="end"
							onClick={() => setViewSupplierDetailsFlag(true)}
						>
							<DotsThreeVerticalIcon weight="bold" />
						</IconButton>
					</ListItem>
				))}
			</List>

			<Divider />

			{/* Card Actions */}
			<CardActions sx={{ justifyContent: "flex-end" }}>
				<Button
					color="inherit"
					endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
					size="small"
					variant="text"
					onClick={() => setViewRatingsFlag(true)}
				>
					View all
				</Button>
			</CardActions>
			<div>
				{viewRatingsFlag && (
					<SupplierRatingsModal
						open={viewRatingsFlag}
						onClose={OnCloseViewRatingsDialog}
					/>
				)}
				{viewSupplierDetailsFlag && (
					<SupplierDetailsModal
						open={viewSupplierDetailsFlag}
						onClose={OnCloseCloseDetailsDialog}
					/>
				)}
			</div>
		</Card>
	);
}

/**
 * SupplierRatingsModal Component
 *
 * This component renders a modal dialog displaying a list of suppliers and their ratings.
 * It includes a draggable header, a styled title, and a scrollable list of suppliers with ratings.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the modal is open or closed.
 * @param {Function} props.onClose - Callback function to handle the closing of the modal.
 *
 * @returns {JSX.Element} The rendered SupplierRatingsModal component.
 */
const SupplierRatingsModal = ({ open, onClose }) => {
	const supplierList = [
		{
			id: "PRD-001",
			name: "Baker Hughes",
			rating: "5",
		},
		{
			id: "PRD-002",
			name: "Halliburton",
			rating: "4.9",
		},
		{
			id: "PRD-003",
			name: "EnergyLink",
			rating: "4.9",
		},
		{
			id: "PRD-004",
			name: "Basic",
			rating: "4.85",
		},
		{
			id: "PRD-005",
			name: "San Joaquin Bit",
			rating: "3.0",
		},
		{
			id: "PRD-006",
			name: "Baker Hughes",
			rating: "5",
		},
		{
			id: "PRD-007",
			name: "Halliburton",
			rating: "4.9",
		},
		{
			id: "PRD-008",
			name: "EnergyLink",
			rating: "4.9",
		},
		{
			id: "PRD-009",
			name: "Basic",
			rating: "4.85",
		},
		{
			id: "PRD-010",
			name: "San Joaquin Bit",
			rating: "3.0",
		},
		{
			id: "PRD-011",
			name: "Baker Hughes",
			rating: "5",
		},
		{
			id: "PRD-012",
			name: "Halliburton",
			rating: "4.9",
		},
		{
			id: "PRD-013",
			name: "EnergyLink",
			rating: "4.9",
		},
		{
			id: "PRD-014",
			name: "Basic",
			rating: "4.85",
		},
		{
			id: "PRD-015",
			name: "San Joaquin Bit",
			rating: "3.0",
		},
	];

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#viewSupplierRatingsDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	// Custom styled header
	const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
		color: "black",
		fontSize: "20px",
		fontWeight: "bold",
		alignContent: "center",
		justifyContent: "center",
	}));

	return (
		<div>
			<Dialog
				open={open}
				aria-labelledby="viewSupplierRatingsDialog"
				PaperComponent={PaperComponent}
				sx={{
					"& .MuiDialog-paper": {
						minWidth: "600px", // Set minimum width for the dialog
					},
				}}
			>
				<DialogTitle id="viewSupplierRatingsDialog">
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
						Supplier Ratings
					</Typography>
				</DialogTitle>
				<DialogContent style={{ width: "100%", height: "500px" }}>
					{/* <FormGroup>
						<p className="text-red-700 text-xs font-bold pt-2 pb-2">
							View Supplier Ratings
						</p>
					</FormGroup> */}
					{/* Supplier List */}
					<List sx={{ minWidth: "50%" }}>
						{supplierList.map((supplier, index) => (
							<ListItem
								divider={index < supplierList.length - 1}
								key={supplier.id}
							>
								{/* Product Details */}
								<ListItemText
									primary={supplier.name}
									secondary={`Rating: ${supplier.rating} Stars`}
									// secondary={`Updated ${dayjs(supplier.updatedAt).format("MMM D, YYYY")}`}
								/>
								<Rating
									name="text-feedback"
									value={supplier.rating}
									readOnly
									precision={0.5}
									size="small"
									emptyIcon={
										<StarIcon style={{ opacity: 0.55 }} fontSize="8" />
									}
								/>

								{/* Action Icon */}
								<IconButton
									edge="end"
									onClick={() => console.log("Supplier Options Clicked")}
								>
									<DotsThreeVerticalIcon weight="bold" />
								</IconButton>
							</ListItem>
						))}
					</List>
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

const SupplierDetailsModal = ({ open, onClose }) => {
	function PaperComponent(props) {
		return (
			<Draggable
				handle="#viewSupplierDetailsDialog"
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
				aria-labelledby="viewSupplierDetailsDialog"
				PaperComponent={PaperComponent}
				sx={{
					"& .MuiDialog-paper": {
						minWidth: "600px", // Set minimum width for the dialog
					},
				}}
			>
				<DialogTitle id="viewSupplierDetailsDialog">
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
						Supplier Details
					</Typography>
				</DialogTitle>
				<DialogActions>
					<Button variant="contained" color="success" onClick={onClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};



