/* eslint-disable */
import React, { useEffect, useState } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Stack,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
// import {
// 	LoadScript,
// } from "@react-google-maps/api";
import mapStyles from "./MapStyles";
import { format } from "date-fns";
// import CustomMap from "./Map";
import {
	APIProvider,
	Map as GoogleMap,
	Marker,
	AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { MyLocation, LocalShipping } from "@mui/icons-material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
// import { Truck } from "@mui/icons-material";
// import { Construction } from "@mui/icons-material";

const RequestInfoModal = ({ recordID, open, onClose }) => {
	if (!open || !recordID) return null;

	const [customerName, setCustomerName] = useState(null);
	const [rigCompany, setRigCompany] = useState(null);
	const [requestName, setRequestName] = useState(null);
	const [requestCategory, setRequestCategory] = useState(null);
	const [dateTimeRequested, setDateTimeRequested] = useState(null);
	const [mapContainer, setMapContainer] = useState(null);

	const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
	const mapKey = process.env.REACT_APP_GOOGLE_MAPS_KEY;

	const reqLocation = {
		lat: 35.2,
		lng: -119.3,
	};

	const delLocation = {
		lat: 35.48,
		lng: -118.9,
	};

	// Create Material UI icons as SVG elements
	// const truckIcon = document.createElement("div");
	// truckIcon.innerHTML = LocalShipping({
	// 	fontSize: "large",
	// 	style: { color: "blue" },
	// }).props.children;

	// const constructionIcon = document.createElement("div");
	// constructionIcon.innerHTML = MyLocation({
	// 	fontSize: "large",
	// 	style: { color: "orange" },
	// }).props.children;

	// Create the first AdvancedMarkerView with the truck icon
	// const truckMarker = new google.maps.marker.AdvancedMarkerView({
	// 	position: { delLocation },
	// 	content: truckIcon,
	// 	title: "Truck Location",
	// });

	// Create the second AdvancedMarkerView with the construction icon
	// const constructionMarker = new google.maps.marker.AdvancedMarkerView({
	// 	position: { reqLocation },
	// 	content: constructionIcon,
	// 	title: "Construction Location",
	// });

	// function outputMap() {
	// 		const [map, setMap] = useState();
	// 		const ref = useRef();

	// 		return (
	// 			<>
	// 				<div ref={ref} id="map" />
	// 				{map}
	// 			</>
	// 		);
	// 	}

	useEffect(() => {
		const fetchRequest = async () => {
			const apiUrl = process.env.REACT_APP_MONGO_URI;

			const fetchString = `${apiUrl}/api/request/${recordID}`;
			const response = await fetch(fetchString);
			const json = await response.json();
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
		};
		fetchRequest();
	}, [recordID]);

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
		<Dialog
			open={open}
			aria-labelledby="requestDetailsDialog"
			PaperComponent={PaperComponent}
			sx={{ height: "800px" }}
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
						</div>

						{/* Column 2 */}
						<div className="flex-1 ml-2.5 mr-2.5 text-left font-bold">
							<p>{customerName}</p>
							<p>{rigCompany}</p>
							<p>{requestCategory}</p>
							<p>{requestName}</p>
							<p>{dateTimeRequested}</p>
						</div>
					</div>
					<div className="mb-3" />
				</Stack>
				<div className="map_box">
					<APIProvider apiKey={apiKey}>
						<GoogleMap
							// key={"5064698848aecbfb "}
							mapId={"DEMO_ID"}
							style={{ width: "400px", height: "400px" }}
							defaultCenter={reqLocation}
							defaultZoom={8}
							gestureHandling={"greedy"}
							options={{ styles: mapStyles }}
						>
							{/* <truckMarker /> */}
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
				<Button variant="contained" color="error" onClick={onClose}>
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RequestInfoModal;
