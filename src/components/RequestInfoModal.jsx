/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	// DialogContentText,
	DialogActions,
	Stack,
	Modal,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
// import {
// 	LoadScript,
// } from "@react-google-maps/api";
// import mapStyles from "./MapStyles";
import { format } from "date-fns";
// import CustomMap from "./Map";
import {
	APIProvider,
	Map as GoogleMap,
	// Marker,
	AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MyLocation, LocalShipping } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DeliveryAssociateDialog from "./DeliveryAssociateDialog";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
	SaveRequestBid,
	UpdateRequestStatus,
} from "../api/worksideAPI";

import {
	showErrorDialog,
	showSuccessDialogWithTimer,
} from "../utils/useSweetAlert";

const RequestInfoModal = ({ recordID, open, onClose }) => {
	// Add early return if recordID is null/undefined AND dialog is open
	if (open && !recordID) {
		console.warn('RequestInfoModal opened without a valid recordID');
		return (
			<Modal
				open={open}
				onClose={onClose}
				aria-labelledby="requestDetailsDialog"
				disableEnforceFocus
				disableAutoFocus
			>
				<Dialog
					open
					aria-labelledby="requestDetailsDialog"
					PaperComponent={PaperComponent}
					sx={{ height: "800px" }}
					disableEnforceFocus
					disableAutoFocus
				>
					<DialogTitle>
						<span className="text-bold text-green-300 text-xl">WORK</span>
						<span className="text-bold text-black text-xl">SIDE</span>
					</DialogTitle>
					<DialogContent>
						<p>No request details available</p>
					</DialogContent>
					<DialogActions>
						<Button variant="contained" color="error" onClick={onClose}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Modal>
		);
	}

	// Original null check for when dialog is closed
	if (!open || !recordID) return null;

	const [customerName, setCustomerName] = useState(null);
	const [rigCompany, setRigCompany] = useState(null);
	const [requestName, setRequestName] = useState(null);
	const [requestCategory, setRequestCategory] = useState(null);
	const [dateTimeRequested, setDateTimeRequested] = useState(null);
	const [supplierID, setSupplierID] = useState(null);
	const [requestStatus, setRequestStatus] = useState(null);
	const [mapContainer, setMapContainer] = useState(null);
	const [showDADialog, setShowDADialog] = useState(false);
	const [disableAcceptButton, setDisableAcceptButton] = useState(false);
	const queryClient = useQueryClient();
	const [requestData, setRequestData] = useState(null);
	let staticSupplierID = null;

	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	const reqLocation = {
		lat: 35.2,
		lng: -119.3,
	};

	const delLocation = {
		lat: 35.48,
		lng: -118.9,
	};

	useEffect(() => {
		const fetchRequest = async () => {
			const apiUrl = process.env.REACT_APP_MONGO_URI;

			try {
				const fetchString = `${apiUrl}/api/request/${recordID}`;
				const response = await fetch(fetchString);
				const json = await response.json();
				
				// Store the complete request data
				setRequestData(json);
				
				// Set individual fields
				setCustomerName(
					JSON.stringify(json.customername).replace(/^"(.*)"$/, "$1"),
				);
				setRigCompany(JSON.stringify(json.rigcompany).replace(/^"(.*)"$/, "$1"));
				setRequestName(
					JSON.stringify(json.requestname).replace(/^"(.*)"$/, "$1"),
				);
				setRequestCategory(
					JSON.stringify(json.requestcategory).replace(/^"(.*)"$/, "$1"),
				);
				const formattedDate = format(
					new Date(json.datetimerequested),
					"MMMM do yyyy, h:mm",
				);
				setDateTimeRequested(formattedDate);
				setRequestStatus(JSON.stringify(json.status).replace(/^"(.*)"$/, "$1"));
				setSupplierID(json.ssrVendorId);
				staticSupplierID = json.ssrVendorId;
				if(json.status === "SSR-ACCEPTED") {
					setDisableAcceptButton(true);
				}
			} catch (error) {
				console.error("Error fetching request data:", error);
				showErrorDialog("Failed to fetch request details");
			}
		};
		
		if (recordID) {
			fetchRequest();
		}
	}, [recordID]);

	// Define the mutation to save request bid
	const saveRequestBidMutation = useMutation({
		mutationFn: async (reqBidData) => {
			await SaveRequestBid(reqBidData);
		},
		onSuccess: () => {
			showSuccessDialogWithTimer("Request Bid Saved Successfully");
			queryClient.invalidateQueries("requests");
			},
		onError: (error) => {
			// Toast.show({
			// 	type: "error",
			// 	text1: "Workside Software",
			// 	text2: `Error Saving Bid: ${error}`,
			// 	visibilityTime: 3000,
			// 	autoHide: true,
			// });
		},
	});

	// Modify existing handleAssignDA function
	const handleAssignDA = () => {
		setShowDADialog(true);
	};

	// Add new handler for DA assignment
	const handleDAAssignment = async (deliveryAssociateId) => {
		try {
			const response = await axios.put(
				`${process.env.REACT_APP_MONGO_URI}/api/requestbid/${recordID}/da-assignment`,
				{
					deliveryAssociateId: deliveryAssociateId,
					status: "ASSIGNED",
				},
			);
			
			if (response.status === 200) {
				showSuccessDialogWithTimer("Delivery Associate Assigned Successfully");
				queryClient.invalidateQueries(["requests"]);
			}
		} catch (error) {
			console.error("Error assigning delivery associate:", error);
			showErrorDialog("Failed to assign delivery associate");
		}
	};

	// Add new handler for Accept Request
	const handleAcceptRequest = async () => {
		// Update request status
		{
			const response = await UpdateRequestStatus({
				reqID: requestData._id,
				status: "SSR-ACCEPTED"
			});
			if (response.status === 200) {
				setDisableAcceptButton(true);
			}
		}
		// Create New SSR Bid
		const reqBidData = {
			requestid: requestData._id,
			supplierid: staticSupplierID || supplierID,
			suppliercontactid: null,
			creationdate: new Date(),
			quantity: requestData.quantity,
			deliverydate: requestData.datetimerequested,
			description: null,
			estimatedcost: null,
			status: "SSR-ACCEPTED",
			statusdate: new Date(),
			comment: requestData.comment,
		};
		saveRequestBidMutation.mutateAsync(reqBidData);

		// if (requestResponse.status === 200 && bidResponse.status === 200) {
		// 	showSuccessDialogWithTimer("Request Accepted Successfully");
		// 	queryClient.invalidateQueries(["requests"]);
		// 	onClose();
		// }
	};

	function PaperComponent(props) {
		return (
			<Draggable
				handle="#requestDetailsDialog"
				cancel={'[class*="MuiDialogContent-root"]'}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	return (
		<>
			<Modal
				open={open}
				onClose={onClose}
				aria-labelledby="requestDetailsDialog"
				disableEnforceFocus
				disableAutoFocus
			>
				<Dialog
					open
					aria-labelledby="requestDetailsDialog"
					PaperComponent={PaperComponent}
					sx={{ height: "800px" }}
					disableEnforceFocus
					disableAutoFocus
				>
					<DialogTitle id="requestDetailsDialog">
						<span className="text-bold text-green-300 text-xl">WORK</span>
						<span className="text-bold text-black text-xl">SIDE</span>
						<br />
						<p className="text-bold text-black text-xl">Request Details</p>
					</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<div className="flex space-x-4">
								{/* Column 1 */}
								<div className="flex-1 ml-2.5 mr-2.5 text-left">
									{/* <h2 className="text-lg font-bold mb-2">Column 1</h2> */}
									<p>Customer</p>
									<p>Rig Company</p>
									<p>Request Category</p>
									<p>Request</p>
									<p>Date and Time Requested</p>
									<p>Request Status</p>
								</div>

								{/* Column 2 */}
								<div className="flex-1 ml-2.5 mr-2.5 text-left font-bold">
									<p>{customerName}</p>
									<p>{rigCompany}</p>
									<p>{requestCategory}</p>
									<p>{requestName}</p>
									<p>{dateTimeRequested}</p>
									<p>{requestStatus}</p>
								</div>
							</div>
							<div className="mb-3" />
						</Stack>
						<div className="map_box">
							<APIProvider apiKey={apiKey}>
								<GoogleMap
									mapId={"DEMO_ID"}
									style={{ width: "500px", height: "500px" }}
									defaultCenter={reqLocation}
									defaultZoom={8}
									gestureHandling={"greedy"}
								>
									<AdvancedMarker
										position={reqLocation}
										gestureHandling={"greedy"}
										icon={MyLocation}
										title="Rig"
									/>
									<AdvancedMarker
										position={delLocation}
										icon={<LocationOnIcon />}
										title="Delivery"
									/>
								</GoogleMap>
							</APIProvider>
							{/* <LoadScript
								id="script-loader"
								googleMapsApiKey={apiKey}
								language="en"
								region="EN"
								version="weekly"
							>
								<CustomMap reqLocation={reqLocation} delLocation={delLocation} />
							</LoadScript> */}
						</div>
					</DialogContent>
					<DialogActions>
						{requestStatus === "SSR-REQ" && (
							<>
								<Button 
									variant="contained" 
									onClick={handleAcceptRequest}
									disabled={disableAcceptButton}
									sx={{
										backgroundColor: "green",
										color: "white",
										marginRight: 1,
										"&:hover": {
											backgroundColor: "darkgreen",
										},
									}}
								>
									Accept Req
								</Button>
								<Button 
									variant="contained" 
									onClick={handleAssignDA}
									sx={{
										backgroundColor: "green",
										color: "white",
										"&:hover": {
											backgroundColor: "darkgreen",
										},
									}}
								>
									Assign DA
								</Button>
							</>
						)}
						<Button variant="contained" color="error" onClick={onClose}>
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Modal>
			<DeliveryAssociateDialog
				open={showDADialog}
				onClose={() => setShowDADialog(false)}
				onAssign={handleDAAssignment}
				supplierID={supplierID}
			/>
		</>
	);
};

export default RequestInfoModal;
