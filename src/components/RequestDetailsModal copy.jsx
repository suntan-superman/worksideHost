import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Box } from '@material-ui/core';
import Skeleton, { SkeletonText } from 'react-loading-skeleton';
import GoogleMapReact from 'google-map-react';
import { useJsApiLoader, GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const RequestDetailsTestModal = ({ recordID, open, onOK, onClose }) => {
  if (!open || !recordID) return null;

  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: 'AIzaSyAdvuhmglZrzsgTj049RdJBmU8e6rzefPk',
  });

  if (!isLoaded) {
    return <>Is Loading...</>;
  }

  const [customername, setCustomerName] = useState(null);
  const [rigcompany, setRigCompany] = useState(null);
  const [requestname, setRequestName] = useState(null);
  const [datetimerequested, setDateTimeRequested] = useState(null);

  const containerStyle = {
    width: '300px',
    height: '300px' };

  const center = {
    lat: 35.393528,
    lng: -119.043732 };

  // Utilize useEffect to get Request Details
  useEffect(() => {
    const fetchRequest = async () => {
      const fetchString = (`/api/request/${recordID}`);
      // Set Wait Cursor
      document.getElementById('root').style.cursor = 'wait';
      const response = await fetch(fetchString);
      const json = await response.json();
      // Set the Customer Name and remove double quotes at beginning and end
      setCustomerName(JSON.stringify(json.customername).replace(/^"(.*)"$/, '$1'));
      setRigCompany(JSON.stringify(json.rigcompany).replace(/^"(.*)"$/, '$1'));
      setRequestName(JSON.stringify(json.requestname).replace(/^"(.*)"$/, '$1'));
      const formattedDate = format(new Date(json.datetimerequested), 'MMMM do yyyy, h:mm');
      setDateTimeRequested(formattedDate);
      // setDateTimeRequested(JSON.stringify(json.datetimerequested));
      // Set Default Cursor
      document.getElementById('root').style.cursor = 'default';
    };
    fetchRequest();
  }, []);

  return (
    <div id="requestFrame" className="relative bg-gainsboro-100 w-full h-full overflow-hidden text-center text-lg text-black font-paragraph-button-text">
      <div>
        <p>Customer: {customername}</p>
        <p>Rig Company: {rigcompany}</p>
        <p>Request: {requestname}</p>
        <p>Date Time Requested: {datetimerequested}</p>
      </div>
      <div>
        <Box position="absolute" left="0" top="0" height="100%" width="100%" >
          <GoogleMap
            // bootstrapURLKeys={{ key: process.env.JWTPRIVATEKEY }}
            // mapContainerStyle={containerStyle}
            mapContainerClassName="map_container"
            center={{ lat: 44, lng: -80 }}
            // center={center}
            zoom={15}
            // defaultCenter={defaultProps.center}
            // defaultZoom={defaultProps.zoom}
          >
            {/* <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            /> */}
          </GoogleMap>
        </Box>
      </div>
    </div>
  );
};

export default RequestDetailsTestModal;
