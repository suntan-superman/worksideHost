/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Modal,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import axios from "axios";

const PaperComponent = (props) => {
	return (
		<Draggable
			handle="#deliveryAssociateDialog"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
};

/**
 * DeliveryAssociateDialog Component
 *
 * A modal dialog for assigning a delivery associate to a supplier.
 * It fetches and displays a list of delivery associates based on the provided supplier ID.
 *
 * @component
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.open - Determines whether the dialog is open or closed.
 * @param {Function} props.onClose - Callback function to close the dialog.
 * @param {Function} props.onAssign - Callback function to handle the assignment of a delivery associate.
 * @param {string} props.supplierID - The ID of the supplier for which delivery associates are fetched.
 *
 * @returns {JSX.Element} The rendered DeliveryAssociateDialog component.
 *
 * @example
 * <DeliveryAssociateDialog
 *   open={true}
 *   onClose={handleClose}
 *   onAssign={handleAssign}
 *   supplierID="12345"
 * />
 */
const DeliveryAssociateDialog = ({ open, onClose, onAssign, supplierID }) => {
	const [deliveryAssocData, setDeliveryAssocData] = useState([]);
	const [selectedDA, setSelectedDA] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const apiURL = process.env.REACT_APP_MONGO_URI;

	useEffect(() => {
		const GetDeliveryAssoc = async () => {
			if (!supplierID) {
				setErrorMessage("No Supplier ID Available");
				setDeliveryAssocData([]);
				return;
			}

			try {
				const strAPI = `${apiURL}/api/deliveryassociate`;
				const response = await axios.get(strAPI);
				const filteredDA = response.data.filter(
					(da) => da.supplierid === supplierID,
				);

				if (filteredDA.length === 0) {
					setErrorMessage(
						"No Delivery Associates Available for Selected Supplier",
					);
					setDeliveryAssocData([]);
				} else {
					setErrorMessage("");
					setDeliveryAssocData(filteredDA);
				}
			} catch (error) {
				console.log("error", error);
				setErrorMessage("Error loading delivery associates");
				setDeliveryAssocData([]);
			}
		};

		if (open) {
			GetDeliveryAssoc();
		} else {
			setSelectedDA("");
			setErrorMessage("");
		}
	}, [supplierID, apiURL, open]);

	const handleAssign = () => {
		onAssign(selectedDA);
		onClose();
	};

	return (
		<Modal open={open} onClose={onClose} disableEnforceFocus disableAutoFocus>
			<Dialog
				open
				PaperComponent={PaperComponent}
				aria-labelledby="deliveryAssociateDialog"
				disableEnforceFocus
				disableAutoFocus
			>
				<DialogTitle id="deliveryAssociateDialog">
					<span className="text-bold text-green-500 text-xl">WORK</span>
					<span className="text-bold text-black text-xl">SIDE</span>
					<br />
					<p className="text-bold text-black text-xl">
						Assign Delivery Associate
					</p>
				</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2, minWidth: 300 }}>
						{errorMessage ? (
							<p className="text-red-500 text-bold mb-4">{errorMessage}</p>
						) : (
							<FormControl fullWidth>
								<InputLabel
									sx={{
										"&.Mui-focused": {
											color: "green",
										},
									}}
								>
									Select Delivery Associate
								</InputLabel>
								<Select
									value={selectedDA}
									onChange={(e) => setSelectedDA(e.target.value)}
									label="Select Delivery Associate"
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
									{deliveryAssocData.map((da) => (
										<MenuItem key={da._id} value={da._id}>
											{da.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						onClick={handleAssign}
						disabled={!selectedDA || errorMessage}
						sx={{
							backgroundColor: "green",
							"&:hover": {
								backgroundColor: "darkgreen",
							},
							"&.Mui-disabled": {
								backgroundColor: "#cccccc",
							},
						}}
					>
						Assign
					</Button>
					<Button variant="contained" color="error" onClick={onClose}>
						Close
					</Button>
				</DialogActions>
			</Dialog>
		</Modal>
	);
};

export default DeliveryAssociateDialog; 