/* eslint-disable */
import React, { createContext, useContext, useState } from 'react';

const RouteContext = createContext();

export function RouteProvider({ children }) {
  const [savedRoute, setSavedRoute] = useState(null);
  const [originalRoute, setOriginalRoute] = useState(null);
  const [alternateRoute, setAlternateRoute] = useState(null);
  const [selectedWaypoints, setSelectedWaypoints] = useState([]);
  const [avoidanceZones, setAvoidanceZones] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('original');

  const saveRoute = (route) => {
    setSavedRoute(route);
  };

  // Enhanced function to save both routes and related data
  const saveRouteData = ({ 
    original, 
    alternate, 
    waypoints = [], 
    avoidanceZones = [], 
    selectedRouteType = 'original' 
  }) => {
    setOriginalRoute(original);
    setAlternateRoute(alternate);
    setSelectedWaypoints(waypoints);
    setAvoidanceZones(avoidanceZones);
    setSelectedRoute(selectedRouteType);
    
    // For MonitorView, prefer alternate route if available, otherwise use original
    const routeForMonitor = alternate || original;
    setSavedRoute(routeForMonitor);
  };

  // Get the preferred route for monitoring (alternate if available)
  const getMonitorRoute = () => {
    return alternateRoute || originalRoute || savedRoute;
  };

  // Get all route data
  const getRouteData = () => ({
    originalRoute,
    alternateRoute,
    selectedWaypoints,
    avoidanceZones,
    selectedRoute,
    monitorRoute: getMonitorRoute()
  });

  return (
    <RouteContext.Provider value={{ 
      savedRoute, 
      originalRoute,
      alternateRoute,
      selectedWaypoints,
      avoidanceZones,
      selectedRoute,
      saveRoute,
      saveRouteData,
      getMonitorRoute,
      getRouteData
    }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
} 