import React from 'react';
import { Polyline } from '@react-google-maps/api';

const RouteOptimizationLayer = ({ routes, isOptimizing }) => {
  if (!routes || !isOptimizing) return null;

  return routes.map((route, index) => (
    <Polyline
      key={`route-${index}`}
      path={route.path}
      options={{
        strokeColor: route.isOptimal ? '#4CAF50' : '#FF9800',
        strokeOpacity: 0.6,
        strokeWeight: 3,
        icons: [{
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 3,
          },
          offset: '50%',
          repeat: '100px',
        }],
      }}
    />
  ));
};

export default React.memo(RouteOptimizationLayer); 