import React from 'react';
import { MarkerF } from '@react-google-maps/api';

const DeliveryMarker = ({ position, icon, onClick }) => {
  if (!position?.lat || !position?.lng) {
    console.error('Invalid position for marker:', position);
    return null;
  }

  return (
    <MarkerF
      position={position}
      onClick={onClick}
      icon={{
        path: icon.path,
        fillColor: icon.fillColor || '#86EFAC',
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: icon.strokeColor || '#ffffff',
        scale: icon.scale || 1.5,
        anchor: new google.maps.Point(12, 12)
      }}
      title={icon.title}
    />
  );
};

export default DeliveryMarker; 