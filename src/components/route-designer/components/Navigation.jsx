/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRoute } from '../RouteContext';

// Utility functions for route state management
const saveRouteStateToBackend = async (routeState) => {
  try {
    // Get start and end addresses from localStorage
    const routeDesignerState = JSON.parse(localStorage.getItem('routeDesignerState') || '{}');
    const startPoint = routeDesignerState.start || '';
    const endPoint = routeDesignerState.end || '';
    
    console.log('Route Designer State:', routeDesignerState);
    console.log('Start/End Points:', { startPoint, endPoint });
    console.log('Original Route Data:', routeState.originalRoute);
    
    // Helper function to parse coordinates from address string or get from route data
    const parseCoordinates = (addressString, routeData) => {
      console.log(`Parsing coordinates for: "${addressString}"`);
      
      // Try to extract coordinates from the route data first
      if (routeData && routeData.routes && routeData.routes[0] && routeData.routes[0].legs && routeData.routes[0].legs[0]) {
        const leg = routeData.routes[0].legs[0];
        console.log('Route leg data:', leg);
        
        if (addressString.includes('start') || addressString === startPoint) {
          const startLoc = leg.start_location;
          console.log('Using start location:', startLoc);
          // Check if it's a Google Maps LatLng object with methods
          if (typeof startLoc.lat === 'function' && typeof startLoc.lng === 'function') {
            return [startLoc.lng(), startLoc.lat()]; // Call the methods
          } else if (startLoc.lat && startLoc.lng) {
            return [startLoc.lng, startLoc.lat]; // Direct properties
          }
        } else {
          const endLoc = leg.end_location;
          console.log('Using end location:', endLoc);
          // Check if it's a Google Maps LatLng object with methods
          if (typeof endLoc.lat === 'function' && typeof endLoc.lng === 'function') {
            return [endLoc.lng(), endLoc.lat()]; // Call the methods
          } else if (endLoc.lat && endLoc.lng) {
            return [endLoc.lng, endLoc.lat]; // Direct properties
          }
        }
      }
      
      // Fallback: try to parse from address string if it's in "lat,lng" format
      const coordMatch = addressString.match(/^([-+]?\d*\.\d+),\s*([-+]?\d*\.\d+)$/);
      if (coordMatch) {
        console.log('Parsed coordinates from string:', coordMatch);
        return [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])]; // [lng, lat]
      }
      
      // Default coordinates (Greeley, CO)
      console.log('Using default coordinates');
      return [-104.7091, 40.4233];
    };

    // Extract coordinates from originalRoute if available
    const startCoords = parseCoordinates(startPoint, routeState.originalRoute);
    const endCoords = parseCoordinates(endPoint, routeState.originalRoute);
    
    console.log('Extracted coordinates:', { startCoords, endCoords });

    // Process waypoints with better error handling
    const processWaypoints = (waypoints, prefix = 'Waypoint') => {
      if (!waypoints || !Array.isArray(waypoints)) return [];
      
      return waypoints.map((waypoint, index) => {
        console.log(`Processing ${prefix} ${index}:`, waypoint);
        
        let coords;
        if (waypoint.position && waypoint.position.lng && waypoint.position.lat) {
          coords = [waypoint.position.lng, waypoint.position.lat];
        } else if (waypoint.lng && waypoint.lat) {
          coords = [waypoint.lng, waypoint.lat];
        } else {
          console.warn(`Invalid waypoint coordinates for ${prefix} ${index}:`, waypoint);
          coords = [-104.7091, 40.4233]; // Default
        }
        
        return {
          coordinates: coords,
          id: waypoint.id || `${prefix.toLowerCase()}_${index}`,
          index: index,
          address: waypoint.address || `${prefix} ${index + 1}`
        };
      });
    };

    const processedSelectedWaypoints = processWaypoints(routeState.selectedWaypoints, 'Waypoint');
    const processedAdditionalWaypoints = processWaypoints(routeState.additionalWaypoints || [], 'Additional');

    const requestData = {
      routeName: `temp_route_${Date.now()}`,
      routeDescription: 'Temporary route for view switching',
      supplierName: 'System',
      projectName: 'Temporary',
      originator: 'System',
      startPoint: {
        address: startPoint,
        coordinates: {
          type: "Point",
          coordinates: startCoords
        }
      },
      endPoint: {
        address: endPoint,
        coordinates: {
          type: "Point", 
          coordinates: endCoords
        }
      },
      selectedWaypoints: processedSelectedWaypoints,
      additionalWaypoints: processedAdditionalWaypoints,
      originalRoute: routeState.originalRoute,
      alternateRoute: routeState.alternateRoute,
      avoidanceZones: routeState.avoidanceZones || [],
      coordinates: routeState.coordinates,
      selectedRoute: routeState.selectedRoute || 'original',
      isRouteCalculated: routeState.isRouteCalculated || false,
      isTemporary: true,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };

    console.log('Full request data being sent:', JSON.stringify(requestData, null, 2));

    const response = await fetch(`${process.env.REACT_APP_API_URL}api/routes/temp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData);
      throw new Error(`Failed to save route state: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Backend success response:', result);
    
    // Try different possible field names for the route ID
    const routeId = result.routeId || result._id || result.id || result.route?._id || result.route?.id;
    console.log('Extracted route ID:', routeId);
    
    if (!routeId) {
      console.error('No route ID found in response:', result);
      throw new Error('Backend did not return a valid route ID');
    }
    
    return routeId;
  } catch (error) {
    console.error('Error saving route state to backend:', error);
    throw error;
  }
};

// Add the 3D button style
const button3DStyle = `
  .button-3d {
    position: relative;
    border: 2px solid #000;
    border-right-width: 4px;
    border-bottom-width: 4px;
    transition: all 0.1s ease;
  }

  .button-3d:active {
    transform: translateY(2px);
    border-right-width: 2px;
    border-bottom-width: 2px;
  }

  .button-3d:hover {
    filter: brightness(1.1);
  }
`;

// Add the style to the document
const buttonStyleSheet = document.createElement("style");
buttonStyleSheet.innerText = button3DStyle;
document.head.appendChild(buttonStyleSheet);

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSaving, setIsSaving] = useState(false);
  const { 
    originalRoute, 
    alternateRoute, 
    selectedWaypoints, 
    additionalWaypoints,
    avoidanceZones, 
    coordinates, 
    selectedRoute,
    isRouteCalculated 
  } = useRoute();

  const handleSwitchToMonitorView = async () => {
    try {
      // Check if we're on the designer page and have route data to save
      if (location.pathname === '/') {
        // Check if we have meaningful route data
        const hasRouteData = originalRoute || 
                            alternateRoute || 
                            selectedWaypoints.length > 0 || 
                            additionalWaypoints.length > 0 ||
                            avoidanceZones.length > 0;

        if (hasRouteData) {
          const userConfirmed = window.confirm(
            'Do you want to save your current route data so it can be used in Monitor View?'
          );

          if (userConfirmed) {
            // Set loading state and cursor
            setIsSaving(true);
            document.body.style.cursor = 'wait';
            
            // Get route data from context instead of localStorage
            const routeState = {
              originalRoute,
              alternateRoute,
              selectedWaypoints,
              additionalWaypoints,
              avoidanceZones,
              coordinates,
              selectedRoute,
              isRouteCalculated,
              // Get basic state from localStorage
              startPoint: JSON.parse(localStorage.getItem('routeDesignerState') || '{}').start || '',
              endPoint: JSON.parse(localStorage.getItem('routeDesignerState') || '{}').end || '',
            };

            console.log('Navigation - Saving route state:', routeState);

            // Only save if we have meaningful route data
            if (routeState.originalRoute || routeState.alternateRoute || routeState.selectedWaypoints.length > 0) {
              try {
                const tempRouteId = await saveRouteStateToBackend(routeState);
                localStorage.setItem('tempRouteId', tempRouteId);
                console.log('Navigation - Route data saved with ID:', tempRouteId);
                alert('Route data saved successfully! You can now safely switch to Monitor View.');
              } catch (error) {
                console.error('Failed to save route data:', error);
                const shouldProceed = window.confirm(
                  'Failed to save route data to server. Do you want to proceed to Monitor View anyway? (You may lose your current route data)'
                );
                if (!shouldProceed) {
                  setIsSaving(false);
                  document.body.style.cursor = 'default';
                  return;
                }
              } finally {
                setIsSaving(false);
                document.body.style.cursor = 'default';
              }
            }
          }
        }
      }

      // Navigate to monitor view
      navigate('/monitor');
    } catch (error) {
      console.error('Error switching to monitor view:', error);
      setIsSaving(false);
      document.body.style.cursor = 'default';
      // Still allow navigation even if save fails
      navigate('/monitor');
    }
  };

  const toggleView = () => {
    if (location.pathname === '/') {
      handleSwitchToMonitorView();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fixed top-52 left-2 z-20 flex flex-col gap-2 w-68">
      <button
        type="button"
        onClick={toggleView}
        className={`px-4 py-1 rounded button-3d shadow transition-all duration-200 flex items-center gap-2 ${
          isSaving 
            ? 'bg-gray-400 cursor-wait text-black font-bold' 
            : 'bg-green-500 hover:bg-green-600 text-black font-bold'
        }`}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Saving...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <title>Switch View Icon</title>
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>{location.pathname === '/' ? 'Switch to Monitor View' : 'Switch to Designer View'}</span>
          </>
        )}
      </button>
    </div>
  );
}

export default Navigation; 