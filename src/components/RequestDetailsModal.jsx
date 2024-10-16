/* eslint-disable */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { format } from 'date-fns';
import Skeleton, { SkeletonText } from 'react-loading-skeleton';
// import GoogleMapReact from 'google-map-react';
import {
  useJsApiLoader,
  GoogleMap,
  useLoadScript,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import CustomMap from "./Map";

const RequestDetailsTestModal = ({ recordID, open, onOK, onClose }) => {
  if (!open || !recordID) return null;

  const [customername, setCustomerName] = useState(null);
  const [rigcompany, setRigCompany] = useState(null);
  const [requestname, setRequestName] = useState(null);
  const [requestcategory, setRequestCategory] = useState(null);
  const [datetimerequested, setDateTimeRequested] = useState(null);
  const [mapContainer, setMapContainer] = useState(null);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const containerStyle = {
    width: '300px',
    height: '300px',
  };

  // const center = {
  //   lat: 35.393528,
  //   lng: -119.043732 };

  const reqLocation = {
    lat: 35.2,
    lng: -119.3,
  };

  const delLocation = {
    lat: 35.48,
    lng: -118.9,
  };

  const mapOptions = {
    // mapId: process.env.NEXT_PUBLIC_MAP_ID,
    center: { lat: 43.66293, lng: -79.39314 },
    zoom: 10,
    // disableDefaultUI: true,
  };

  function outputMap() {
    const [map, setMap] = useState();
    const ref = useRef();

    return (
      <>
        <div ref={ref} id='map' />
        {map}
      </>
    );
  }

  const center = useMemo(() => ({ lat: 35.393528, lng: -119.043732 }), []);

  // Utilize useEffect to get Request Details
  useEffect(() => {
    const fetchRequest = async () => {
      const apiUrl = process.env.REACT_APP_MONGO_URI;

						// const fetchString = `${apiUrl}/api/request/${recordID}`;
						const fetchString = `/api/request/${recordID}`;
						// Set Wait Cursor
						document.getElementById("root").style.cursor = "wait";
						const response = await fetch(fetchString);
						const json = await response.json();
						// Set the Customer Name and remove double quotes at beginning and end
						setCustomerName(
							JSON.stringify(json.customername).replace(/^"(.*)"$/, "$1"),
						);
						setRigCompany(
							JSON.stringify(json.rigcompany).replace(/^"(.*)"$/, "$1"),
						);
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
						// setDateTimeRequested(JSON.stringify(json.datetimerequested));
						// Set Default Cursor
						document.getElementById("root").style.cursor = "default";
    };
    fetchRequest();
  }, []);

  return (
			<div
				id="requestFrame"
				className="relative bg-gainsboro-100 w-full h-full overflow-hidden text-center text-lg text-black font-paragraph-button-text"
			>
				<div>
					<p>Customer: {customername}</p>
					<p>Rig Company: {rigcompany}</p>
					<p>Request: {requestname}</p>
					<p>Date Time Requested: {datetimerequested}</p>
				</div>
				<div className="map_box">
					<LoadScript
						id="script-loader"
						googleMapsApiKey={apiKey}
						language="en"
						region="EN"
						version="weekly"
					>
						<CustomMap reqLocation={reqLocation} delLocation={delLocation} />
					</LoadScript>
				</div>
			</div>
		);
};

export default RequestDetailsTestModal;
