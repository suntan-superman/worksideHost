import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
// import { MdLocalShipping,
//   MdConstruction,
// } from 'react-icons/md';
import { MyLocation, LocalShipping } from '@mui/icons-material';
// const Map2 = ({ children }) => {
// function Map2() {
function Map2(props) {
  const { reqLocation } = props;
  const { delLocation } = props;

  const reqLat = reqLocation.lat;
  const reqLng = reqLocation.lng;

  const mapStyles = [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [
        {
          color: '#e9e9e9',
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 17,
        },
      ],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 29,
        },
        {
          weight: 0.2,
        },
      ],
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 18,
        },
      ],
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff',
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f5f5f5',
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [
        {
          color: '#dedede',
        },
        {
          lightness: 21,
        },
      ],
    },
    {
      elementType: 'labels.text.stroke',
      stylers: [
        {
          visibility: 'on',
        },
        {
          color: '#ffffff',
        },
        {
          lightness: 16,
        },
      ],
    },
    {
      elementType: 'labels.text.fill',
      stylers: [
        {
          saturation: 36,
        },
        {
          color: '#333333',
        },
        {
          lightness: 40,
        },
      ],
    },
    {
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off',
        },
      ],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [
        {
          color: '#f2f2f2',
        },
        {
          lightness: 19,
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#fefefe',
        },
        {
          lightness: 20,
        },
      ],
    },
    {
      featureType: 'administrative',
      elementType: 'geometry.stroke',
      stylers: [
        {
          color: '#fefefe',
        },
        {
          lightness: 17,
        },
        {
          weight: 1.2,
        },
      ],
    },
  ];

  return (
    <GoogleMap
      id="worksideRequestMap"
      mapContainerStyle={{
        height: '400px',
        width: '800px',
      }}
      zoom={8}
      reqLocation
      center={{ lat: reqLat, lng: reqLng }}
      options={{ styles: mapStyles }}
    >
      {/* Output the Rig Location */}
      <Marker
        key={0}
        position={reqLocation}
        icon={MyLocation}
        title="Rig"
        // onClick={() => props.onMarkerClick(marker)}
      />
      {/* Output the Supplier Location */}
      <Marker
        key={1}
        position={delLocation}
        icon={LocalShipping}
        title="Supplier"
        // onClick={() => props.onMarkerClick(marker)}
      />
    </GoogleMap>
  );
}

Map.defaultProps = {
  mapContainerStyle: {
    height: '400px',
    width: '800px',
  },
  children: null,
  onLoad: () => {},
  onDragEndFunc: () => {},
  onDragStartFunc: () => {},
  onZoomChangeFunc: () => {},
};

export default Map2;
