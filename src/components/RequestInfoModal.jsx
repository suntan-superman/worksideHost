/* eslint-disable */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Stack,
	Modal,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { format, addHours } from "date-fns";
import {
	APIProvider,
	Map as GoogleMap,
	// Marker,
	AdvancedMarker,
} from "@vis.gl/react-google-maps";
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

/**
 * RequestInfoModal Component
 *
 * This component renders a modal dialog displaying detailed information about a request.
 * It includes features such as draggable and resizable modal, Google Maps integration for route tracking,
 * and actions for accepting requests or assigning delivery associates.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.recordID - The unique identifier of the request record.
 * @param {boolean} props.open - Determines whether the modal is open or closed.
 * @param {Function} props.onClose - Callback function to handle closing the modal.
 *
 * @returns {JSX.Element|null} The rendered modal component or null if the modal is closed and no recordID is provided.
 *
 * @example
 * <RequestInfoModal
 *   recordID="12345"
 *   open={true}
 *   onClose={() => console.log('Modal closed')}
 * />
 *
 * @remarks
 * - The modal fetches request details and route data from the backend using the provided `recordID`.
 * - It supports draggable and resizable functionality, with dimensions and position saved in localStorage.
 * - Google Maps is used to display the route and current location of the delivery.
 * - Includes actions for accepting requests and assigning delivery associates.
 *
 * @dependencies
 * - React hooks: `useState`, `useEffect`, `useCallback`, `useRef`
 * - External libraries: `axios`, `react-query`, `react-draggable`, `date-fns`
 * - Environment variables: `REACT_APP_GOOGLE_MAPS_API_KEY`, `REACT_APP_MONGO_URI`
 *
 * @todo
 * - Replace hardcoded request and supplier IDs in `fetchRouteData` with dynamic values.
 * - Improve error handling and user feedback for API calls.
 */
const RequestInfoModal = ({ recordID, open, onClose }) => {
	// Add early return if recordID is null/undefined AND dialog is open
	if (open && !recordID) {
		console.warn("RequestInfoModal opened without a valid recordID");
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
	const [projectName, setProjectName] = useState(null);
	const [rigCompany, setRigCompany] = useState(null);
	const [requestName, setRequestName] = useState(null);
	const [requestCategory, setRequestCategory] = useState(null);
	const [dateTimeRequested, setDateTimeRequested] = useState(null);
	const [supplierID, setSupplierID] = useState(null);
	const [supplierName, setSupplierName] = useState(null);
	const [requestStatus, setRequestStatus] = useState(null);
	const [mapContainer, setMapContainer] = useState(null);
	const [showDADialog, setShowDADialog] = useState(false);
	const [disableAcceptButton, setDisableAcceptButton] = useState(false);
	const queryClient = useQueryClient();
	const [requestData, setRequestData] = useState(null);
	let staticSupplierID = null;

	// New state for route tracking
	const [routeData, setRouteData] = useState([]);
	const [lastLocation, setLastLocation] = useState(null);
	const [lastUpdate, setLastUpdate] = useState(null);
	const mapRef = useRef(null);

	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

	const reqLocation = {
		lat: 35.2,
		lng: -119.3,
	};

	const delLocation = {
		lat: 35.48,
		lng: -118.9,
	};

	// Add state for modal dimensions
	const [modalDimensions, setModalDimensions] = useState(() => {
		const saved = localStorage.getItem("requestInfoModalDimensions");
		return saved ? JSON.parse(saved) : { width: 800, height: 800 };
	});

	// Save dimensions when they change
	useEffect(() => {
		localStorage.setItem(
			"requestInfoModalDimensions",
			JSON.stringify(modalDimensions),
		);
	}, [modalDimensions]);

	// Handle resize end
	const handleResize = (event, direction, ref) => {
		setModalDimensions({
			width: ref.style.width,
			height: ref.style.height,
		});
	};

	const apiUrl = process.env.REACT_APP_MONGO_URI;

	useEffect(() => {
		const fetchRequest = async () => {
			const fetchString = `${apiUrl}/api/request/${recordID}`;
			const response = await fetch(fetchString);
			const json = await response.json();

			// Store the complete request data
			setRequestData(json);
			// Set individual fields
			setCustomerName(
				JSON.stringify(json.customername).replace(/^"(.*)"$/, "$1"),
			);
			setProjectName(
				JSON.stringify(json.projectname).replace(/^"(.*)"$/, "$1"),
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
			setSupplierName(json.vendorName);
			staticSupplierID = json.ssrVendorId;
			if (json.status === "SSR-ACCEPTED") {
				setDisableAcceptButton(true);
			}
		};

		if (recordID) {
			fetchRequest();
		}
	}, [recordID, apiUrl, staticSupplierID]);

	// Fetch route data from the backend
	const fetchRouteData = useCallback(async () => {
		if (!requestData?._id || !requestData?.ssrVendorId) return;
		// TODO Let's get fake data for now
		const reqID = "65f123abc456def789012345";
		const supplierID = "65f123abc456def789012346";
		try {
			const response = await axios.post(
				`${process.env.REACT_APP_MONGO_URI}/api/mapping/coordinates`,
				{
					requestid: reqID,
					supplierid: supplierID,
					// requestid: requestData._id,
					// supplierid: requestData.ssrVendorId,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data && response.data.length > 0) {
				const formattedRoute = response.data.map((point) => ({
					lat: point.lat,
					lng: point.lng,
					timestamp: new Date(point.date),
				}));

				setRouteData(formattedRoute);
				setLastLocation(formattedRoute[formattedRoute.length - 1]);
				setLastUpdate(
					new Date(
						response.data[response.data.length - 1].date,
					).toLocaleTimeString(),
				);
			}
		} catch (error) {
			console.error("Error fetching route data:", error);
			showErrorDialog(`Failed to fetch route data: ${error.message}`);
		}
	}, [requestData]);

	// Set up polling interval for route updates
	useEffect(() => {
		if (open && requestData) {
			fetchRouteData();
			const interval = setInterval(fetchRouteData, 30000); // Update every 30 seconds
			return () => clearInterval(interval);
		}
	}, [fetchRouteData, open, requestData]);

	// Function to format coordinates for display
	const formatCoordinates = (coords) => {
		if (!coords) return "Unknown";
		return `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
	};

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
	const handleDAAssignment = async (deliveryAssociateId, estimatedHours) => {
		try {
			const response = await axios.put(
				`${process.env.REACT_APP_MONGO_URI}/api/requestbid/${recordID}/da-assignment`,
				{
					deliveryAssociateId: deliveryAssociateId,
					status: "ASSIGNED",
					estimatedHours: estimatedHours,
					estimatedArrivalTime: addHours(
						new Date(requestData.datetimerequested),
						estimatedHours,
					),
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
				status: "SSR-ACCEPTED",
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
				bounds="parent"
				position={(() => {
					const saved = localStorage.getItem("requestInfoModalPosition");
					return saved ? JSON.parse(saved) : { x: 0, y: 0 };
				})()}
				onStop={(e, data) => {
					localStorage.setItem(
						"requestInfoModalPosition",
						JSON.stringify({ x: data.x, y: data.y }),
					);
				}}
			>
				<Paper {...props} />
			</Draggable>
		);
	}

	// Modify the existing map section in the return statement
	const renderMap = () => (
		<div
			className="map_box"
			style={{
				width: "100%",
				height: "calc(100% - 200px)", // Adjust for header and buttons
				position: "relative",
				marginTop: "10px",
				marginBottom: "10px",
			}}
		>
			<APIProvider apiKey={apiKey}>
				<GoogleMap
					ref={mapRef}
					mapId={"DEMO_ID"}
					style={{
						width: "100%",
						height: "100%",
						borderRadius: "8px",
					}}
					defaultCenter={reqLocation}
					defaultZoom={8}
					gestureHandling={"greedy"}
				>
					{/* Destination Marker */}
					<AdvancedMarker
						position={reqLocation}
						gestureHandling={"greedy"}
						title="Rig Location"
					>
						<div style={{ fontSize: "24px" }}>🛢️</div>
					</AdvancedMarker>

					{/* Current Location Marker */}
					{lastLocation && (
						<AdvancedMarker position={lastLocation} title="Current Location">
							<div style={{ fontSize: "24px" }}>🚛</div>
						</AdvancedMarker>
					)}

					{/* Route Path */}
					{routeData.length > 1 && (
						<polyline
							path={routeData}
							options={{
								strokeColor: "#22C55E",
								strokeOpacity: 1.0,
								strokeWeight: 3,
							}}
						/>
					)}
				</GoogleMap>
			</APIProvider>

			{/* Location Update Information */}
			{lastLocation && (
				<div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
					<p className="text-sm font-bold">Last Known Position:</p>
					<p className="text-sm">{formatCoordinates(lastLocation)}</p>
					{lastUpdate && (
						<p className="text-xs text-gray-600">Last Update: {lastUpdate}</p>
					)}
				</div>
			)}
		</div>
	);

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
					sx={{
						"& .MuiDialog-paper": {
							width: modalDimensions.width,
							height: modalDimensions.height,
							maxWidth: "none",
							maxHeight: "none",
							resize: "both",
							overflow: "auto",
						},
						"& .MuiDialogContent-root": {
							display: "flex",
							flexDirection: "column",
							padding: "20px",
							height: "calc(100% - 120px)", // Adjust for header and buttons
							overflow: "hidden",
						},
					}}
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
						<Stack spacing={2} sx={{ flex: "none" }}>
							<div className="flex space-x-4">
								{/* Column 1 */}
								<div className="flex-1 ml-2.5 mr-2.5 text-left">
									{/* <h2 className="text-lg font-bold mb-2">Column 1</h2> */}
									<p>Project</p>
									<p>Rig Company</p>
									<p>Request Category</p>
									<p>Request</p>
									<p>Date and Time Requested</p>
									<p>Request Status</p>
									{/* Add SSR Supplier label if status is SSR-REQ or SSR-ACCEPTED */}
									{(requestStatus === "SSR-REQ" ||
										requestStatus === "SSR-ACCEPTED") && <p>SSR Supplier</p>}
								</div>

								{/* Column 2 */}
								<div className="flex-1 ml-2.5 mr-2.5 text-left font-bold">
									<p>{projectName}</p>
									<p>{rigCompany}</p>
									<p>{requestCategory}</p>
									<p>{requestName}</p>
									<p>{dateTimeRequested}</p>
									<p>{requestStatus}</p>
									{/* Add supplierName if status is SSR-REQ or SSR-ACCEPTED */}
									{(requestStatus === "SSR-REQ" ||
										requestStatus === "SSR-ACCEPTED") && <p>{supplierName}</p>}
								</div>
							</div>
						</Stack>
						{renderMap()}
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
				requestID={recordID}
				deliveryDate={requestData?.datetimerequested}
				requestCategory={requestData?.requestcategory}
			/>
		</>
	);
};

// Add some styles
const styles = {
	mapContainer: {
		position: "relative",
		width: "100%",
		height: "500px",
	},
	locationInfo: {
		position: "absolute",
		bottom: "1rem",
		left: "1rem",
		backgroundColor: "white",
		padding: "0.5rem",
		borderRadius: "0.375rem",
		boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
		zIndex: 1000,
	},
};

export default RequestInfoModal;
