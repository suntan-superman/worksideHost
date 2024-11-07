/* eslint-disable */ 
import React from "react";
import Map2 from './Map2.jsx';

// const MapContainer = ({ shownPin }) => {
function MapContainer(props) {
  const { reqLocation } = props;
  const { delLocation } = props;

  return (
    <Map2
      reqLocation={reqLocation}
      delLocation={delLocation}
    />
  );
}

export default MapContainer;
