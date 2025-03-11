import React from 'react';
import { MarkerF } from "@react-google-maps/api";

const CustomMarker = ({ position, type, onClick }) => {
  if (!position?.lat || !position?.lng) {
    console.error('Invalid position for marker:', { position, type });
    return null;
  }

  const getMarkerIcon = () => {
    const iconPath = type === 'origin' 
      ? "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"
      : type === 'destination'
      ? "M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"
      : "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

    return {
      path: iconPath,
      fillColor: type === 'origin' ? '#1976d2' : type === 'destination' ? '#f44336' : '#4caf50',
      fillOpacity: 1,
      strokeWeight: 1,
      strokeColor: '#ffffff',
      scale: 1.5,
      anchor: new google.maps.Point(12, 12)
    };
  };

  return (
    <MarkerF
      position={position}
      onClick={onClick}
      icon={getMarkerIcon()}
      title={type}
    />
  );
};

export default CustomMarker; 