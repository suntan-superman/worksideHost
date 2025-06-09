/* eslint-disable */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useRoute } from './RouteContext';
import { googleMapsConfig } from './config/googleMapsConfig';
import RouteModals from './components/RouteModals';
import axios from 'axios';
import MarkerTypeModal, { MARKER_TYPES } from './components/MarkerTypeModal';

const containerStyle = {
	width: '100%',
	height: 'calc(100vh - 2px)'
};

const defaultCenter = {
	lat: 40.4233, // Greeley, CO
	lng: -104.7091
};

const AVOIDANCE_RADIUS = 500; // Base radius for zones

// Color mapping for different avoidance zone types
const AVOIDANCE_COLORS = {
	residential: '#FF0000', // Red
	school: '#FFA500',      // Orange
	hospital: '#FF00FF',    // Pink
	other: '#808080'        // Gray
};

// Add custom cursor styles
const customCursorStyle = `
  .avoidance-cursor {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid currentColor;
    background-color: transparent;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }

  .avoidance-cursor::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background-color: currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }

  .detour-cursor {
    width: 24px;
    height: 24px;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 1000;
    color: #FFA500;
  }

  .detour-cursor::before {
    content: '📍';
    font-size: 24px;
  }

  .waypoint-cursor {
    width: 24px;
    height: 24px;
    position: fixed;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 1000;
    color: #2196F3;
  }

  .waypoint-cursor::before {
    content: '📌';
    font-size: 24px;
  }

  /* Force cursor styles */
  .map-container * {
    cursor: none !important;
  }
`;

// Add the style to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = customCursorStyle;
document.head.appendChild(styleSheet);

// Add this style at the top of the file after the existing customCursorStyle
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

// Utility function to get color for avoidance zone type
const getAvoidanceZoneColor = (type) => {
	if (!type) return AVOIDANCE_COLORS.other;
	return AVOIDANCE_COLORS[type] || AVOIDANCE_COLORS.other;
};


function RouteDesigner() {
	const { saveRoute, saveRouteData } = useRoute();
	const [directions, setDirections] = useState(null);
	const [startPoint, setStartPoint] = useState('');
	const [endPoint, setEndPoint] = useState('');
	const [startPointLatLng, setStartPointLatLng] = useState(null);
	const [endPointLatLng, setEndPointLatLng] = useState(null);
	const [isDirectionsMinimized, setIsDirectionsMinimized] = useState(false);
	const [panelWidth, setPanelWidth] = useState(350);
	const [isResizing, setIsResizing] = useState(false);
	const [avoidanceZones, setAvoidanceZones] = useState([]);
	const [selectedAvoidanceType, setSelectedAvoidanceType] = useState('residential');
	const [selectedWaypoints, setSelectedWaypoints] = useState([]);
	const [mapKey] = useState(0);
	const [mapZoom] = useState(12);
	const [originalRoute, setOriginalRoute] = useState(null);
	const [alternateRoute, setAlternateRoute] = useState(null);
	const [routeWarning, setRouteWarning] = useState(null);
	const [selectedRoute, setSelectedRoute] = useState('original');
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [isAddingAvoidanceZone, setIsAddingAvoidanceZone] = useState(false);
	const [savedRoutes, setSavedRoutes] = useState([]);
	const [routeName, setRouteName] = useState('');
	const [routeDescription, setRouteDescription] = useState('');
	const [supplierName, setSupplierName] = useState('');
	const [projectName, setProjectName] = useState('');
	const [originator, setOriginator] = useState('');
	const [previewZone, setPreviewZone] = useState(null);
	const [additionalWaypoints, setAdditionalWaypoints] = useState([]);
	const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
	const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
	const [isRouteCalculated, setIsRouteCalculated] = useState(false);
	const [currentDirections, setCurrentDirections] = useState(null);
	const [isSwitchingRoute, setIsSwitchingRoute] = useState(false);
	const [startMarkerType, setStartMarkerType] = useState('distributionCenter');
	const [endMarkerType, setEndMarkerType] = useState('oilWell');
	const [isMarkerTypeModalOpen, setIsMarkerTypeModalOpen] = useState(false);
	const [currentMarkerPointType, setCurrentMarkerPointType] = useState(null);
	const [isSavingRoute, setIsSavingRoute] = useState(false);
	const [isSelectingWaypoints, setIsSelectingWaypoints] = useState(false);
	const [shouldAutoFitBounds, setShouldAutoFitBounds] = useState(true);
	const [isRestoringData, setIsRestoringData] = useState(false);
	const [mapBounds, setMapBounds] = useState(null);

	// Enhanced avoidance zone states
	const [selectedZone, setSelectedZone] = useState(null);
	const [zoneInfoWindow, setZoneInfoWindow] = useState(null);
	const [zoneCreationData, setZoneCreationData] = useState({
		label: '',
		description: '',
		type: 'residential',
		radius: 500
	});
	const [isZoneCreationModalOpen, setIsZoneCreationModalOpen] = useState(false);
	const [pendingZoneLocation, setPendingZoneLocation] = useState(null);

	// State for forcing DirectionsRenderer re-render
	const [directionsKey, setDirectionsKey] = useState(0);

	// Refs
	const mapRef = useRef(null);
	const resizeRef = useRef(null);
	const markersRef = useRef([]);
	const directionsRendererRef = useRef(null);
	const lastCalculationRef = useRef(null);
	const directionsPanelRef = useRef(null);
	const circlesRef = useRef(new Map());

	const { isLoaded } = useJsApiLoader(googleMapsConfig);

	// Add map load/unmount callbacks
	const onMapLoad = useCallback((map) => {
		mapRef.current = map;
	}, []);

	const onMapUnmount = useCallback(() => {
		mapRef.current = null;
	}, []);

	// Add toggleDirections function
	const toggleDirections = useCallback(() => {
		setIsDirectionsMinimized(prev => !prev);
	}, []);

	// Add startResizing function
	const startResizing = useCallback((e) => {
		e.preventDefault();
		setIsResizing(true);
		
		const startX = e.clientX;
		const startWidth = panelWidth;

		const handleMouseMove = (e) => {
			if (!isResizing) return;
			const deltaX = e.clientX - startX;
			const newWidth = Math.max(200, Math.min(600, startWidth + deltaX));
			setPanelWidth(newWidth);
		};

		const handleMouseUp = () => {
			setIsResizing(false);
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}, [isResizing, panelWidth]);

	// Create avoidance zone in standalone collection
	const createAvoidanceZone = useCallback(async (zoneData) => {
		try {
			console.log('Creating standalone avoidance zone:', zoneData);
			
			const apiData = {
				location: {
					coordinates: [zoneData.location.lng, zoneData.location.lat] // GeoJSON format
				},
				type: zoneData.type,
				radius: zoneData.radius,
				label: zoneData.label || `${zoneData.type} Zone`,
				description: zoneData.description || `${zoneData.type} avoidance zone created on ${new Date().toLocaleDateString()}`,
				createdBy: zoneData.createdBy || originator || 'RouteDesigner',
				createdAt: new Date().toISOString(),
				isActive: true
			};

			const response = await axios.post(
				`${process.env.REACT_APP_MONGO_URI}api/routes/avoidance-zones`,
				apiData,
				{
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			console.log('Avoidance zone created successfully:', response.data);
			
			return response.data.zone;
		} catch (error) {
			console.error('Error creating avoidance zone:', error);
			setRouteWarning(`Failed to create avoidance zone: ${error.response?.data?.message || error.message}`);
			return null;
		}
	}, [originator]);

	// Fetch avoidance zones near a location
	const fetchNearbyZones = useCallback(async (lat, lng, maxDistance = 10000) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_MONGO_URI}api/routes/avoidance-zones/nearby`,
				{
					params: { lat, lng, maxDistance }
				}
			);
			
			console.log('Fetched nearby zones:', response.data);
			return response.data;
		} catch (error) {
			console.error('Error fetching nearby zones:', error);
			return [];
		}
	}, []);

	// Load zones for current map view
	const loadZonesForCurrentView = useCallback(async () => {
		if (!mapRef.current) {
			console.log('loadZonesForCurrentView: No map reference');
			return;
		}

		try {
			const bounds = mapRef.current.getBounds();
			if (!bounds) {
				console.log('loadZonesForCurrentView: No map bounds available');
				return;
			}

			const ne = bounds.getNorthEast();
			const sw = bounds.getSouthWest();
			
			// Get center point and calculate radius
			const center = bounds.getCenter();
			const centerLat = center.lat();
			const centerLng = center.lng();
			
			// Calculate approximate radius of the viewport
			const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
				center,
				ne
			);
			
			console.log('Loading zones for map view:', {
				center: { lat: centerLat, lng: centerLng },
				radius: distance,
				bounds: {
					ne: { lat: ne.lat(), lng: ne.lng() },
					sw: { lat: sw.lat(), lng: sw.lng() }
				}
			});

			const zones = await fetchNearbyZones(centerLat, centerLng, distance * 1.2); // Add 20% buffer
			
			console.log('Fetched zones from API:', zones);
			
			// Convert zones from backend format to frontend format
			const convertedZones = zones.map(zone => ({
				id: zone._id,
				_id: zone._id,
				location: {
					lat: zone.location.coordinates[1], // latitude from GeoJSON
					lng: zone.location.coordinates[0]  // longitude from GeoJSON
				},
				type: zone.type,
				radius: zone.radius,
				label: zone.label,
				description: zone.description,
				createdBy: zone.createdBy,
				createdAt: zone.createdAt,
				isActive: zone.isActive
			}));

			console.log('Setting avoidance zones from standalone collection:', convertedZones);
			setAvoidanceZones(convertedZones);
			
		} catch (error) {
			console.error('Error loading zones for current view:', error);
		}
	}, [fetchNearbyZones]);

	// Delete avoidance zone from standalone collection
	const deleteAvoidanceZone = useCallback(async (zoneId) => {
		try {
			console.log('Deleting standalone avoidance zone:', zoneId);
			
			await axios.delete(`${process.env.REACT_APP_MONGO_URI}api/routes/avoidance-zones/${zoneId}`);
			
			console.log('Avoidance zone deleted successfully');
			
			// Remove from local state and map
			setAvoidanceZones(prev => prev.filter(zone => zone._id !== zoneId));
			
			// Remove circle from map
			console.log('Attempting to remove circle for zoneId:', zoneId);
			console.log('Available circle keys:', Array.from(circlesRef.current.keys()));
			
			// Try both the _id and id as keys since they should be the same
			let circleRemoved = false;
			
			if (circlesRef.current.has(zoneId)) {
				const circle = circlesRef.current.get(zoneId);
				console.log('Found circle using zoneId:', zoneId);
				if (circle && typeof circle.setMap === 'function') {
					circle.setMap(null);
					console.log('Circle removed from map using zoneId');
				}
				circlesRef.current.delete(zoneId);
				circleRemoved = true;
			}
			
			// Also try using the zone.id if it exists and is different
			const zone = avoidanceZones.find(z => z._id === zoneId);
			if (zone && zone.id && zone.id !== zoneId && circlesRef.current.has(zone.id)) {
				const circle = circlesRef.current.get(zone.id);
				console.log('Found circle using zone.id:', zone.id);
				if (circle && typeof circle.setMap === 'function') {
					circle.setMap(null);
					console.log('Circle removed from map using zone.id');
				}
				circlesRef.current.delete(zone.id);
				circleRemoved = true;
			}
			
			if (!circleRemoved) {
				console.warn('No circle found to remove for zoneId:', zoneId);
			}
			
			return true;
		} catch (error) {
			console.error('Error deleting avoidance zone:', error);
			setRouteWarning(`Failed to delete avoidance zone: ${error.response?.data?.message || error.message}`);
			return false;
		}
	}, []);

	// Get routes affected by an avoidance zone
	const getAffectedRoutes = useCallback(async (zoneId) => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_MONGO_URI}api/routes/avoidance-zones/${zoneId}/affected-routes`
			);
			return response.data || [];
		} catch (error) {
			console.error('Error fetching affected routes:', error);
			return [];
		}
	}, []);

	// Remove avoidance zone (UI wrapper for deleteAvoidanceZone)
	const removeAvoidanceZone = useCallback(async (zoneId) => {
		console.log('Removing avoidance zone:', zoneId);
		
		// Get affected routes first
		const affectedRoutes = await getAffectedRoutes(zoneId);
		
		// Find the zone details for better confirmation message
		const zone = avoidanceZones.find(z => z._id === zoneId);
		const zoneName = zone?.label || `${zone?.type} zone`;
		
		let confirmMessage = `Are you sure you want to delete "${zoneName}"?\n\n`;
		
		if (affectedRoutes.length > 0) {
			confirmMessage += `⚠️  WARNING: This zone affects ${affectedRoutes.length} route(s):\n\n`;
			affectedRoutes.slice(0, 5).forEach(route => {
				confirmMessage += `• ${route.routeName || route.name}\n`;
			});
			if (affectedRoutes.length > 5) {
				confirmMessage += `• ... and ${affectedRoutes.length - 5} more routes\n`;
			}
			confirmMessage += `\nDeleting this zone will remove it from all affected routes.`;
		} else {
			confirmMessage += 'This zone is not currently used by any routes.';
		}
		
		confirmMessage += '\n\nThis action cannot be undone.';
		
		const confirmDelete = window.confirm(confirmMessage);
		
		if (!confirmDelete) return;
		
		const success = await deleteAvoidanceZone(zoneId);
		if (success) {
			let successMessage = 'Avoidance zone deleted successfully.';
			if (affectedRoutes.length > 0) {
				successMessage += ` Removed from ${affectedRoutes.length} route(s).`;
			}
			setRouteWarning(successMessage);
			setTimeout(() => setRouteWarning(null), 5000);
		}
	}, [deleteAvoidanceZone, getAffectedRoutes, avoidanceZones]);

	// Create avoidance zone in standalone collection - forward declaration
	const createAvoidanceZoneForward = useCallback(async (zoneData) => {
		return await createAvoidanceZone(zoneData);
	}, []);

	// Update createAvoidanceZone with proper dependencies
	useEffect(() => {
		// Update the forward declaration when loadZonesForCurrentView changes
	}, [loadZonesForCurrentView]);

	// Add effect to manage circles
	useEffect(() => {
		console.log('Avoidance zones useEffect triggered:', {
			mapLoaded: !!mapRef.current,
			googleLoaded: !!window.google,
			avoidanceZonesCount: avoidanceZones.length,
			avoidanceZonesData: avoidanceZones
		});
		
		if (!mapRef.current || !window.google) return;

		// Clear existing circles safely
		for (const [circle] of circlesRef.current) {
			try {
				if (circle && typeof circle.setMap === 'function') {
					circle.setMap(null);
				}
			} catch (error) {
				console.error('Error removing circle during cleanup:', error);
			}
		}
		circlesRef.current.clear();

		// Create new circles for current zones
		for (const zone of avoidanceZones) {
			try {
				const circle = new window.google.maps.Circle({
					center: zone.location,
					radius: zone.radius,
					fillColor: getAvoidanceZoneColor(zone.type),
					fillOpacity: 0.35,
					strokeColor: getAvoidanceZoneColor(zone.type),
					strokeOpacity: 0.8,
					strokeWeight: 2,
					zIndex: 1,
					clickable: true, // Make circles clickable
					editable: false,
					draggable: false,
					map: mapRef.current
				});

				// Add click listener for info window
				circle.addListener('click', (event) => {
					// Close any existing info window
					if (zoneInfoWindow) {
						zoneInfoWindow.close();
					}

					// Create info window content
					const createdDate = zone.createdAt ? new Date(zone.createdAt).toLocaleDateString() : 'Unknown';
					const content = `
						<div style="max-width: 300px; font-family: Arial, sans-serif;">
							<h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">
								${zone.label || `${zone.type} Zone`}
							</h3>
							<div style="margin-bottom: 8px;">
								<strong>Type:</strong> <span style="text-transform: capitalize;">${zone.type}</span>
							</div>
							<div style="margin-bottom: 8px;">
								<strong>Radius:</strong> ${zone.radius}m
							</div>
							<div style="margin-bottom: 8px;">
								<strong>Created by:</strong> ${zone.createdBy || 'Unknown'}
							</div>
							<div style="margin-bottom: 8px;">
								<strong>Created on:</strong> ${createdDate}
							</div>
							${zone.description ? `
								<div style="margin-bottom: 12px;">
									<strong>Description:</strong><br>
									<span style="color: #666; font-style: italic;">${zone.description}</span>
								</div>
							` : ''}
							<div style="text-align: center; margin-top: 12px;">
								<button 
									onclick="window.editZone('${zone._id}')" 
									style="background: #4CAF50; color: white; border: none; padding: 6px 12px; margin-right: 8px; border-radius: 4px; cursor: pointer; font-size: 12px;"
								>
									Edit
								</button>
								<button 
									onclick="window.deleteZone('${zone._id}')" 
									style="background: #f44336; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;"
								>
									Delete
								</button>
							</div>
						</div>
					`;

					// Create and open info window
					const infoWindow = new window.google.maps.InfoWindow({
						content: content,
						position: event.latLng
					});

					infoWindow.open(mapRef.current);
					setZoneInfoWindow(infoWindow);
					setSelectedZone(zone);
				});

				circlesRef.current.set(zone.id, circle);
				console.log('Circle created for zone.id:', zone.id, 'zone._id:', zone._id);
			} catch (error) {
				console.error('Error creating circle for zone:', zone.id, error);
			}
		}

		// Cleanup function
		return () => {
				// eslint-disable-next-line
			for (const [circle] of circlesRef.current) {
				try {
					if (circle && typeof circle.setMap === 'function') {
						circle.setMap(null);
					}
				} catch (error) {
					console.error('Error cleaning up circle:', error);
				}
			}
			circlesRef.current.clear();
		};
	}, [avoidanceZones]);

	// Add effect to manage preview circle
	useEffect(() => {
		if (!mapRef.current || !window.google || !previewZone) {
			// Clean up preview circle if it exists
			if (circlesRef.current.has('preview')) {
				const circle = circlesRef.current.get('preview');
				circle.setMap(null);
				circlesRef.current.delete('preview');
			}
			return;
		}

		// Create or update preview circle
		if (circlesRef.current.has('preview')) {
			const circle = circlesRef.current.get('preview');
			circle.setCenter(previewZone.location);
			circle.setRadius(previewZone.radius);
			circle.setOptions({
				fillColor: getAvoidanceZoneColor(previewZone.type),
				strokeColor: getAvoidanceZoneColor(previewZone.type)
			});
		} else {
			const circle = new window.google.maps.Circle({
				center: previewZone.location,
				radius: previewZone.radius,
				fillColor: getAvoidanceZoneColor(previewZone.type),
				fillOpacity: 0.35,
				strokeColor: getAvoidanceZoneColor(previewZone.type),
				strokeOpacity: 0.8,
				strokeWeight: 2,
				zIndex: 1,
				clickable: false,
				editable: false,
				draggable: false,
				map: mapRef.current
			});
			circlesRef.current.set('preview', circle);
		}

		// Cleanup function
		return () => {
			if (circlesRef.current.has('preview')) {
				const circle = circlesRef.current.get('preview');
				circle.setMap(null);
				// eslint-disable-next-line
				circlesRef.current.delete('preview');
			}
		};
	}, [previewZone]);

	// Define marker icons as a constant
	const MARKER_ICONS = {
		distributionCenter: {
			path: "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z",
			fillColor: "#1976d2",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#000000",
			scale: 1.5,
			anchor: null, // Will be set after Google Maps loads
			labelOrigin: null // Will be set after Google Maps loads
		},
		destination: {
			path: "M11.8 5c0-1.65 1.35-3 3-3s3 1.35 3 3h2c0-2.76-2.24-5-5-5s-5 2.24-5 5m5 1L6 21h12L7 6h9.8zM3 21h18v2H3v-2z",
			fillColor: "#f44336",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#000000",
			scale: 1.5,
			anchor: null, // Will be set after Google Maps loads
			labelOrigin: null // Will be set after Google Maps loads
		}
	};

	// Initialize marker icons when Google Maps is loaded
 	useEffect(() => {
		if (isLoaded && window.google) {
			// Set the anchor and labelOrigin points after Google Maps is loaded
				// eslint-disable-next-line
			const updatedIcons = {
				distributionCenter: {
					...MARKER_ICONS.distributionCenter,
					anchor: new window.google.maps.Point(12, 12),
					labelOrigin: new window.google.maps.Point(12, 0)
				},
				destination: {
					...MARKER_ICONS.destination,
					anchor: new window.google.maps.Point(12, 12),
					labelOrigin: new window.google.maps.Point(12, 0)
				}
			};

		}
		// eslint-disable-next-line
		}, [isLoaded]);

	// Add effect to monitor route calculation state
	useEffect(() => {
		console.log('Route calculation state:', {
			isRouteCalculated,
			hasCurrentDirections: !!currentDirections,
			directions: currentDirections
		});
	}, [isRouteCalculated, currentDirections]);

	// Add global functions for info window buttons
	useEffect(() => {
		window.editZone = (zoneId) => {
			const zone = avoidanceZones.find(z => z._id === zoneId);
			if (zone) {
				setZoneCreationData({
					label: zone.label || '',
					description: zone.description || '',
					type: zone.type || 'residential',
					radius: zone.radius || 500
				});
				setPendingZoneLocation(zone.location);
				setIsZoneCreationModalOpen(true);
			}
		};

		window.deleteZone = (zoneId) => {
			if (zoneInfoWindow) {
				zoneInfoWindow.close();
			}
			removeAvoidanceZone(zoneId);
		};

		return () => {
			delete window.editZone;
			delete window.deleteZone;
		};
	}, [avoidanceZones, zoneInfoWindow, removeAvoidanceZone]);

	const directionsCallback = useCallback((response) => {
		if (response !== null && response.status === 'OK') {
			// Only set directions if they're different from current directions
			if (!directions || JSON.stringify(directions) !== JSON.stringify(response)) {
				// console.log('Setting directions:', response);
				setDirections(response);
				saveRoute(response);
				
				// Set route calculation state
				// console.log('Setting route as calculated');
				setIsRouteCalculated(true);
				setCurrentDirections(response);
				
				// Extract and save the actual coordinates
				const route = response.routes[0];
				const startLocation = route.legs[0].start_location;
				const endLocation = route.legs[0].end_location;

				// Calculate total distance and duration
				const totalDistance = route.legs[0].distance.text;
				const totalDuration = route.legs[0].duration.text;
				const waypointCount = selectedWaypoints.length;

				// console.log('Route calculated successfully:', {
				// 	distance: totalDistance,
				// 	duration: totalDuration,
				// 	waypoints: waypointCount
				// });

				const coordinates = {
					start: {
						lat: startLocation.lat(),
						lng: startLocation.lng(),
						address: startPoint
					},
					end: {
						lat: endLocation.lat(),
						lng: endLocation.lng(),
						address: endPoint
					}
				};

				// Save to localStorage
				localStorage.setItem('lastUsedCoordinates', JSON.stringify(coordinates));

			}
		} else {
			console.error('Directions request failed:', response?.status);
			setRouteWarning(`Error: ${response?.status}`);
			setIsRouteCalculated(false);
			setCurrentDirections(null);
		}
	}, [saveRoute, startPoint, endPoint, selectedWaypoints, directions]);

	// eslint-disable-next-line
	const calculateIntermediatePoints = useCallback((start, end, zone, offsetMultiplier = 2.5) => {
		const points = [];
		const startLatLng = new window.google.maps.LatLng(start.lat, start.lng);
		const endLatLng = new window.google.maps.LatLng(end.lat, end.lng);
		const zoneLatLng = new window.google.maps.LatLng(zone.location.lat, zone.location.lng);

		// console.log('Calculating intermediate points with:');
		// console.log('Start:', startLatLng.toString());
		// console.log('End:', endLatLng.toString());
		// console.log('Zone:', zoneLatLng.toString());
		// console.log('Offset multiplier:', offsetMultiplier);

		// Calculate the bearing from start to end
		const routeBearing = window.google.maps.geometry.spherical.computeHeading(startLatLng, endLatLng);
		// console.log('Route bearing:', routeBearing);
		
		// Calculate the distance from start to end
		const totalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng);
		// console.log('Total distance:', totalDistance);
		
		// Calculate the distance from the zone to the route
		const numPoints = 10;
		let minDistance = Number.POSITIVE_INFINITY;
		let closestFraction = 0;
		let closestPoint = null;
		
		for (let i = 0; i <= numPoints; i++) {
			const fraction = i / numPoints;
			const routePoint = window.google.maps.geometry.spherical.computeOffset(
				startLatLng,
				totalDistance * fraction,
				routeBearing
			);
			const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
				zoneLatLng,
				routePoint
			);
			if (distance < minDistance) {
				minDistance = distance;
				closestFraction = fraction;
				closestPoint = routePoint;
			}
		}
		
		// console.log('Minimum zone to route distance:', minDistance);
		// console.log('Closest fraction along route:', closestFraction);

		// Use a more lenient threshold based on the total route distance
		const distanceThreshold = Math.min(totalDistance * 0.3, AVOIDANCE_RADIUS * 5);
		// console.log('Distance threshold:', distanceThreshold);

		// If the zone is far from the route, no need for intermediate points
		if (minDistance > distanceThreshold) {
			// console.log('Zone too far from route, skipping waypoints');
			return points;
		}

		// Calculate the bearing from zone to the closest point on the route
		const zoneToRouteBearing = window.google.maps.geometry.spherical.computeHeading(
			zoneLatLng,
			closestPoint
		);
		// console.log('Zone to route bearing:', zoneToRouteBearing);

		// Calculate base offset distance based on the zone's distance from route
		const baseOffset = Math.max(minDistance * 1.2, AVOIDANCE_RADIUS);
		// Scale the maximum offset with the multiplier more aggressively
		const maxOffset = Math.min(
			totalDistance * 0.2, // Increased from 0.15 to 0.2
			baseOffset * (3 + offsetMultiplier) // More aggressive scaling
		);
		// Scale the offset distance more aggressively with the multiplier
		const offsetDistance = Math.min(
			baseOffset * (1.5 + offsetMultiplier * 0.5), // More aggressive base scaling
			maxOffset
		);
		// console.log('Base offset:', baseOffset);
		// console.log('Max offset:', maxOffset);
		// console.log('Final offset distance:', offsetDistance);

		// Determine if the zone is on the left or right side of the route
		const zoneToRouteVector = {
			lat: closestPoint.lat() - zoneLatLng.lat(),
			lng: closestPoint.lng() - zoneLatLng.lng()
		};
		const routeVector = {
			lat: endLatLng.lat() - startLatLng.lat(),
			lng: endLatLng.lng() - startLatLng.lng()
		};
		const crossProduct = zoneToRouteVector.lat * routeVector.lng - zoneToRouteVector.lng * routeVector.lat;
		const isZoneOnLeft = crossProduct > 0;
		// console.log('Zone is on left side of route:', isZoneOnLeft);

		// Calculate the angle between the route and the zone-to-route vector
		const routeAngle = Math.atan2(routeVector.lng, routeVector.lat) * 180 / Math.PI;
		const zoneToRouteAngle = Math.atan2(zoneToRouteVector.lng, zoneToRouteVector.lat) * 180 / Math.PI;
		const angleDiff = (zoneToRouteAngle - routeAngle + 360) % 360;
		// console.log('Route angle:', routeAngle);
		// console.log('Zone to route angle:', zoneToRouteAngle);
		// console.log('Angle difference:', angleDiff);

		// Calculate the perpendicular angle to the route at the closest point
		const perpendicularAngle = (routeBearing + (isZoneOnLeft ? 90 : -90)) % 360;
		// console.log('Perpendicular angle:', perpendicularAngle);

		// Create points at different angles around the zone
		// Use angles that create a better arc based on the zone's position and route direction
		const baseAngles = isZoneOnLeft ? 
			[-30, -15, 0, 15, 30] : // Zone is on left, create waypoints on right
			[150, 165, 180, 195, 210]; // Zone is on right, create waypoints on left

		// Add more angles for higher multipliers, but keep them in a tighter arc
		const angles = offsetMultiplier > 4 ? 
			(isZoneOnLeft ? 
				[-45, -30, -15, 0, 15, 30, 45] : // More angles on right side
				[135, 150, 165, 180, 195, 210, 225]) : // More angles on left side
			baseAngles;

		for (const angle of angles) {
			// Calculate waypoint bearing relative to the perpendicular angle
			const waypointBearing = (perpendicularAngle + angle) % 360;
			
			// Calculate waypoint at offsetDistance from the zone
			const waypoint = window.google.maps.geometry.spherical.computeOffset(
				zoneLatLng,
				offsetDistance,
				waypointBearing
			);

			// console.log(`Calculated waypoint for angle ${angle}:`, waypoint.toString());

			// Only add points that are reasonably between start and end
			const waypointToStart = window.google.maps.geometry.spherical.computeDistanceBetween(waypoint, startLatLng);
			const waypointToEnd = window.google.maps.geometry.spherical.computeDistanceBetween(waypoint, endLatLng);
			
			// Ensure the waypoint is not too far from the route
			const waypointToRoute = Math.min(
				window.google.maps.geometry.spherical.computeDistanceBetween(waypoint, closestPoint),
				window.google.maps.geometry.spherical.computeDistanceBetween(waypoint, startLatLng),
				window.google.maps.geometry.spherical.computeDistanceBetween(waypoint, endLatLng)
			);
			
			// Adjust flexibility based on multiplier more aggressively
			const maxRouteDistance = totalDistance * (0.2 + offsetMultiplier * 0.1); // Increased base and scaling
			const maxTotalDistance = totalDistance * (1.2 + offsetMultiplier * 0.2); // Increased base and scaling
			
			// Calculate the angle between the waypoint and the route
			const waypointVector = {
				lat: waypoint.lat() - closestPoint.lat(),
				lng: waypoint.lng() - closestPoint.lng()
			};
			const waypointAngle = Math.atan2(waypointVector.lng, waypointVector.lat) * 180 / Math.PI;
			
			// Calculate the angle difference between the waypoint and route
			// Normalize both angles to 0-360 range
			const normalizedWaypointAngle = (waypointAngle + 360) % 360;
			const normalizedRouteAngle = (routeAngle + 360) % 360;
			
			// Calculate the smallest angle difference
			let angleDifference = Math.abs(normalizedWaypointAngle - normalizedRouteAngle);
			if (angleDifference > 180) {
				angleDifference = 360 - angleDifference;
			}
			
			// Adjust the angle threshold based on the multiplier
			const maxAngleDifference = 90 + (offsetMultiplier * 5); // Allow up to 90-115 degrees depending on multiplier
			
			// Only add waypoints that create a reasonable detour angle
			if (waypointToStart + waypointToEnd <= maxTotalDistance &&
				waypointToRoute <= maxRouteDistance &&
				angleDifference <= maxAngleDifference) {
				points.push(waypoint);
				// console.log('Added waypoint:', waypoint.toString());
				// console.log('Angle difference:', angleDifference);
			} else {
				console.log('Waypoint rejected:', {
					tooFar: waypointToStart + waypointToEnd > maxTotalDistance,
					tooFarFromRoute: waypointToRoute > maxRouteDistance,
					angleTooSharp: angleDifference > maxAngleDifference,
					angleDifference,
					maxAngleDifference,
					normalizedWaypointAngle,
					normalizedRouteAngle
				});
			}
		}

		// Sort points by distance from start to ensure proper sequence
		points.sort((a, b) => {
			const distA = window.google.maps.geometry.spherical.computeDistanceBetween(startLatLng, a);
			const distB = window.google.maps.geometry.spherical.computeDistanceBetween(startLatLng, b);
			return distA - distB;
		});

		// console.log('Final points array:', points);
		return points;
	}, []);

	const calculateRoute = useCallback(() => {
		if (!startPointLatLng || !endPointLatLng) {
			// console.log('Missing coordinates:', { start: startPointLatLng, end: endPointLatLng });
			setRouteWarning("Please enter both start and end points");
			return;
		}

		// Prevent duplicate calculations
		const now = Date.now();
		if (lastCalculationRef.current && now - lastCalculationRef.current < 1000) {
			// console.log('Skipping duplicate calculation');
			return;
		}
		lastCalculationRef.current = now;

		const directionsService = new window.google.maps.DirectionsService();
		
		// First, calculate the original route without waypoints
		const originalRequest = {
			origin: startPointLatLng,
			destination: endPointLatLng,
			travelMode: window.google.maps.TravelMode.DRIVING,
			provideRouteAlternatives: true // Request alternative routes
		};

		// Combine all waypoints for routing
		// console.log('Selected waypoints:', selectedWaypoints);
		const waypointMarkers = selectedWaypoints.map(point => ({
			location: new window.google.maps.LatLng(point.lat, point.lng),
			stopover: false
		}));

		const alternateRequest = {
			origin: startPointLatLng,
			destination: endPointLatLng,
			waypoints: waypointMarkers,
			travelMode: window.google.maps.TravelMode.DRIVING,
			optimizeWaypoints: false,
			provideRouteAlternatives: true // Request alternative routes
		};

		// Calculate both routes with proper error handling
		Promise.all([
			new Promise((resolve, reject) => {
				directionsService.route(originalRequest, (response, status) => {
					if (status === 'OK' && response) {
						resolve(response);
					} else {
						reject(new Error(`Original route request failed: ${status}`));
					}
				});
			}),
			new Promise((resolve, reject) => {
				if (waypointMarkers.length === 0) {
					resolve(null); // Skip alternate route if no waypoints
				} else {
					directionsService.route(alternateRequest, (response, status) => {
						if (status === 'OK' && response) {
							resolve(response);
						} else {
							reject(new Error(`Alternate route request failed: ${status}`));
						}
					});
				}
			})
		])
		.then(([originalResponse, alternateResponse]) => {
			// console.log('Routes received:', {
			// 	original: originalResponse?.routes[0],
			// 	alternate: alternateResponse?.routes[0]
			// });

			// Store both routes
			setOriginalRoute(originalResponse);
			setAlternateRoute(alternateResponse);
			
			// Save all route data to context for monitor view
			saveRouteData({
				original: originalResponse,
				alternate: alternateResponse,
				waypoints: selectedWaypoints,
				additionalWaypoints: additionalWaypoints,
				avoidanceZones: avoidanceZones,
				selectedRoute: selectedRoute,
				isRouteCalculated: isRouteCalculated,
				isTemporary: true, // Flag to identify this as a temporary save
				createdAt: new Date().toISOString()
			});
			
			// Set the initial route based on selection
			const initialRoute = selectedRoute === 'original' ? originalResponse : alternateResponse;
			if (initialRoute) {
				// Ensure we have a valid directions object
				if (initialRoute.routes && initialRoute.routes.length > 0) {
					setCurrentDirections(initialRoute);
					setDirections(initialRoute);
					setIsRouteCalculated(true);
				} else {
					console.error('Invalid route response:', initialRoute);
					setRouteWarning('Invalid route response. Please try again.');
					setIsRouteCalculated(false);
				}
			} else {
				setRouteWarning("No valid route found. Please check your start and end points.");
				setIsRouteCalculated(false);
			}
		})
		.catch(error => {
			console.error('Error calculating routes:', error);
			setRouteWarning(`Error: ${error.message}. Please check your route points and try again.`);
			setDirections(null);
			setCurrentDirections(null);
			setIsRouteCalculated(false);
		});
	}, [startPointLatLng, endPointLatLng, selectedWaypoints, saveRoute, selectedRoute, saveRouteData, additionalWaypoints, avoidanceZones]);
	// }, [startPointLatLng, endPointLatLng, selectedWaypoints, additionalWaypoints, saveRoute, selectedRoute]);

	// Watch for waypoint changes and clear alternate route when no waypoints exist
	useEffect(() => {
		// Skip this logic if we're currently restoring data
		if (isRestoringData) {
			console.log('Skipping waypoint clearing logic - data restoration in progress');
			return;
		}
		
		const totalWaypoints = selectedWaypoints.length + additionalWaypoints.length;
		
		// console.log('Waypoint clearing logic check:', {
		// 	selectedWaypoints: selectedWaypoints.length,
		// 	additionalWaypoints: additionalWaypoints.length,
		// 	totalWaypoints,
		// 	isRestoringData,
		// 	selectedRoute,
		// 	hasOriginalRoute: !!originalRoute,
		// 	hasAlternateRoute: !!alternateRoute
		// });
		
		// If no waypoints exist, clear the alternate route and switch to original
		if (totalWaypoints === 0) {
			// console.log('No waypoints detected, clearing alternate route');
			setAlternateRoute(null);
			
			// If currently showing alternate route, switch to original
			if (selectedRoute === 'alternate') {
				setSelectedRoute('original');
				if (originalRoute) {
					setDirections(originalRoute);
					setCurrentDirections(originalRoute);
					
					// Update context for monitor view
					saveRouteData({
						original: originalRoute,
						alternate: null,
						waypoints: selectedWaypoints,
						additionalWaypoints: additionalWaypoints,
						avoidanceZones: avoidanceZones,
						selectedRouteType: 'original'
					});
				}
			}
		}
	}, [selectedWaypoints.length, additionalWaypoints.length, selectedRoute, originalRoute, saveRouteData, additionalWaypoints, avoidanceZones, isRestoringData]);

	const handleMapClick = useCallback(async (e) => {
		if (!isAddingAvoidanceZone && !isSelectingWaypoints) return;

		if (isAddingAvoidanceZone) {
			console.log('Preparing to create avoidance zone at:', e.latLng.toString());
			
			// Store the location and open the creation modal
			setPendingZoneLocation({
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			});
			
			// Reset form data for new zone
			setZoneCreationData({
				label: '',
				description: '',
				type: selectedAvoidanceType,
				radius: 500
			});
			
			setIsZoneCreationModalOpen(true);
			setIsAddingAvoidanceZone(false); // Exit zone creation mode
		} else if (isSelectingWaypoints) {
			const newWaypoint = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
				id: Date.now()
			};

			setSelectedWaypoints(prev => [...prev, newWaypoint]);
		}
	}, [isAddingAvoidanceZone, selectedAvoidanceType, isSelectingWaypoints, createAvoidanceZone, loadZonesForCurrentView]);

	// const confirmAvoidanceZone = useCallback(() => {
	// 	if (previewZone) {
	// 		console.log('Confirming avoidance zone:', previewZone);
	// 		setAvoidanceZones(prev => {
	// 			const newZones = [...prev, previewZone];
	// 			console.log('Updated avoidance zones:', newZones);
	// 			return newZones;
	// 		});
	// 		setPreviewZone(null);
	// 		setIsAddingAvoidanceZone(false);
	// 	}
	// }, [previewZone]);

	// const cancelAvoidanceZone = useCallback(() => {
	// 	console.log('Cancelling avoidance zone');
	// 	setPreviewZone(null);
	// 	setIsAddingAvoidanceZone(false);
	// }, []);

	// Load saved coordinates from localStorage and calculate route
	useEffect(() => {
		// Skip if we're restoring data or if Google Maps isn't loaded
		if (!isLoaded || !window.google || isRestoringData) return;

		const savedCoordinates = localStorage.getItem('lastUsedCoordinates');
		if (savedCoordinates && !startPoint && !endPoint) { // Only load if no current coordinates
			try {
				const coordinates = JSON.parse(savedCoordinates);

				
				// Set the start and end points with coordinates
				setStartPoint(`${coordinates.start.lat}, ${coordinates.start.lng}`);
				setEndPoint(`${coordinates.end.lat}, ${coordinates.end.lng}`);

				// console.log('Initial load - Start Point:', `${coordinates.start.lat}, ${coordinates.start.lng}`);
				// console.log('Initial load - End Point:', `${coordinates.end.lat}, ${coordinates.end.lng}`);

				// Create LatLng objects for the coordinates
				const startLatLng = new window.google.maps.LatLng(
					coordinates.start.lat,
					coordinates.start.lng
				);
				const endLatLng = new window.google.maps.LatLng(
					coordinates.end.lat,
					coordinates.end.lng
				);

				// Set the coordinates directly
				setStartPointLatLng(startLatLng);
				setEndPointLatLng(endLatLng);

				// Calculate route with saved coordinates
				const directionsService = new window.google.maps.DirectionsService();
				directionsService.route(
					{
						origin: startLatLng,
						destination: endLatLng,
						travelMode: window.google.maps.TravelMode.DRIVING,
					},
					directionsCallback
				);
			} catch (error) {
				console.error('Error loading saved coordinates:', error);
			}
		}
	}, [isLoaded, directionsCallback, startPoint, endPoint, isRestoringData]); // Add isRestoringData dependency

	// Load saved state from localStorage
	useEffect(() => {
		const savedState = localStorage.getItem('routeDesignerState');
		if (savedState) {
			const { isMinimized, width } = JSON.parse(savedState);
			setIsDirectionsMinimized(isMinimized || false);
			setPanelWidth(width || 350);
		}
	}, []);

	// Save state to localStorage whenever it changes
	useEffect(() => {
		// Skip if we're restoring data to prevent interference
		if (isRestoringData) {
			// console.log('Skipping localStorage save during restoration');
			return;
		}
		
		const state = {
			start: startPoint,
			end: endPoint,
			isMinimized: isDirectionsMinimized,
			width: panelWidth
		};
		localStorage.setItem('routeDesignerState', JSON.stringify(state));
	}, [startPoint, endPoint, isDirectionsMinimized, panelWidth, isRestoringData]);

	// Restore route data from backend when component mounts
	useEffect(() => {
		const tempRouteId = localStorage.getItem('tempRouteId');
		
		// console.log('Restoration check on component mount:', {
		// 	tempRouteId,
		// 	hasRouteId: !!tempRouteId,
		// 	allLocalStorageKeys: Object.keys(localStorage),
		// 	localStorageEntries: Object.fromEntries(Object.entries(localStorage))
		// });
		
		if (tempRouteId) {
			// console.log('Found temporary route ID, attempting to restore:', tempRouteId);
			
			restoreRouteStateFromBackend(tempRouteId).then(success => {
				if (success) {
					// console.log('Route state restored successfully from backend');
					localStorage.removeItem('tempRouteId'); // Clean up
				} else {
					console.error('Failed to restore route state from backend');
					localStorage.removeItem('tempRouteId'); // Clean up even on failure
				}
			});
		} else {
			console.log('No tempRouteId found - skipping restoration');
		}
	}, []); // Run only once on mount, don't depend on route states

	// Load avoidance zones when map is ready
	useEffect(() => {
		if (!isLoaded || !window.google || !mapRef.current) return;

		// Initial load of zones
		loadZonesForCurrentView();

		// Add listener for map bounds changes to reload zones when user pans/zooms
		const boundsChangedListener = mapRef.current.addListener('bounds_changed', () => {
			// Debounce the zone loading to avoid too many API calls
			const timeoutId = setTimeout(() => {
				loadZonesForCurrentView();
			}, 1000); // Wait 1 second after bounds stop changing

			// Store timeout ID for cleanup
			if (mapRef.current) {
				mapRef.current._zoneLoadTimeout = timeoutId;
			}
		});

		// Cleanup function
		return () => {
			if (boundsChangedListener) {
				window.google.maps.event.removeListener(boundsChangedListener);
			}
			if (mapRef.current && mapRef.current._zoneLoadTimeout) {
				clearTimeout(mapRef.current._zoneLoadTimeout);
			}
		};
	}, [isLoaded, loadZonesForCurrentView]);

	// Update the cursor handling effect
	const handleCursorMove = useCallback((e) => {
		if (isAddingAvoidanceZone || isSelectingWaypoints) {
			setCursorPosition({ x: e.clientX, y: e.clientY });
		}
	}, [isAddingAvoidanceZone, isSelectingWaypoints]);

	// Update the cursor handling effect
	useEffect(() => {
		if (isAddingAvoidanceZone || isSelectingWaypoints) {
			document.addEventListener('mousemove', handleCursorMove);
			document.body.style.cursor = 'none';
		} else {
			document.removeEventListener('mousemove', handleCursorMove);
			document.body.style.cursor = 'default';
		}

		return () => {
			document.removeEventListener('mousemove', handleCursorMove);
			document.body.style.cursor = 'default';
		};
	}, [isAddingAvoidanceZone, isSelectingWaypoints, handleCursorMove]);

	// Add console logs to fetchSavedRoutes
	const fetchSavedRoutes = useCallback(async () => {
		// console.log('Fetching saved routes...');
		try {
			const response = await axios.get(`${process.env.REACT_APP_MONGO_URI}api/routes`);
			// console.log('Fetched routes:', response.data);
			setSavedRoutes(response.data);
		} catch (error) {
			console.error('Error fetching routes:', error);
			setRouteWarning('Failed to load saved routes. Please try again.');
		}
	}, []);

	// Add console logs to handleSaveRoute
	const handleSaveRoute = async () => {
		if (!currentDirections || !currentDirections.routes || currentDirections.routes.length === 0) {
			setRouteWarning('No route to save. Please calculate a route first.');
			return;
		}

		// Declare variables at function scope to avoid scope issues
		let existingRoute = null;
		let routeData = null;

		try {
			setIsSavingRoute(true);
			
			// Set loading cursor for the entire document
			document.body.style.cursor = 'wait';
			document.body.style.pointerEvents = 'none'; // Prevent interactions during save
			
			// Show loading message
			setRouteWarning('Checking for existing routes...');

			// Fetch the latest routes directly to ensure we have up-to-date data
			let currentSavedRoutes = [];
			try {
				const response = await axios.get(`${process.env.REACT_APP_MONGO_URI}api/routes`);
				currentSavedRoutes = response.data;
				console.log('Fetched current saved routes:', currentSavedRoutes);
			} catch (fetchError) {
				console.error('Error fetching current routes:', fetchError);
				// Continue with empty array if fetch fails
			}
			
			// Also try to fetch ALL routes including inactive ones to see if there's a conflict
			let allRoutes = [];
			try {
				const allResponse = await axios.get(`${process.env.REACT_APP_MONGO_URI}api/routes?includeInactive=true`);
				allRoutes = allResponse.data;
				console.log('Fetched ALL routes (including inactive):', allRoutes);
			} catch (fetchError) {
				console.log('Could not fetch all routes (this endpoint might not exist):', fetchError.message);
			}

			// Debug: Log the current route name and saved routes
			console.log('Current route name:', routeName);
			console.log('Current saved routes:', currentSavedRoutes);
			console.log('Current saved routes length:', currentSavedRoutes.length);
			
			// Log each route in detail
			currentSavedRoutes.forEach((route, index) => {
				console.log(`Route ${index}:`, {
					_id: route._id,
					routeName: route.routeName,
					name: route.name,
					projectName: route.projectName,
					status: route.status,
					isActive: route.isActive,
					fullObject: route
				});
			});

			// Check if a route with this name already exists (check multiple possible field names)
			existingRoute = currentSavedRoutes.find(route => {
				const routeNameMatch = route.routeName === routeName;
				const nameMatch = route.name === routeName;
				const projectNameMatch = route.projectName === routeName;
				
				// Also check case-insensitive matches
				const routeNameMatchCI = route.routeName && route.routeName.toLowerCase() === routeName.toLowerCase();
				const nameMatchCI = route.name && route.name.toLowerCase() === routeName.toLowerCase();
				const projectNameMatchCI = route.projectName && route.projectName.toLowerCase() === routeName.toLowerCase();
				
				console.log('Checking route:', {
					routeId: route._id,
					routeName: route.routeName,
					name: route.name,
					projectName: route.projectName,
					status: route.status,
					isActive: route.isActive,
					routeNameMatch,
					nameMatch,
					projectNameMatch,
					routeNameMatchCI,
					nameMatchCI,
					projectNameMatchCI
				});
				
				return routeNameMatch || nameMatch || projectNameMatch || 
				       routeNameMatchCI || nameMatchCI || projectNameMatchCI;
			});

			console.log('Found existing route:', existingRoute);

			if (existingRoute) {
				// Reset UI state temporarily for the confirmation dialog
				setIsSavingRoute(false);
				document.body.style.cursor = 'default';
				document.body.style.pointerEvents = 'auto';
				setRouteWarning(null);

				const shouldReplace = window.confirm(
					`A route named "${routeName}" already exists. Do you want to replace it?`
				);

				if (!shouldReplace) {
					// User cancelled, don't save
					return;
				}

				// User confirmed replacement, continue with save
				setIsSavingRoute(true);
				document.body.style.cursor = 'wait';
				document.body.style.pointerEvents = 'none';
			}

			const formatRouteData = (route) => {
				// Get coordinates from the actual LatLng objects or from the route data
				const getCoordinatesForBackend = (latLngObject, addressString) => {
					// First try to use the LatLng object if available
					if (latLngObject && typeof latLngObject.lat === 'function' && typeof latLngObject.lng === 'function') {
						return {
							type: "Point",
							coordinates: [latLngObject.lng(), latLngObject.lat()] // GeoJSON format: [longitude, latitude]
						};
					}
					
					// Fallback: try to parse as coordinates if it's in "lat,lng" format
					const coordMatch = addressString.match(/^([-+]?\d*\.\d+),\s*([-+]?\d*\.\d+)$/);
					if (coordMatch) {
						const lat = parseFloat(coordMatch[1]);
						const lng = parseFloat(coordMatch[2]);
						return {
							type: "Point",
							coordinates: [lng, lat] // GeoJSON format: [longitude, latitude]
						};
					}
					
					// If we can't parse coordinates, throw an error
					throw new Error(`Cannot determine coordinates for address: ${addressString}. Please calculate the route first.`);
				};

				return {
					routeName: routeName || `Route_${Date.now()}`,
					routeDescription: routeDescription || 'Route created in Route Designer',
					supplierName: supplierName || 'Unknown',
					projectName: projectName || 'Default Project',
					originator: originator || 'Route Designer',
					startPoint: {
						address: startPoint,
						coordinates: getCoordinatesForBackend(startPointLatLng, startPoint)
					},
					endPoint: {
						address: endPoint,
						coordinates: getCoordinatesForBackend(endPointLatLng, endPoint)
					},
					selectedWaypoints: selectedWaypoints.map((point, index) => ({
						coordinates: [point.lng, point.lat], // GeoJSON format: [longitude, latitude]
						id: point.id || index,
						index: index,
						address: `Waypoint ${index + 1}`
					})),
					additionalWaypoints: additionalWaypoints.map((point, index) => ({
						coordinates: [point.lng, point.lat], // GeoJSON format: [longitude, latitude]
						id: point.id || `additional_${index}`,
						index: index,
						address: `Additional Waypoint ${index + 1}`
					})),
					// Note: avoidanceZones are now stored in standalone AvoidanceZone collection
					// and are not included in route data
					
					// Debug: Log what avoidance zones are being saved
					// ... existing code ...
					originalRoute: route,
					alternateRoute: alternateRoute,
					selectedRoute: selectedRoute,
					isRouteCalculated: true,
					isTemporary: false,
					// Reactivate the route if updating an existing one
					status: 'active',
					isActive: true
				};
			};

			routeData = formatRouteData(currentDirections);

			console.log('About to save route with existingRoute:', existingRoute);
			console.log('Route data to save:', routeData);
			console.log('Current avoidance zones state:', {
				avoidanceZonesCount: avoidanceZones.length,
				avoidanceZonesData: avoidanceZones,
				routeDataAvoidanceZones: routeData.avoidanceZones
			});
			
			// Detailed logging of the save payload
			console.log('Detailed save payload:', {
				avoidanceZonesRaw: avoidanceZones,
				avoidanceZonesFormatted: routeData.avoidanceZones,
				fullPayload: routeData
			});

			let response;
			if (existingRoute) {
				// Update existing route instead of deleting and recreating
				console.log('Taking UPDATE path for existing route:', existingRoute._id);
				setRouteWarning('Updating existing route...');
				response = await axios.put(
					`${process.env.REACT_APP_MONGO_URI}api/routes/${existingRoute._id}`,
						routeData,
						{
							headers: {
								'Content-Type': 'application/json'
							}
						}
					);
			} else {
				// Create new route
				console.log('Taking CREATE path - no existing route found');
				setRouteWarning('Saving route to server...');
				response = await axios.post(
					`${process.env.REACT_APP_MONGO_URI}api/routes`,
					routeData,
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}
				);
			}

			setRouteWarning(existingRoute ? 'Route updated successfully!' : 'Route saved successfully!');
			setIsSaveModalOpen(false);
			fetchSavedRoutes(); // Refresh the routes list

			// Clear success message after 3 seconds
			setTimeout(() => {
				setRouteWarning(null);
			}, 3000);
		} catch (error) {
			console.error('Error saving route:', error.response?.data || error.message);
			
			// Special handling for "Route name already exists" error when we couldn't find the existing route
			if (error.response?.data?.message === 'Route name already exists' && !existingRoute) {
				console.log('Backend says route exists but frontend could not find it. Attempting workaround...');
				
				// Try to find and update the route using a different approach
				const shouldTryUpdate = window.confirm(
					`A route with the name "${routeName}" already exists in the system, but we couldn't locate it in the current routes list. ` +
					`This might be due to an inactive or archived route. Would you like to try updating it anyway?`
				);
				
				if (shouldTryUpdate) {
					try {
						// Try to get the specific route by name from backend
						setRouteWarning('Attempting to find and update existing route...');
						
						// Try a direct search API call if available
						let foundRoute = null;
						try {
							const searchResponse = await axios.get(`${process.env.REACT_APP_MONGO_URI}api/routes/search?name=${encodeURIComponent(routeName)}`);
							foundRoute = searchResponse.data;
							console.log('Found route via search API:', foundRoute);
						} catch (searchError) {
							console.log('Search API not available or failed:', searchError.message);
						}
						
						if (foundRoute && foundRoute._id) {
							// Try to update the found route
							const updateResponse = await axios.put(
								`${process.env.REACT_APP_MONGO_URI}api/routes/${foundRoute._id}`,
								routeData,
								{
									headers: {
										'Content-Type': 'application/json'
									}
								}
							);
							
							setRouteWarning('Route updated successfully using fallback method!');
							setIsSaveModalOpen(false);
							fetchSavedRoutes(); // Refresh the routes list
							
							// Clear success message after 3 seconds
							setTimeout(() => {
								setRouteWarning(null);
							}, 3000);
							
							return; // Exit successfully
						} else {
							throw new Error('Could not locate the existing route for update');
						}
					} catch (updateError) {
						console.error('Fallback update also failed:', updateError);
						setRouteWarning(`Failed to update existing route: ${updateError.response?.data?.message || updateError.message}`);
					}
				} else {
					setRouteWarning('Save cancelled. Please choose a different route name or contact support.');
				}
			} else {
				setRouteWarning(`Failed to save route: ${error.response?.data?.message || error.message}`);
			}
		} finally {
			setIsSavingRoute(false);
			// Reset cursor and interactions
			document.body.style.cursor = 'default';
			document.body.style.pointerEvents = 'auto';
		}
	};

	// Add console logs to handleLoadRoute
	const handleLoadRoute = (route) => {
		try {
			console.log('Loading route:', route.routeName || route.name);
			
			// FIRST: Clear all existing state to prevent conflicts
			setDirections(null);
			setCurrentDirections(null);
			setOriginalRoute(null);
			setAlternateRoute(null);
			setSelectedRoute('original');
			setIsRouteCalculated(false);
			setRouteWarning(null);
			setPreviewZone(null);
			setSelectedWaypoints([]);
			setAdditionalWaypoints([]);
			// Clear existing avoidance zones to prevent conflicts with new route zones
			setAvoidanceZones([]);
			// Note: Don't clear avoidanceZones here since they're managed by standalone collection
			// and will be reloaded based on map bounds
			
			// Clear directions renderer
			if (directionsRendererRef.current) {
				try {
					directionsRendererRef.current.setDirections(null);
					directionsRendererRef.current.setMap(null);
					directionsRendererRef.current.setPanel(null);
				} catch (error) {
					console.error('Error clearing directions renderer during load:', error);
				}
				directionsRendererRef.current = null;
			}
			
			// Force DirectionsRenderer to unmount and remount by updating a key
			setDirectionsKey(prev => prev + 1);
			
			// Reset map to default center and zoom
			if (mapRef.current) {
				mapRef.current.setCenter(defaultCenter);
				mapRef.current.setZoom(mapZoom);
			}
			
			// Clear all markers from map
			if (markersRef.current) {
				for (const marker of markersRef.current) {
					marker.setMap(null);
				}
				markersRef.current = [];
			}
			
			// Clear all circles from map
			for (const [circle] of circlesRef.current) {
				try {
					if (circle && typeof circle.setMap === 'function') {
						circle.setMap(null);
					}
				} catch (error) {
					console.error('Error removing circle during load:', error);
				}
			}
			circlesRef.current.clear();
			
			// SECOND: Set the restoration flag to prevent other logic from interfering
			setIsRestoringData(true);
			
			// THIRD: Load the new route data
			setStartPoint(route.startPoint.address);
			setEndPoint(route.endPoint.address);

			// Note: Avoidance zones are now managed by standalone collection
			// and will be automatically loaded based on map bounds when the map updates
			console.log('Skipping embedded avoidance zone loading - using standalone collection');
			
			setRouteName(route.routeName || route.name);
			setRouteDescription(route.routeDescription || route.description || '');
			setSupplierName(route.supplierName || '');
			setProjectName(route.projectName || '');
			setOriginator(route.originator || '');
			setIsLoadModalOpen(false);

			// Set marker types
			setStartMarkerType(route.startPoint.markerType || 'distributionCenter');
			setEndMarkerType(route.endPoint.markerType || 'oilWell');

			// Create LatLng objects for the coordinates
			const startLatLng = new window.google.maps.LatLng(
				route.startPoint.coordinates.coordinates[1], // latitude
				route.startPoint.coordinates.coordinates[0]  // longitude
			);
			const endLatLng = new window.google.maps.LatLng(
				route.endPoint.coordinates.coordinates[1], // latitude
				route.endPoint.coordinates.coordinates[0]  // longitude
			);

			console.log('Setting coordinates for loaded route:', {
				start: startLatLng.toString(),
				end: endLatLng.toString()
			});

			// Set the coordinates
			setStartPointLatLng(startLatLng);
			setEndPointLatLng(endLatLng);

			// Force marker creation immediately after setting coordinates
			setTimeout(() => {
				console.log('Force creating markers after coordinate setting');
				if (mapRef.current && startLatLng && endLatLng) {
					// Clear any existing markers first
					if (markersRef.current) {
						for (const marker of markersRef.current) {
							marker.setMap(null);
						}
						markersRef.current = [];
					}

					// Create start marker
					const startType = MARKER_TYPES.find(t => t.id === (route.startPoint.markerType || 'distributionCenter'));
					if (startType) {
						const startMarker = new window.google.maps.Marker({
							position: startLatLng,
							map: mapRef.current,
							title: startType.name,
							label: {
								text: "DC",
								color: "#FFFFFF",
								fontSize: "14px",
								fontWeight: "bold"
							},
							icon: {
								...startType.icon,
								anchor: new window.google.maps.Point(12, 12),
								labelOrigin: new window.google.maps.Point(12, 0)
							},
							zIndex: 1000
						});
						markersRef.current.push(startMarker);
						console.log('Force-created start marker at:', startLatLng.toString());
					}

					// Create end marker
					const endType = MARKER_TYPES.find(t => t.id === (route.endPoint.markerType || 'oilWell'));
					if (endType) {
						const endMarker = new window.google.maps.Marker({
							position: endLatLng,
							map: mapRef.current,
							title: endType.name,
							label: {
								text: "DEST",
								color: "#FFFFFF",
								fontSize: "14px",
								fontWeight: "bold"
							},
							icon: {
								...endType.icon,
								anchor: new window.google.maps.Point(12, 12),
								labelOrigin: new window.google.maps.Point(12, 0)
							},
							zIndex: 1000
						});
						markersRef.current.push(endMarker);
						console.log('Force-created end marker at:', endLatLng.toString());
					}
				}
			}, 100); // Short delay to ensure coordinates are set

			// Restore waypoints from saved route
			if (route.selectedWaypoints && Array.isArray(route.selectedWaypoints)) {
				const restoredWaypoints = route.selectedWaypoints.map(wp => ({
					lat: wp.coordinates[1], // latitude from GeoJSON format
					lng: wp.coordinates[0], // longitude from GeoJSON format
					id: wp.id
				}));
				console.log('Restoring waypoints:', restoredWaypoints);
				console.log('Original waypoints from route:', route.selectedWaypoints);
				setSelectedWaypoints(restoredWaypoints);
			}

			if (route.additionalWaypoints && Array.isArray(route.additionalWaypoints)) {
				const restoredAdditionalWaypoints = route.additionalWaypoints.map(wp => ({
						lat: wp.coordinates[1], // latitude from GeoJSON format
						lng: wp.coordinates[0], // longitude from GeoJSON format
						id: wp.id
					}));
				console.log('Restoring additional waypoints:', restoredAdditionalWaypoints);
				setAdditionalWaypoints(restoredAdditionalWaypoints);
			}

			// Force update input field values
			const startInput = document.getElementById('startPoint');
			const endInput = document.getElementById('endPoint');
			if (startInput) startInput.value = route.startPoint.address;
			if (endInput) endInput.value = route.endPoint.address;

			// FOURTH: Center map on the loaded route
			if (mapRef.current) {
				const bounds = new window.google.maps.LatLngBounds();
				bounds.extend(startLatLng);
				bounds.extend(endLatLng);
				
				// Include waypoints in bounds if they exist
				if (route.selectedWaypoints && Array.isArray(route.selectedWaypoints)) {
					route.selectedWaypoints.forEach(wp => {
						const wpLatLng = new window.google.maps.LatLng(wp.coordinates[1], wp.coordinates[0]);
						bounds.extend(wpLatLng);
						console.log(`Including waypoint in bounds: lat=${wp.coordinates[1]}, lng=${wp.coordinates[0]}`);
					});
				}
				
				console.log('Setting map bounds to include all points');
				mapRef.current.fitBounds(bounds, {
					padding: { top: 100, right: 100, bottom: 100, left: 100 }
				});
				
				// Force map refresh after bounds change
				setTimeout(() => {
					if (mapRef.current) {
						console.log('Force refreshing map after bounds change');
						window.google.maps.event.trigger(mapRef.current, 'resize');
						
						// Also force load zones after map refresh
						setTimeout(() => {
							console.log('Force loading zones after map bounds refresh...');
							loadZonesForCurrentView();
						}, 500);
					}
				}, 500);
			}

			// Use setTimeout to ensure state updates are applied before route calculation
			setTimeout(() => {
				// FIFTH: Calculate route with loaded coordinates and waypoints
				const directionsService = new window.google.maps.DirectionsService();
				
				// If we have waypoints, use them in the route calculation
				const waypointMarkers = route.selectedWaypoints && route.selectedWaypoints.length > 0 
					? route.selectedWaypoints.map(wp => ({
						location: new window.google.maps.LatLng(wp.coordinates[1], wp.coordinates[0]),
						stopover: false
					}))
					: [];

				console.log('Recalculating route with waypoints:', waypointMarkers.length);
				console.log('Waypoint details:', waypointMarkers);

				// Calculate both original and alternate routes like in the main calculate function
				const originalRequest = {
					origin: startLatLng,
					destination: endLatLng,
					travelMode: window.google.maps.TravelMode.DRIVING,
					provideRouteAlternatives: true
				};

				const alternateRequest = {
					origin: startLatLng,
					destination: endLatLng,
					waypoints: waypointMarkers,
					travelMode: window.google.maps.TravelMode.DRIVING,
					optimizeWaypoints: false,
					provideRouteAlternatives: true
				};

				// Calculate both routes
				Promise.all([
					new Promise((resolve, reject) => {
						directionsService.route(originalRequest, (response, status) => {
							if (status === 'OK' && response) {
								resolve(response);
							} else {
								reject(new Error(`Original route calculation failed: ${status}`));
							}
						});
					}),
					new Promise((resolve, reject) => {
						if (waypointMarkers.length === 0) {
							resolve(null); // Skip alternate route if no waypoints
						} else {
							directionsService.route(alternateRequest, (response, status) => {
								if (status === 'OK' && response) {
									resolve(response);
								} else {
									console.warn(`Alternate route calculation failed: ${status}`);
									resolve(null); // Don't reject, just resolve with null
								}
							});
						}
					})
				])
				.then(([originalResponse, alternateResponse]) => {
					console.log('Routes calculated for loaded route:', {
						original: !!originalResponse,
						alternate: !!alternateResponse,
						selectedRoute: route.selectedRoute || 'original'
					});

					// Set the route states
					setOriginalRoute(originalResponse);
					setAlternateRoute(alternateResponse);
					
					// Set current directions based on what routes are available and what was selected
					const selectedRouteType = route.selectedRoute || 'original';
					let currentRoute = null;
					
					if (selectedRouteType === 'alternate' && alternateResponse) {
						currentRoute = alternateResponse;
						setSelectedRoute('alternate');
					} else if (originalResponse) {
						currentRoute = originalResponse;
						setSelectedRoute('original');
					}

					if (currentRoute) {
						setDirections(currentRoute);
						setCurrentDirections(currentRoute);
						setIsRouteCalculated(true);
						
						console.log('Set directions for loaded route:', {
							selectedRoute: selectedRouteType,
							hasDirections: !!currentRoute
						});
						
						// Update context for monitor view
						saveRouteData({
							original: originalResponse,
							alternate: alternateResponse,
							waypoints: route.selectedWaypoints || [],
							additionalWaypoints: route.additionalWaypoints || [],
							avoidanceZones: route.avoidanceZones || [],
							selectedRouteType: selectedRouteType
						});
					} else {
						console.error('No valid route found after loading');
						setRouteWarning('Failed to display loaded route. Please try recalculating.');
					}
					
					// Clear restoration flag after a delay to allow rendering to complete
					setTimeout(() => {
						setIsRestoringData(false);
						setShouldAutoFitBounds(true); // Re-enable auto-fit bounds
						console.log('Route loading completed successfully - markers should now be stable');
						
						// Load avoidance zones for the current route area
						console.log('Loading avoidance zones for loaded route area...');
						loadZonesForCurrentView();
					}, 1000); // Reduced delay since we're force-creating markers earlier
				})
				.catch(error => {
					console.error('Error calculating routes for loaded route:', error);
					setRouteWarning('Failed to calculate routes for loaded route. Please try recalculating manually.');
					setIsRestoringData(false);
					setShouldAutoFitBounds(true); // Re-enable auto-fit bounds even on error
				});
			}, 1000); // End of setTimeout

		} catch (error) {
			console.error('Error loading route:', error);
			setRouteWarning('Failed to load route. Please try again.');
			setIsRestoringData(false);
			setShouldAutoFitBounds(true); // Re-enable auto-fit bounds even on error
		}
	};

	// Add console logs to handleDeleteRoute
	const handleDeleteRoute = async (routeId) => {
		try {
			if (window.confirm('Are you sure you want to delete this route? This action cannot be undone.')) {
				await axios.delete(`${process.env.REACT_APP_MONGO_URI}api/routes/${routeId}`);
				fetchSavedRoutes(); // Refresh the routes list
			}
		} catch (error) {
			console.error('Error deleting route:', error);
			setRouteWarning('Failed to delete route. Please try again.');
		}
	};

	// Add effect to log when modals are opened/closed
	useEffect(() => {
		if (isSaveModalOpen || isLoadModalOpen) {
			console.log('Modal state changed:', { isSaveModalOpen, isLoadModalOpen });
		}
	}, [isSaveModalOpen, isLoadModalOpen]);

	// Add this function before handleSaveRoute
// eslint-disable-next-line
 	const generateTestPayload = () => {
		// Base coordinates for testing
		const startCoords = [-104.7091, 40.4233];
		const endCoords = [-104.7125, 40.4401];

		// Create a payload that matches the exact structure from the successful example
		const applicationPayload = {
			routeName: "Morning Supply Route A",
			routeDescription: "Primary route to deliver equipment to Site Alpha",
			supplierName: "Alpha Logistics",
			projectName: "Greeley Operations",
			originator: "john.doe@workside.com",
			startPoint: {
				address: "123 Supply Rd, Greeley, CO",
				coordinates: {
					type: "Point",
					coordinates: startCoords
				}
			},
			endPoint: {
				address: "456 Rig Site Ln, Greeley, CO",
				coordinates: {
					type: "Point",
					coordinates: endCoords
				}
			},
			originalRoute: {
				distance: {
					text: "7.2 miles",
					value: 11594
				},
				duration: {
					text: "18 mins",
					value: 1080
				},
				path: [
					{
						type: "Point",
						coordinates: startCoords
					},
					{
						type: "Point",
						coordinates: [-104.7102, 40.4290]
					},
					{
						type: "Point",
						coordinates: endCoords
					}
				],
				instructions: [
					{
						step: 1,
						instruction: "Head north on Supply Rd",
						distance: "2.0 miles",
						duration: "5 mins",
						coordinates: {
							type: "Point",
							coordinates: startCoords
						}
					},
					{
						step: 2,
						instruction: "Turn right onto Rig Site Ln",
						distance: "5.2 miles",
						duration: "13 mins",
						coordinates: {
							type: "Point",
							coordinates: endCoords
						}
					}
				]
			},
			alternateRoute: {
				distance: {
					text: "8.5 miles",
					value: 13679
				},
				duration: {
					text: "20 mins",
					value: 1200
				},
				path: [
					{
						type: "Point",
						coordinates: startCoords
					},
					{
						type: "Point",
						coordinates: [-104.7135, 40.4350]
					},
					{
						type: "Point",
						coordinates: endCoords
					}
				],
				instructions: [
					{
						step: 1,
						instruction: "Take detour via County Rd 42",
						distance: "4.0 miles",
						duration: "8 mins",
						coordinates: {
							type: "Point",
							coordinates: [-104.7135, 40.4350]
						}
					}
				]
			},
			additionalWaypoints: [
				{
					id: "d1",
					type: "Point",
					coordinates: [-104.7150, 40.4320]
				}
			],
			selectedWaypoints: [
				{
					id: "w1",
					type: "Point",
					coordinates: [-104.7110, 40.4260]
				},
				{
					id: "w2",
					type: "Point",
					coordinates: [-104.7130, 40.4380]
				}
			],
			status: "pending",
			isActive: true
		};

		return applicationPayload;
	};

	// const handleGenerateTestPayload = () => {
	// 	const testPayload = generateTestPayload();
		
	// 	// Create a modal to show the payload
	// 	const modal = document.createElement('div');
	// 	modal.style.position = 'fixed';
	// 	modal.style.top = '50%';
	// 	modal.style.left = '50%';
	// 	modal.style.transform = 'translate(-50%, -50%)';
	// 	modal.style.backgroundColor = 'white';
	// 	modal.style.padding = '20px';
	// 	modal.style.borderRadius = '8px';
	// 	modal.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
	// 	modal.style.zIndex = '1000';
	// 	modal.style.maxHeight = '80vh';
	// 	modal.style.overflowY = 'auto';
	// 	modal.style.width = '80%';
	// 	modal.style.maxWidth = '800px';

	// 	modal.innerHTML = `
	// 		<h3 style="margin-bottom: 15px;">Test Payload</h3>
	// 		<p style="margin-bottom: 10px; color: #666;">This payload matches the exact structure from the successful example.</p>
	// 		<pre style="background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto;">${JSON.stringify(testPayload, null, 2)}</pre>
	// 		<button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Close</button>
	// 	`;

	// 	document.body.appendChild(modal);
	// };

	// Add this function to handle marker type selection
	const handleMarkerTypeSelect = (type) => {
		if (currentMarkerPointType === 'start') {
			setStartMarkerType(type.id);
		} else {
			setEndMarkerType(type.id);
		}
		setIsMarkerTypeModalOpen(false);
	};

	// Update the marker icons initialization
	useEffect(() => {
		if (isLoaded && window.google) {
			// eslint-disable-next-line
			const startType = MARKER_TYPES.find(t => t.id === startMarkerType);
			// eslint-disable-next-line
			const endType = MARKER_TYPES.find(t => t.id === endMarkerType);

			// const updatedIcons = {
			// 	start: {
			// 		...startType.icon,
			// 		anchor: new window.google.maps.Point(12, 12),
			// 		labelOrigin: new window.google.maps.Point(12, 0)
			// 	},
			// 	end: {
			// 		...endType.icon,
			// 		anchor: new window.google.maps.Point(12, 12),
			// 		labelOrigin: new window.google.maps.Point(12, 0)
			// 	}
			// };

		}
	}, [isLoaded, startMarkerType, endMarkerType]);

	// Add functions for saving/restoring route state to/from backend
	const saveRouteStateToBackend = async () => {
		if (!originalRoute && !alternateRoute) {
			// console.log('No routes to save');
			return null;
		}

		try {
			const routeStateData = {
				routeName: `Temp_Route_${Date.now()}`,
				routeDescription: 'Temporary route saved for view switching',
				supplierName: 'System',
				projectName: 'View Switch',
				originator: 'RouteDesigner',
				startPoint: {
					address: startPoint,
					coordinates: startPointLatLng ? {
						lat: startPointLatLng.lat(),
						lng: startPointLatLng.lng()
					} : null
				},
				endPoint: {
					address: endPoint,
					coordinates: endPointLatLng ? {
						lat: endPointLatLng.lat(),
						lng: endPointLatLng.lng()
					} : null
				},
				originalRoute: originalRoute,
				alternateRoute: alternateRoute,
				selectedWaypoints: selectedWaypoints,
				additionalWaypoints: additionalWaypoints,
				avoidanceZones: avoidanceZones,
				selectedRoute: selectedRoute,
				isRouteCalculated: isRouteCalculated,
				isTemporary: true, // Flag to identify this as a temporary save
				createdAt: new Date().toISOString()
			};

			// console.log('Saving route state to backend:', routeStateData);
			
			const response = await fetch(`${process.env.REACT_APP_MONGO_URI}api/routes/temp`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(routeStateData)
			});

			if (response.ok) {
				const savedRoute = await response.json();
				// console.log('Route state saved successfully:', savedRoute);
				return savedRoute._id; // Return the ID for retrieval
			} else {
				throw new Error(`Failed to save route state: ${response.status}`);
			}
		} catch (error) {
			console.error('Error saving route state:', error);
			return null;
		}
	};

	const restoreRouteStateFromBackend = async (routeId) => {
		if (!routeId) {
			// console.log('No route ID provided for restoration');
			return false;
		}

		try {
			// console.log('Restoring route state from backend:', routeId);
			
			// Set restoration flag to prevent other logic from interfering
			setIsRestoringData(true);
			
			// Disable auto-fit bounds during restoration to prevent unwanted zoom
			setShouldAutoFitBounds(false);
			
			const response = await fetch(`${process.env.REACT_APP_MONGO_URI}api/routes/${routeId}`);
			
			if (response.ok) {
				const routeData = await response.json();
				// console.log('Route state retrieved:', routeData);
				
				// Restore all route data
				setStartPoint(routeData.startPoint?.address || '');
				setEndPoint(routeData.endPoint?.address || '');
				
				// Force update input field values
				const startInput = document.getElementById('startPoint');
				const endInput = document.getElementById('endPoint');
				if (startInput) startInput.value = routeData.startPoint?.address || '';
				if (endInput) endInput.value = routeData.endPoint?.address || '';
				
				// Create proper LatLng objects for coordinates
				let startLatLng = null;
				let endLatLng = null;
				
				if (routeData.startPoint?.coordinates) {
					// Handle GeoJSON Point format: coordinates: [lng, lat]
					const coords = routeData.startPoint.coordinates.coordinates;
					if (coords && Array.isArray(coords) && coords.length >= 2) {
						startLatLng = new window.google.maps.LatLng(
							coords[1], // latitude
							coords[0]  // longitude
						);
						setStartPointLatLng(startLatLng);
					}
				}
				
				if (routeData.endPoint?.coordinates) {
					// Handle GeoJSON Point format: coordinates: [lng, lat]
					const coords = routeData.endPoint.coordinates.coordinates;
					if (coords && Array.isArray(coords) && coords.length >= 2) {
						endLatLng = new window.google.maps.LatLng(
							coords[1], // latitude
							coords[0]  // longitude
						);
						setEndPointLatLng(endLatLng);
					}
				}

				console.log('Setting coordinates for restored route:', {
					start: startLatLng ? startLatLng.toString() : 'None',
					end: endLatLng ? endLatLng.toString() : 'None'
				});

				// Force marker creation immediately after setting coordinates
				if (startLatLng && endLatLng) {
					setTimeout(() => {
						console.log('Force creating markers after coordinate restoration');
						if (mapRef.current) {
							// Clear any existing markers first
							if (markersRef.current) {
								for (const marker of markersRef.current) {
									marker.setMap(null);
								}
								markersRef.current = [];
							}

							// Create start marker
							const startType = MARKER_TYPES.find(t => t.id === 'distributionCenter');
							if (startType) {
								const startMarker = new window.google.maps.Marker({
									position: startLatLng,
									map: mapRef.current,
									title: startType.name,
									label: {
										text: "DC",
										color: "#FFFFFF",
										fontSize: "14px",
										fontWeight: "bold"
									},
									icon: {
										...startType.icon,
										anchor: new window.google.maps.Point(12, 12),
										labelOrigin: new window.google.maps.Point(12, 0)
									},
									zIndex: 1000
								});
								markersRef.current.push(startMarker);
								console.log('Force-created start marker at:', startLatLng.toString());
							}

							// Create end marker
							const endType = MARKER_TYPES.find(t => t.id === 'oilWell');
							if (endType) {
								const endMarker = new window.google.maps.Marker({
									position: endLatLng,
									map: mapRef.current,
									title: endType.name,
									label: {
										text: "DEST",
										color: "#FFFFFF",
										fontSize: "14px",
										fontWeight: "bold"
									},
									icon: {
										...endType.icon,
										anchor: new window.google.maps.Point(12, 12),
										labelOrigin: new window.google.maps.Point(12, 0)
									},
									zIndex: 1000
								});
								markersRef.current.push(endMarker);
								console.log('Force-created end marker at:', endLatLng.toString());
							}
						}
					}, 100); // Short delay to ensure coordinates are set
				}
				
				// Restore waypoints and other data
				setSelectedWaypoints(routeData.selectedWaypoints || []);
				setAdditionalWaypoints(routeData.additionalWaypoints || []);
				setAvoidanceZones(routeData.avoidanceZones || []);
				setSelectedRoute(routeData.selectedRoute || 'original');
				
				console.log('Restored avoidance zones from backend:', {
					routeDataAvoidanceZones: routeData.avoidanceZones,
					avoidanceZonesLength: routeData.avoidanceZones?.length || 0,
					avoidanceZonesData: routeData.avoidanceZones
				});
				
				// Convert avoidance zones from backend format to frontend format  
				if (routeData.avoidanceZones && Array.isArray(routeData.avoidanceZones)) {
					const convertedZones = routeData.avoidanceZones.map(zone => {
						// Check if zone.location is in GeoJSON format (coordinates array) or direct lat/lng format
						if (zone.location && zone.location.coordinates && Array.isArray(zone.location.coordinates)) {
							// Convert from GeoJSON format: coordinates: [lng, lat]
							return {
								...zone,
								location: {
									lat: zone.location.coordinates[1], // latitude from GeoJSON
									lng: zone.location.coordinates[0]  // longitude from GeoJSON
								}
							};
						} else {
							// Already in direct lat/lng format
							return zone;
						}
					});
					
					console.log('Converted avoidance zones in restore:', {
						original: routeData.avoidanceZones,
						converted: convertedZones
					});
					
					setAvoidanceZones(convertedZones);
				} else {
					setAvoidanceZones([]);
				}
				
				// Instead of trying to restore the route objects directly, recalculate the routes
				// This ensures we get proper Google Maps DirectionsResult objects
				if (startLatLng && endLatLng) {
					// console.log('Recalculating routes with restored coordinates...');
					
					// Prepare waypoints for routing
					const waypointMarkers = (routeData.selectedWaypoints || []).map(point => {
						// Handle different coordinate formats
						let lat, lng;
						if (point.coordinates && Array.isArray(point.coordinates)) {
							lng = point.coordinates[0];
							lat = point.coordinates[1];
						} else if (point.lat && point.lng) {
							lat = point.lat;
							lng = point.lng;
						}
						
						if (lat && lng) {
							return {
								location: new window.google.maps.LatLng(lat, lng),
								stopover: false
							};
						}
						return null;
					}).filter(Boolean);
					
					const directionsService = new window.google.maps.DirectionsService();
					
					// Calculate both original and alternate routes
					const originalRequest = {
						origin: startLatLng,
						destination: endLatLng,
						travelMode: window.google.maps.TravelMode.DRIVING,
						provideRouteAlternatives: true
					};

					const alternateRequest = {
						origin: startLatLng,
						destination: endLatLng,
						waypoints: waypointMarkers,
						travelMode: window.google.maps.TravelMode.DRIVING,
						optimizeWaypoints: false,
						provideRouteAlternatives: true
					};

					try {
						// Calculate original route
						const originalResponse = await new Promise((resolve, reject) => {
							directionsService.route(originalRequest, (response, status) => {
								if (status === 'OK' && response) {
									resolve(response);
								} else {
									reject(new Error(`Original route calculation failed: ${status}`));
								}
							});
						});

						// Calculate alternate route if we have waypoints
						let alternateResponse = null;
						if (waypointMarkers.length > 0) {
							alternateResponse = await new Promise((resolve, reject) => {
								directionsService.route(alternateRequest, (response, status) => {
									if (status === 'OK' && response) {
										resolve(response);
									} else {
										console.warn(`Alternate route calculation failed: ${status}`);
										resolve(null); // Don't reject, just resolve with null
									}
								});
							});
						}

						// console.log('Routes recalculated successfully:', {
						// 	originalRoute: !!originalResponse,
						// 	alternateRoute: !!alternateResponse,
						// 	selectedRoute: routeData.selectedRoute
						// });

						// Set the route states
						setOriginalRoute(originalResponse);
						setAlternateRoute(alternateResponse);
						
						// Set current directions based on selected route
						const selectedRouteValue = routeData.selectedRoute || 'original';
						const currentRoute = selectedRouteValue === 'alternate' && alternateResponse
							? alternateResponse
							: originalResponse;

						if (currentRoute) {
							setDirections(currentRoute);
							setCurrentDirections(currentRoute);
							setIsRouteCalculated(true);
							
							// Update context for monitor view
							saveRouteData({
								original: originalResponse,
								alternate: alternateResponse,
								waypoints: routeData.selectedWaypoints || [],
								additionalWaypoints: routeData.additionalWaypoints || [],
								avoidanceZones: routeData.avoidanceZones || [],
								selectedRouteType: selectedRouteValue
							});
						}

					} catch (routeError) {
						console.error('Error recalculating routes during restoration:', routeError);
						setRouteWarning('Failed to recalculate routes. Please try calculating them manually.');
					}
				}
				
				// Clean up the temporary route from backend
				try {
					await fetch(`${process.env.REACT_APP_MONGO_URI}api/routes/${routeId}`, {
						method: 'DELETE'
					});
					// console.log('Temporary route cleaned up');
				} catch (cleanupError) {
					console.warn('Failed to cleanup temporary route:', cleanupError);
				}
				
				// Re-enable auto-fit bounds after a delay
				setTimeout(() => {
					setShouldAutoFitBounds(true);
					// Clear restoration flag after completion
					setTimeout(() => {
						setIsRestoringData(false);
						// console.log('Restoration completed successfully');
					}, 1000);
				}, 500);
				
				return true;
			} else {
				throw new Error(`Failed to retrieve route state: ${response.status}`);
			}
		} catch (error) {
			console.error('Error restoring route state:', error);
			// Re-enable auto-fit bounds even on error
			setShouldAutoFitBounds(true);
			// Clear restoration flag even on error
			setIsRestoringData(false);
			setRouteWarning('Failed to restore route data. Please recalculate your route.');
			return false;
		}
	};

	// Function to handle view switching with confirmation
	const handleSwitchToMonitorView = async () => {
		const hasRouteData = originalRoute || alternateRoute || selectedWaypoints.length > 0 || avoidanceZones.length > 0;
		
		if (hasRouteData) {
			const confirmSwitch = window.confirm(
				'Do you want to save your current route data before switching to Monitor View? ' +
				'This will ensure all your waypoints and routes are preserved when you return.'
			);
			
			if (confirmSwitch) {
				const savedRouteId = await saveRouteStateToBackend();
				if (savedRouteId) {
					// Store the route ID for restoration
					localStorage.setItem('tempRouteId', savedRouteId);
					alert('Route data saved successfully! You can now safely switch to Monitor View.');
				} else {
					const proceedAnyway = window.confirm(
						'Failed to save route data to backend. Do you want to proceed anyway? ' +
						'(Your route data may be lost when returning to Route Designer)'
					);
					if (!proceedAnyway) {
						return; // Don't switch views
					}
				}
			}
		}
		
		// Proceed with view switch (this would be handled by your navigation logic)
		// console.log('Ready to switch to Monitor View');
	};

	// Add clear all data function
	const clearAllData = useCallback(() => {
		const confirmClear = window.confirm(
			'Are you sure you want to clear all data? This will remove:\n\n' +
			'• Start and end points\n' +
			'• All waypoints\n' +
			'• All avoidance zones\n' +
			'• Calculated routes\n' +
			'• Route information\n\n' +
			'This action cannot be undone.'
		);

		if (!confirmClear) {
			return;
		}

		console.log('Clearing all route data...');

		// Clear all state variables
		setStartPoint('');
		setEndPoint('');
		setStartPointLatLng(null);
		setEndPointLatLng(null);
		setSelectedWaypoints([]);
		setAdditionalWaypoints([]);
		setAvoidanceZones([]);
		setDirections(null);
		setCurrentDirections(null);
		setOriginalRoute(null);
		setAlternateRoute(null);
		setSelectedRoute('original');
		setIsRouteCalculated(false);
		setRouteWarning(null);
		setPreviewZone(null);
		
		// Clear form fields
		setRouteName('');
		setRouteDescription('');
		setSupplierName('');
		setProjectName('');
		setOriginator('');
		
		// Reset marker types to defaults
		setStartMarkerType('distributionCenter');
		setEndMarkerType('oilWell');
		
		// Reset modes
		setIsAddingAvoidanceZone(false);
		setIsSelectingWaypoints(false);
		
		// Clear input field values in DOM
		const startInput = document.getElementById('startPoint');
		const endInput = document.getElementById('endPoint');
		if (startInput) startInput.value = '';
		if (endInput) endInput.value = '';
		
		// Clear all markers from map
		if (markersRef.current) {
			for (const marker of markersRef.current) {
				marker.setMap(null);
			}
			markersRef.current = [];
		}
		
		// Clear all circles from map
		for (const [circle] of circlesRef.current) {
			try {
				if (circle && typeof circle.setMap === 'function') {
					circle.setMap(null);
				}
			} catch (error) {
				console.error('Error removing circle during clear:', error);
			}
		}
		circlesRef.current.clear();
		
		// Clear directions renderer
		if (directionsRendererRef.current) {
			try {
				directionsRendererRef.current.setDirections(null);
				directionsRendererRef.current.setMap(null);
				directionsRendererRef.current.setPanel(null);
			} catch (error) {
				console.error('Error clearing directions renderer:', error);
			}
			directionsRendererRef.current = null;
		}
		
		// Force DirectionsRenderer to unmount and remount by updating a key
		setDirectionsKey(prev => prev + 1);
		
		// Reset map to default center and zoom
		if (mapRef.current) {
			mapRef.current.setCenter(defaultCenter);
			mapRef.current.setZoom(mapZoom);
		}
		
		// Clear localStorage data
		localStorage.removeItem('lastUsedCoordinates');
		localStorage.removeItem('avoidanceZones');
		localStorage.removeItem('routeDesignerState');
		localStorage.removeItem('tempRouteId');
		
		// Re-enable auto-fit bounds
		setShouldAutoFitBounds(true);
		
		console.log('All route data cleared successfully');
		setRouteWarning('All data cleared. Ready for new route.');
		
		// Clear success message after 3 seconds
		setTimeout(() => {
			setRouteWarning(null);
		}, 3000);
	}, [mapZoom]);

	// Update the handlers to use the full address
	const handleStartPointChange = useCallback((e) => {
		// Just log the change, don't update state
		// console.log('Start point changed:', e.target.value);
	}, []);

	const handleEndPointChange = useCallback((e) => {
		// Just log the change, don't update state
		// console.log('End point changed:', e.target.value);
	}, []);

	// Update the calculate route function to get values directly from inputs
	const handleCalculateRoute = useCallback(() => {
		const startInput = document.getElementById('startPoint');
		const endInput = document.getElementById('endPoint');
		const startValue = startInput.value;
		const endValue = endInput.value;

		// console.log('Calculate Route - Start Point:', startValue);
		// console.log('Calculate Route - End Point:', endValue);

		if (!startValue || !endValue) {
			setRouteWarning("Please enter both start and end points");
			return;
		}

		// Update state only when calculating route
		setStartPoint(startValue);
		setEndPoint(endValue);

		// Parse coordinates directly if they're in lat,lng format
		const startCoordMatch = startValue.match(/^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/);
		const endCoordMatch = endValue.match(/^([-+]?\d*\.?\d+)[,\s]+([-+]?\d*\.?\d+)$/);

		console.log('Coordinate parsing:', {
			startValue,
			endValue,
			startCoordMatch,
			endCoordMatch
		});

		if (startCoordMatch && endCoordMatch) {
			// If both are coordinates, create LatLng objects directly
			const startLat = parseFloat(startCoordMatch[1]);
			const startLng = parseFloat(startCoordMatch[2]);
			const endLat = parseFloat(endCoordMatch[1]);
			const endLng = parseFloat(endCoordMatch[2]);
			
			console.log('Parsed coordinates:', {
				start: { lat: startLat, lng: startLng },
				end: { lat: endLat, lng: endLng }
			});
			
			const startLatLng = new window.google.maps.LatLng(startLat, startLng);
			const endLatLng = new window.google.maps.LatLng(endLat, endLng);

			setStartPointLatLng(startLatLng);
			setEndPointLatLng(endLatLng);

			// Center map on the route
			if (mapRef.current) {
				const bounds = new window.google.maps.LatLngBounds();
				bounds.extend(startLatLng);
				bounds.extend(endLatLng);
				mapRef.current.fitBounds(bounds, {
					padding: { top: 50, right: 50, bottom: 50, left: 50 }
				});
			}

			// Calculate route with coordinates
			const directionsService = new window.google.maps.DirectionsService();
			directionsService.route(
				{
					origin: startLatLng,
					destination: endLatLng,
					travelMode: window.google.maps.TravelMode.DRIVING,
				},
				directionsCallback
			);
		} else {
			// If not coordinates, use geocoding
			const geocoder = new window.google.maps.Geocoder();
			
			// Geocode start point
			geocoder.geocode({ 
				address: startValue,
				componentRestrictions: { country: 'US' }
			}, (results, status) => {
				if (status === 'OK' && results[0]) {
					const startLatLng = results[0].geometry.location;
					setStartPointLatLng(startLatLng);
					
					// Geocode end point after start point is found
					geocoder.geocode({ 
						address: endValue,
						componentRestrictions: { country: 'US' }
					}, (endResults, endStatus) => {
						if (endStatus === 'OK' && endResults[0]) {
							const endLatLng = endResults[0].geometry.location;
							setEndPointLatLng(endLatLng);

							// Calculate route with geocoded coordinates
							const directionsService = new window.google.maps.DirectionsService();
							directionsService.route(
								{
									origin: startLatLng,
									destination: endLatLng,
									travelMode: window.google.maps.TravelMode.DRIVING,
								},
								directionsCallback
							);
						} else {
							setRouteWarning(`Error geocoding end point: ${endStatus}`);
						}
					});
				} else {
					setRouteWarning(`Error geocoding start point: ${status}`);
				}
			});
		}
	}, [directionsCallback]);

	// Update the marker creation effect
	useEffect(() => {
		if (!isLoaded || !window.google || !mapRef.current) return;

		const updateMarkers = () => {
			// Clear existing markers
			if (markersRef.current) {
				for (const marker of markersRef.current) {
					marker.setMap(null);
				}
			}
			markersRef.current = [];

			// Create start marker
			if (startPointLatLng) {
				const startType = MARKER_TYPES.find(t => t.id === startMarkerType);
				const startMarker = new window.google.maps.Marker({
					position: startPointLatLng,
					map: mapRef.current,
					title: startType.name,
					label: {
						text: "DC",
						color: "#FFFFFF",
						fontSize: "14px",
						fontWeight: "bold"
					},
					icon: {
						...startType.icon,
						anchor: new window.google.maps.Point(12, 12),
						labelOrigin: new window.google.maps.Point(12, 0)
					},
					zIndex: 1000
				});
				markersRef.current.push(startMarker);
				console.log('Start marker created at:', startPointLatLng.toString());
			}

			// Create end marker
			if (endPointLatLng) {
				const endType = MARKER_TYPES.find(t => t.id === endMarkerType);
				const endMarker = new window.google.maps.Marker({
					position: endPointLatLng,
					map: mapRef.current,
					title: endType.name,
					label: {
						text: "DEST",
						color: "#FFFFFF",
						fontSize: "14px",
						fontWeight: "bold"
					},
					icon: {
						...endType.icon,
						anchor: new window.google.maps.Point(12, 12),
						labelOrigin: new window.google.maps.Point(12, 0)
					},
					zIndex: 1000
				});
				markersRef.current.push(endMarker);
				console.log('End marker created at:', endPointLatLng.toString());
			}

			// Fit bounds to show all markers (only if auto-fit is enabled AND not during restoration)
			if (markersRef.current.length > 0 && shouldAutoFitBounds && !isRestoringData) {
				const bounds = new window.google.maps.LatLngBounds();
				let validMarkersCount = 0;
				
				for (const marker of markersRef.current) {
					const position = marker.getPosition();
					// Handle Google Maps LatLng objects properly
					if (position && 
						typeof position.lat === 'function' && 
						typeof position.lng === 'function') {
						try {
							const lat = position.lat();
							const lng = position.lng();
							if (Number.isFinite(lat) && Number.isFinite(lng)) {
								bounds.extend(position);
								validMarkersCount++;
							} else {
								console.warn('Invalid marker coordinates:', { lat, lng });
							}
						} catch (error) {
							console.warn('Error getting marker coordinates:', error, position);
						}
					} else {
						console.warn('Invalid marker position object:', position);
					}
				}
				
				// Only fit bounds if we have valid markers
				if (validMarkersCount > 0) {
					mapRef.current.fitBounds(bounds, {
						padding: {
							top: 50,
							right: 50,
							bottom: 50,
							left: 50
						}
					});
				} else {
					console.warn('No valid markers found for bounds calculation');
				}
			}
		};

		// Always update markers if we have coordinates, regardless of restoration state
		if (startPointLatLng && endPointLatLng) {
			console.log('Updating markers - isRestoringData:', isRestoringData, 'shouldAutoFitBounds:', shouldAutoFitBounds);
			updateMarkers();
		}

		return () => {
			for (const marker of markersRef.current) {
				marker.setMap(null);
			}
			markersRef.current = [];
		};
	}, [isLoaded, startPointLatLng, endPointLatLng, startMarkerType, endMarkerType, shouldAutoFitBounds, isRestoringData]);

	if (!isLoaded) return <div>Loading...</div>;

	return (
		<div className="relative">
			{/* Custom cursor */}
			{isAddingAvoidanceZone && (
				<div 
					className="avoidance-cursor"
					style={{
						left: cursorPosition.x,
						top: cursorPosition.y,
						color: getAvoidanceZoneColor(selectedAvoidanceType)
					}}
				/>
			)}
			{isSelectingWaypoints && (
				<div 
					className="waypoint-cursor"
					style={{
						left: cursorPosition.x,
						top: cursorPosition.y
					}}
				/>
			)}
		{/* Place WORKSIDE Header Here */}
		{/* <div className="absolute top-0 right-4 z-10 w-full h-12 bg-white flex items-center justify-center text-2xl font-bold">
				<span className="text-bold text-green-500">WORK</span>SIDE Logistics
		</div> */}
			<div className="absolute top-8 right-4 z-10 bg-white p-4 rounded shadow max-w-md
			">
				<div className="mb-2">
					<div className="flex items-center gap-2 mb-1">
						<label htmlFor="startPoint" className="block text-base font-bold text-gray-700">
							Start Point
						</label>
						<button
							type="button"
							onClick={() => {
								setCurrentMarkerPointType('start');
								setIsMarkerTypeModalOpen(true);
							}}
							className="p-1 rounded hover:bg-gray-100"
							title="Change marker type"
						>
							<svg
								viewBox="0 0 24 24"
								className="w-5 h-5"
								style={{
									fill: MARKER_TYPES.find(t => t.id === startMarkerType)?.icon.fillColor,
									stroke: MARKER_TYPES.find(t => t.id === startMarkerType)?.icon.strokeColor,
									strokeWidth: MARKER_TYPES.find(t => t.id === startMarkerType)?.icon.strokeWeight
								}}
							>
								<path d={MARKER_TYPES.find(t => t.id === startMarkerType)?.icon.path} />
							</svg>
						</button>
					</div>
					<input
						id="startPoint"
						type="text"
						placeholder="Enter distribution center address"
						defaultValue={startPoint}
						onChange={handleStartPointChange}
						className="border p-2 w-full rounded"
					/>
				</div>
				<div className="mb-1">
					<div className="flex items-center gap-2 mb-1">
						<label htmlFor="endPoint" className="block text-base font-bold text-gray-700">
							End Point
						</label>
						<button
							type="button"
							onClick={() => {
								setCurrentMarkerPointType('end');
								setIsMarkerTypeModalOpen(true);
							}}
							className="p-1 rounded hover:bg-gray-100"
							title="Change marker type"
						>
							<svg
								viewBox="0 0 24 24"
								className="w-5 h-5"
								style={{
									fill: MARKER_TYPES.find(t => t.id === endMarkerType)?.icon.fillColor,
									stroke: MARKER_TYPES.find(t => t.id === endMarkerType)?.icon.strokeColor,
									strokeWidth: MARKER_TYPES.find(t => t.id === endMarkerType)?.icon.strokeWeight
								}}
							>
								<path d={MARKER_TYPES.find(t => t.id === endMarkerType)?.icon.path} />
							</svg>
						</button>
					</div>
					<input
						id="endPoint"
						type="text"
						placeholder="Enter oil well location"
						defaultValue={endPoint}
						onChange={handleEndPointChange}
						className="border p-2 w-full rounded"
					/>
				</div>
				<button
					type="button"
					onClick={handleCalculateRoute}
					className="w-full bg-green-500 text-black font-bold px-4 py-1 rounded button-3d hover:bg-green-600 mb-2"
				>
					Calculate Route
				</button>

				{/* Avoidance Zones Section */}
				<div className="mb-1 border-t pt-2">
					<h3 className="text-lg font-semibold mb-2">Route Avoidance</h3>
					<div className="mb-2">
						<label htmlFor="avoidanceType" className="block text-sm font-medium text-gray-700 mb-1">
							Select Area Type to Avoid
						</label>
						<select
							id="avoidanceType"
							value={selectedAvoidanceType}
							onChange={(e) => setSelectedAvoidanceType(e.target.value)}
							className="border p-2 w-full rounded bg-white"
						>
							<option value="residential">Residential Areas</option>
							<option value="school">Schools</option>
							<option value="hospital">Hospitals</option>
							<option value="other">Other</option>
						</select>
					</div>
					<button
						type="button"
						onClick={() => {
							setIsAddingAvoidanceZone(!isAddingAvoidanceZone);
						}}
						className={`w-full p-1 rounded button-3d ${
							isAddingAvoidanceZone 
								? 'bg-red-500 hover:bg-red-600 text-white font-bold' 
								: 'bg-green-500 hover:bg-green-600 text-black font-bold'
						} transition-colors mb-2`}
					>
						{isAddingAvoidanceZone ? 'Cancel Adding Zone' : 'Add Avoidance Zone'}
					</button>

					{/* Active Avoidance Zones */}
					{avoidanceZones.length > 0 && (
						<div className="mb-1">
							<h4 className="font-medium mb-1">Active Avoidance Zones:</h4>
							<div className="max-h-40 overflow-y-auto">
								{avoidanceZones.map(zone => {
									return (
									<div key={zone.id} className="mb-2 p-2 bg-gray-100 rounded border">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<div className="flex items-center mb-1">
													<div 
														className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
														style={{ backgroundColor: getAvoidanceZoneColor(zone.type) }}
													/>
													<span className="font-medium text-sm">
														{zone.label || `${zone.type} Zone`}
													</span>
												</div>
												<div className="text-xs text-gray-600 ml-5">
													<div className="capitalize">Type: {zone.type} • Radius: {zone.radius}m</div>
													{zone.description && (
														<div className="mt-1 italic">{zone.description}</div>
													)}
												</div>
											</div>
											<button
												type="button"
												onClick={() => removeAvoidanceZone(zone.id)}
												className="bg-red-500 hover:bg-red-600 text-white font-bold button-3d px-2 py-0.5 rounded transition-colors text-xs ml-2"
												title="Delete this zone"
											>
												×
											</button>
										</div>
									</div>
									);
								})}
							</div>
						</div>
					)}

					{isSelectingWaypoints && (
						<div className="mb-2">
							<p className="text-sm text-gray-600 mb-1">
								Click on the map to add waypoints. The route will go through these points.
							</p>
						</div>
					)}

					{/* Display Additional Waypoints */}
					{additionalWaypoints.length > 0 && (
						<div className="mb-2">
							<h4 className="font-medium mb-1">Additional Waypoints:</h4>
							<div className="max-h-40 overflow-y-auto">
								{additionalWaypoints.map((point, index) => (
									<div key={point.id} className="flex items-center justify-between mb-1 p-2 bg-gray-100 rounded">
										<span>Point {index + 1}: ({point.lat.toFixed(6)}, {point.lng.toFixed(6)})</span>
										<button
											type="button"
											onClick={() => setAdditionalWaypoints(prev => prev.filter(p => p.id !== point.id))}
											className="bg-red-500 hover:bg-red-600 text-white font-bold button-3d px-2 py-0.5 rounded transition-colors text-sm"
										>
											Remove
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Manual Waypoint Selection Section */}
				<div className="mb-2 border-t pt-4">
					<h3 className="text-lg font-semibold mb-1s">Select Waypoints</h3>
					<button
						type="button"
						onClick={() => {
							setIsSelectingWaypoints(!isSelectingWaypoints);
						}}
						className={`w-full p-1 rounded button-3d ${
							isSelectingWaypoints 
								? 'bg-red-500 hover:bg-red-600 text-white font-bold' 
								: 'bg-green-500 hover:bg-green-600 text-black font-bold'
						} transition-colors mb-2`}
					>
						{isSelectingWaypoints ? 'Cancel Selection' : 'Select Waypoints'}
					</button>
					
					{isSelectingWaypoints && (
						<div className="mb-2">
							<p className="text-sm text-gray-600 mb-1">
								Click on intersections to create waypoints. Select at least 2 points to create a route.
							</p>
							<div className="flex items-center gap-2">
								<input
									type="text"
									placeholder="Route Name"
									value={routeName}
									onChange={(e) => setRouteName(e.target.value)}
									className="border p-2 rounded flex-1"
								/>
							</div>
						</div>
					)}

					{/* Selected Waypoints List */}
					{selectedWaypoints.length > 0 && (
						<div className="mb-2">
							<h4 className="font-medium mb-1">Selected Waypoints:</h4>
							<div className="max-h-40 overflow-y-auto">
								{selectedWaypoints.map((wp, index) => {
									// Safe coordinate extraction with fallbacks for different formats
									let lat, lng;
									
									if (wp.coordinates && Array.isArray(wp.coordinates) && wp.coordinates.length >= 2) {
										// GeoJSON format from backend: [longitude, latitude]
										lng = wp.coordinates[0];
										lat = wp.coordinates[1];
									} else if (wp.lat && wp.lng) {
										// Direct lat/lng properties
										lat = wp.lat;
										lng = wp.lng;
									} else if (wp.position && wp.position.lat && wp.position.lng) {
										// Position object format
										lat = wp.position.lat;
										lng = wp.position.lng;
									} else {
										// Fallback to 0
										lat = 0;
										lng = 0;
									}
									
									return (
									<div key={wp.id} className="flex items-center justify-between mb-2 mr-2p-2 bg-gray-100 rounded">
										<span>Point {index + 1}: ({(typeof lat === 'number' ? lat : 0).toFixed(6)}, {(typeof lng === 'number' ? lng : 0).toFixed(6)})</span>
										<button
											type="button"
											onClick={() => setSelectedWaypoints(prev => prev.filter(p => p.id !== wp.id))}
											className="bg-red-500 hover:bg-red-600 text-white font-bold button-3d px-2 py-0.5 rounded transition-colors text-sm"
										>
											Remove
										</button>
									</div>
									);
								})}
							</div>
							<button
								type="button"
								onClick={() => {
									console.log('Clearing all waypoints');
									setSelectedWaypoints([]);
								}}
								className="w-full mt-1 bg-red-500 text-white font-bold px-3 py-1 rounded button-3d hover:bg-red-600 transition-colors text-sm"
							>
								Clear All Waypoints
							</button>
						</div>
					)}

					{/* Calculate Route Button */}
					<button
						type="button"
						onClick={calculateRoute}
						className="w-full bg-green-500 text-black font-bold px-4 py-1 rounded button-3d hover:bg-green-600 transition-colors"
					>
						Calculate Alternate Route
					</button>
				</div>

				{/* Active Avoidance Zones */}
				{/* {avoidanceZones.length > 0 && (
					<div className="mb-4 border-t pt-2">
						<h3 className="text-lg font-semibold mb-2">Active Avoidance Zones</h3>
						<div className="max-h-40 overflow-y-auto">
							{avoidanceZones.map(zone => (
								<div key={zone.id} className="flex items-center justify-between mb-1 p-2 bg-gray-100 rounded">
									<div className="flex items-center">
										<div 
											className="w-3 h-3 rounded-full mr-2"
											style={{ backgroundColor: getAvoidanceZoneColor(zone.type) }}
										/>
										<span className="capitalize">{zone.type}</span>
									</div>
									<button
										type="button"
										onClick={() => removeAvoidanceZone(zone.id)}
										className="bg-red-500 hover:bg-red-600 text-white font-bold button-3d px-2 py-0.5 rounded transition-colors text-sm"
									>
										Remove
									</button>
								</div>
							))}
						</div>
					</div>
					)} */}
			</div>
			{routeWarning && (
				<div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg z-20">
					<p>{routeWarning}</p>
				</div>
			)}

			<GoogleMap
				key={directionsKey}
				mapContainerStyle={containerStyle}
				center={defaultCenter}
				zoom={mapZoom}
				onClick={handleMapClick}
				onLoad={onMapLoad}
				onUnmount={onMapUnmount}
				options={{
					mapTypeControl: true,
					streetViewControl: true,
					fullscreenControl: true,
					zoomControl: true,
					gestureHandling: 'greedy',
					draggableCursor: 'none',
					draggingCursor: 'none',
					preserveViewport: true,
					noClear: true
				}}
			>
				{/* Render selected waypoints as blue markers */}
				{selectedWaypoints.map(point => {
					// Safe coordinate extraction with fallbacks for different formats
					let lat, lng;
					
					if (point.coordinates && Array.isArray(point.coordinates) && point.coordinates.length >= 2) {
						// GeoJSON format from backend: [longitude, latitude]
						lng = point.coordinates[0];
						lat = point.coordinates[1];
					} else if (point.lat && point.lng) {
						// Direct lat/lng properties
						lat = point.lat;
						lng = point.lng;
					} else if (point.position && point.position.lat && point.position.lng) {
						// Position object format
						lat = point.position.lat;
						lng = point.position.lng;
					}
					
					// Only render marker if we have valid coordinates
					if (typeof lat !== 'number' || typeof lng !== 'number') {
						console.warn('Invalid waypoint coordinates:', point);
						return null;
					}
					
					console.log(`Rendering waypoint marker at lat: ${lat}, lng: ${lng}, id: ${point.id}`);
					console.log(`Map center:`, mapRef.current ? mapRef.current.getCenter() : 'Map not loaded');
					console.log(`Map zoom:`, mapRef.current ? mapRef.current.getZoom() : 'Map not loaded');
					
					// Use stable key during data restoration to prevent unmounting
					const markerKey = isRestoringData ? `waypoint-stable-${point.id}` : `waypoint-${point.id}-${directionsKey}`;
					
					return (
					<Marker
						key={markerKey}
						position={{ lat, lng }}
						icon={{
							url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
							scaledSize: new window.google.maps.Size(32, 32)
						}}
						zIndex={1000}
						visible={true}
						onClick={() => {
							console.log(`Waypoint marker clicked: lat=${lat}, lng=${lng}, id=${point.id}`);
						}}
						title={`Waypoint ${point.id}: (${lat.toFixed(6)}, ${lng.toFixed(6)})`}
						onLoad={(marker) => {
							console.log(`Waypoint marker ${point.id} loaded successfully:`, marker);
							console.log(`Waypoint marker ${point.id} position:`, marker.getPosition());
							console.log(`Waypoint marker ${point.id} visible:`, marker.getVisible());
							console.log(`Waypoint marker ${point.id} map:`, marker.getMap());
						}}
						onUnmount={() => {
							console.log(`Waypoint marker ${point.id} unmounted!`);
						}}
					/>
					);
				})}

				{/* Debug: Add a test marker at a known location when there are waypoints */}
				{selectedWaypoints.length > 0 && (
					<Marker
						key="debug-marker"
						position={{ lat: 40.0, lng: -105.0 }}
						icon={{
							path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
							scale: 15,
							fillColor: "#FF0000",
							fillOpacity: 1,
							strokeColor: "#000000",
							strokeWeight: 2
						}}
						zIndex={1100}
						title="Debug marker - If you see this, markers are working"
						onClick={() => {
							console.log('Debug marker clicked - markers are working!');
						}}
						onLoad={(marker) => {
							console.log('Debug marker loaded successfully:', marker);
						}}
					/>
				)}

				{/* Simple test marker - always visible */}
				<Marker
					key="always-visible-marker"
					position={{ lat: 39.7392, lng: -104.9903 }} // Denver, CO
					icon={{
						url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
						scaledSize: new window.google.maps.Size(32, 32)
					}}
					zIndex={1200}
					title="Always visible test marker - Denver"
					onClick={() => {
						console.log('Always visible marker clicked!');
					}}
					onLoad={(marker) => {
						console.log('Always visible marker loaded successfully:', marker);
					}}
				/>

				{directions && !isSwitchingRoute && directions?.routes?.length > 0 && (
					<DirectionsRenderer
						key={`directions-${selectedRoute}-${directionsKey}`}
						directions={directions}
						options={{
							suppressMarkers: true,
							polylineOptions: {
								strokeColor: selectedRoute === 'original' ? '#4CAF50' : '#FFA500',
								strokeWeight: 5,
								strokeOpacity: 0.8
							},
							panel: directionsPanelRef.current
						}}
						onLoad={renderer => {
							if (renderer && directions && directions.routes && directions.routes.length > 0) {
								console.log('Directions renderer loaded, setting directions');
								directionsRendererRef.current = renderer;
								
								try {
									renderer.setMap(mapRef.current);
									// Ensure panel exists before setting directions
									if (directionsPanelRef.current) {
										renderer.setPanel(directionsPanelRef.current);
									}
									// Validate directions object before setting
									if (directions && 
										typeof directions === 'object' && 
										directions.routes && 
										Array.isArray(directions.routes) && 
										directions.routes.length > 0) {
										renderer.setDirections(directions);
										console.log('Directions set successfully');
									} else {
										console.warn('Invalid directions object, skipping setDirections');
									}
								} catch (error) {
									console.error('Error setting directions in renderer:', error);
									setRouteWarning('Error displaying route. Please try again.');
								}
							} else {
								console.log('Directions renderer loaded but no valid directions available');
							}
						}}
						onUnmount={() => {
							if (directionsRendererRef.current) {
								// console.log('Directions renderer unmounted');
								try {
									directionsRendererRef.current.setDirections(null);
									directionsRendererRef.current.setMap(null);
									directionsRendererRef.current.setPanel(null);
								} catch (error) {
									console.error('Error cleaning up directions renderer:', error);
								}
								directionsRendererRef.current = null;
							}
						}}
						/>
				)}
			</GoogleMap>

			{directions && (
				<div 
					ref={resizeRef}
					className={`absolute bottom-8 left-4 bg-white rounded shadow transition-all duration-300 ${isDirectionsMinimized ? 'w-12 h-12' : ''}`}
					style={{ width: isDirectionsMinimized ? '48px' : `${panelWidth}px`, marginBottom: '16px' }}
				>
					<button
						type="button"
						onClick={toggleDirections}
						className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
						aria-label={isDirectionsMinimized ? "Expand directions" : "Minimize directions"}
					>
						{isDirectionsMinimized ? (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Expand directions</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						) : (
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Minimize directions</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
							</svg>
						)}
					</button>
					
					{!isDirectionsMinimized && (
						<>
							<div className="p-4">
								{/* Route Name Display */}
								{routeName && (
									<div className="mb-4">
										<h2 className="text-xl font-bold text-gray-800">{routeName}</h2>
										{routeDescription && (
											<p className="text-sm text-gray-600 mt-1">{routeDescription}</p>
										)}
									</div>
								)}
								<h2 className="text-xl font-bold mb-2">Route Directions</h2>
								
								{/* Route Selector */}
								{originalRoute && alternateRoute && (
									<div className="mb-4">
										<div className="flex gap-2 mb-2">
											<button
												type="button"
												onClick={() => {
													if (selectedRoute === 'original') return; // Already selected
													
													setIsSwitchingRoute(true);
													
													// Validate original route before switching
													if (!originalRoute || !originalRoute.routes || originalRoute.routes.length === 0) {
														console.warn('Original route is not valid');
														setIsSwitchingRoute(false);
														return;
													}
													
													// Clear current directions safely
													setDirections(null);
													setCurrentDirections(null);
													
													// Update route selection and directions
													setTimeout(() => {
														setSelectedRoute('original');
														setDirections(originalRoute);
														setCurrentDirections(originalRoute);
														
														// Update context for monitor view
														saveRouteData({
															original: originalRoute,
															alternate: alternateRoute,
															waypoints: selectedWaypoints,
															additionalWaypoints: additionalWaypoints,
															avoidanceZones: avoidanceZones,
															selectedRouteType: 'original'
														});
														
														setIsSwitchingRoute(false);
													}, 150);
												}}
												className={`flex-1 p-2 rounded button-3d ${
													selectedRoute === 'original'
														? 'bg-[#4CAF50] text-white'
														: 'bg-gray-200 text-gray-700'
												}`}
											>
												Original Route
												<div className="text-sm">
													{originalRoute?.routes[0]?.legs[0]?.distance?.text} • {originalRoute?.routes[0]?.legs[0]?.duration?.text}
												</div>
											</button>
											<button
												type="button"
												onClick={() => {
													if (selectedRoute === 'alternate') return; // Already selected
													
													setIsSwitchingRoute(true);
													
													// Validate alternate route before switching
													if (!alternateRoute || !alternateRoute.routes || alternateRoute.routes.length === 0) {
														console.warn('Alternate route is not valid');
														setIsSwitchingRoute(false);
														return;
													}
													
													// Clear current directions safely
													setDirections(null);
													setCurrentDirections(null);
													
													// Update route selection and directions
													setTimeout(() => {
														setSelectedRoute('alternate');
														setDirections(alternateRoute);
														setCurrentDirections(alternateRoute);
														
														// Update context for monitor view
														saveRouteData({
															original: originalRoute,
															alternate: alternateRoute,
															waypoints: selectedWaypoints,
															additionalWaypoints: additionalWaypoints,
															avoidanceZones: avoidanceZones,
															selectedRouteType: 'alternate'
														});
														
														setIsSwitchingRoute(false);
													}, 150);
												}}
												className={`flex-1 p-2 rounded button-3d ${
													selectedRoute === 'alternate'
														? 'bg-[#FFA500] text-white'
														: 'bg-gray-200 text-gray-700'
												}`}
											>
												Alternate Route
												<div className="text-sm">
													{alternateRoute?.routes[0]?.legs[0]?.distance?.text} • {alternateRoute?.routes[0]?.legs[0]?.duration?.text}
												</div>
											</button>
										</div>
									</div>
								)}

								{/* Route Summary */}
								<div className="mb-4 p-3 bg-green-50 rounded">
									<div className="flex justify-between items-center mb-2">
										<span className="font-medium">Total Distance:</span>
										<span>{directions.routes[0].legs[0].distance.text}</span>
									</div>
									<div className="flex justify-between items-center mb-2">
										<span className="font-medium">Estimated Time:</span>
										<span>{directions.routes[0].legs[0].duration.text}</span>
									</div>
									<div className="flex justify-between items-center">
										<span className="font-medium">Total Waypoints:</span>
										<span>{selectedWaypoints.length + additionalWaypoints.length}</span>
									</div>
								</div>

								{/* Directions Panel */}
								<div 
									ref={directionsPanelRef}
									className="max-h-60 overflow-y-auto"
									key={`directions-panel-${selectedRoute}`}
									style={{ display: directions?.routes?.length > 0 ? 'block' : 'none' }}
								/>
							</div>
							<div
								className="absolute top-0 right-0 w-1 h-full cursor-ew-resize hover:bg-green-500"
								onMouseDown={startResizing}
							/>
						</>
					)}
				</div>
			)}

			<div className="absolute top-4 right-4 text-sm text-gray-600">
				Copyright Workside Software 2025
			</div>

			{/* Load/Save Route Buttons */}
			<div className="absolute top-14 left-2 z-50 flex flex-col gap-2">
				<button
					type="button"
					onClick={() => {
						// Check if there are unsaved changes
						const hasUnsavedChanges = 
							startPoint !== '' || 
							endPoint !== '' || 
							selectedWaypoints.length > 0 || 
							avoidanceZones.length > 0 || 
							additionalWaypoints.length > 0 || 
							isRouteCalculated;

						if (hasUnsavedChanges) {
							if (window.confirm('You have unsaved changes. Are you sure you want to discard them and load a new route?')) {
								fetchSavedRoutes(); // Fetch routes before opening modal
								setIsLoadModalOpen(true);
							}
						} else {
							fetchSavedRoutes(); // Fetch routes before opening modal
							setIsLoadModalOpen(true);
						}
					}}
					className="w-68 px-4 py-1 bg-green-500 text-black font-bold rounded button-3d hover:bg-green-600 text-center shadow-lg"
				>
					Load Route
				</button>
				<button
					type="button"
					onClick={() => {
						if (!startPoint || !endPoint) {
							setRouteWarning('Please enter both start and end points before saving.');
							return;
						}
						if (!isRouteCalculated) {
							setRouteWarning('Please calculate the route before saving.');
							return;
						}
						setIsSaveModalOpen(true);
					}}
					className={`w-60 px-4 py-1 rounded button-3d text-center shadow-lg transition-all duration-200 ${
						!startPoint || !endPoint || !isRouteCalculated || isSavingRoute
							? 'bg-gray-400 cursor-not-allowed text-white font-bold'
							: 'bg-green-500 hover:bg-green-600 text-black font-bold'
					}`}
					disabled={!startPoint || !endPoint || !isRouteCalculated || isSavingRoute}
				>
					{isSavingRoute ? (
						<div className="flex items-center justify-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							<span>Saving...</span>
						</div>
					) : (
						'Save Route'
					)}
				</button>
				
				{/* Clear All Button */}
				<button
					type="button"
					onClick={clearAllData}
					className="w-60 px-4 py-1 bg-red-500 text-white font-bold rounded button-3d hover:bg-red-600 text-center shadow-lg transition-all duration-200"
					title="Clear all route data and start fresh"
				>
					🗑️ Clear Route Data
				</button>
			</div>

			{/* Route Modals */}
			<RouteModals
				isSaveModalOpen={isSaveModalOpen}
				isLoadModalOpen={isLoadModalOpen}
				onClose={() => {
					// console.log('Modal close button clicked');
					setIsSaveModalOpen(false);
					setIsLoadModalOpen(false);
				}}
				routeName={routeName}
				setRouteName={setRouteName}
				routeDescription={routeDescription}
				setRouteDescription={setRouteDescription}
				supplierName={supplierName}
				setSupplierName={setSupplierName}
				projectName={projectName}
				setProjectName={setProjectName}
				originator={originator}
				setOriginator={setOriginator}
				onSave={handleSaveRoute}
				savedRoutes={savedRoutes}
				onLoad={handleLoadRoute}
				onDelete={handleDeleteRoute}
			/>

			{/* Add the MarkerTypeModal */}
			<MarkerTypeModal
				isOpen={isMarkerTypeModalOpen}
				onClose={() => setIsMarkerTypeModalOpen(false)}
				onSelect={handleMarkerTypeSelect}
				currentType={currentMarkerPointType === 'start' ? startMarkerType : endMarkerType}
				pointType={currentMarkerPointType}
			/>

			{isAddingAvoidanceZone && (
				<div className="mb-3">
					<p className="text-sm text-gray-600 mb-2">
						Click on the map to place an avoidance zone of type "{selectedAvoidanceType}".
					</p>
				</div>
			)}

			{/* Zone Creation Modal */}
			{isZoneCreationModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h2 className="text-xl font-bold mb-4">
							{pendingZoneLocation && selectedZone ? 'Edit Avoidance Zone' : 'Create Avoidance Zone'}
						</h2>
						
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Zone Label *
							</label>
							<input
								type="text"
								value={zoneCreationData.label}
								onChange={(e) => setZoneCreationData(prev => ({ ...prev, label: e.target.value }))}
								placeholder="e.g., School Zone - Elementary"
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Zone Type *
							</label>
							<select
								value={zoneCreationData.type}
								onChange={(e) => setZoneCreationData(prev => ({ ...prev, type: e.target.value }))}
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
							>
								<option value="residential">Residential Area</option>
								<option value="school">School Zone</option>
								<option value="hospital">Hospital Zone</option>
								<option value="other">Other</option>
							</select>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Description
							</label>
							<textarea
								value={zoneCreationData.description}
								onChange={(e) => setZoneCreationData(prev => ({ ...prev, description: e.target.value }))}
								placeholder="Optional description of this avoidance zone..."
								rows="3"
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
						</div>

						<div className="mb-6">
							<div className="text-sm text-gray-600">
								<p><strong>Location:</strong> {pendingZoneLocation?.lat.toFixed(6)}, {pendingZoneLocation?.lng.toFixed(6)}</p>
								<p><strong>Creator:</strong> {originator || 'Anonymous'}</p>
							</div>
						</div>

						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Radius (meters) *
							</label>
							<input
								type="number"
								value={zoneCreationData.radius}
								onChange={(e) => setZoneCreationData(prev => ({ ...prev, radius: parseInt(e.target.value) || 500 }))}
								placeholder="500"
								min="50"
								max="5000"
								step="50"
								className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
							/>
							<p className="text-xs text-gray-500 mt-1">Recommended: 200-1000m for most zones</p>
						</div>

						<div className="flex gap-3 justify-end">
							<button
								type="button"
								onClick={() => {
									setIsZoneCreationModalOpen(false);
									setPendingZoneLocation(null);
									setZoneCreationData({ label: '', description: '', type: 'residential', radius: 500 });
								}}
								className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={async () => {
									if (!zoneCreationData.label.trim()) {
										setRouteWarning('Please enter a zone label.');
										return;
									}

									const zoneData = {
										location: pendingZoneLocation,
										type: zoneCreationData.type,
										radius: zoneCreationData.radius,
										label: zoneCreationData.label.trim(),
										description: zoneCreationData.description.trim(),
										createdBy: originator || 'RouteDesigner'
									};

									// Create the zone in the standalone collection
									const createdZone = await createAvoidanceZone(zoneData);
									
									if (createdZone) {
										console.log('Avoidance zone created successfully:', createdZone);
										
										// Close modal and reset state
										setIsZoneCreationModalOpen(false);
										setPendingZoneLocation(null);
										setZoneCreationData({ label: '', description: '', type: 'residential', radius: 500 });
										
										// Refresh zones for current view
										await loadZonesForCurrentView();
										
										setRouteWarning('Avoidance zone created successfully!');
										setTimeout(() => setRouteWarning(null), 3000);
									}
								}}
								className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
								disabled={!zoneCreationData.label.trim()}
							>
								{pendingZoneLocation && selectedZone ? 'Update Zone' : 'Create Zone'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default RouteDesigner;
