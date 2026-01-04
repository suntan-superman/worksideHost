/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useRoute } from './RouteContext';
import { googleMapsConfig } from './config/googleMapsConfig';
import { APP_INFO } from '../../constants/appInfo';

const containerStyle = {
	width: '100%',
	height: 'calc(100vh - 100px)'
};

const defaultCenter = {
	lat: 40.4233,
	lng: -104.7091
};

function MonitorView() {
	const { getMonitorRoute, getRouteData } = useRoute();
	const [driverLocation, setDriverLocation] = useState(null);
	const [isDeviated, setIsDeviated] = useState(false);
	const [mapCenter, setMapCenter] = useState(defaultCenter);

	const { isLoaded } = useJsApiLoader(googleMapsConfig);

	// Get the preferred route (alternate if available, otherwise original)
	const monitorRoute = getMonitorRoute();
	const routeData = getRouteData();
	
	// Set initial map center based on route when route is first loaded
	useEffect(() => {
		if (monitorRoute && monitorRoute.routes && monitorRoute.routes[0]) {
			const route = monitorRoute.routes[0];
			const startLocation = route.legs[0].start_location;
			setMapCenter({
				lat: startLocation.lat(),
				lng: startLocation.lng()
			});
		}
	}, [monitorRoute]);
	
	// Simulate driver movement
	useEffect(() => {
		if (!monitorRoute) return;

		const route = monitorRoute.routes[0];
		const path = route.overview_path;
		let currentIndex = 0;

		const interval = setInterval(() => {
			if (currentIndex >= path.length) {
				currentIndex = 0;
			}

			const newLocation = {
				lat: path[currentIndex].lat(),
				lng: path[currentIndex].lng()
			};

			// Occasionally add some random deviation
			if (Math.random() < 0.1) {
				newLocation.lat += (Math.random() - 0.5) * 0.01;
				newLocation.lng += (Math.random() - 0.5) * 0.01;
			}

			setDriverLocation(newLocation);
			currentIndex++;
		}, 5000);

		return () => clearInterval(interval);
	}, [monitorRoute]);

	// Check for route deviation
	useEffect(() => {
		if (!driverLocation || !monitorRoute) return;

		const route = monitorRoute.routes[0];
		const path = route.overview_path;
		
		// Check if driver is within 100 meters of any point on the route
		const isNearRoute = path.some(point => {
			const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
				new window.google.maps.LatLng(driverLocation.lat, driverLocation.lng),
				point
			);
			return distance <= 100; // 100 meters
		});

		if (!isNearRoute && !isDeviated) {
			setIsDeviated(true);
			console.log(`ALERT: Driver deviated from route at [${driverLocation.lat}, ${driverLocation.lng}]`);
			alert(`ALERT: Driver deviated from route at [${driverLocation.lat}, ${driverLocation.lng}]`);
		} else if (isNearRoute) {
			setIsDeviated(false);
		}
	}, [driverLocation, monitorRoute, isDeviated]);

	if (!isLoaded) return <div>Loading...</div>;

	return (
		<div className="relative">
			<GoogleMap
				mapContainerStyle={containerStyle}
				center={mapCenter}
				zoom={14}
			>
				{monitorRoute && (
					<DirectionsRenderer
						directions={monitorRoute}
						options={{
							polylineOptions: {
								strokeColor: routeData.alternateRoute ? '#FF6B35' : '#FFD700', // Orange for alternate, gold for original
								strokeWeight: 5
							}
						}}
					/>
				)}
				
				{/* Display waypoints if available */}
				{routeData.selectedWaypoints && routeData.selectedWaypoints.map((waypoint, index) => (
					<Marker
						key={`waypoint-${waypoint.id || index}`}
						position={{ lat: waypoint.lat, lng: waypoint.lng }}
						icon={{
							path: window.google.maps.SymbolPath.CIRCLE,
							scale: 8,
							fillColor: '#2196F3',
							fillOpacity: 1,
							strokeColor: '#FFFFFF',
							strokeWeight: 2,
						}}
						label={{
							text: `${index + 1}`,
							color: '#FFFFFF',
							fontSize: '12px',
							fontWeight: 'bold'
						}}
						title={`Waypoint ${index + 1}`}
					/>
				))}
				
				{driverLocation && (
					<Marker
						position={driverLocation}
						icon={{
							path: window.google.maps.SymbolPath.CIRCLE,
							scale: 12,
							fillColor: '#4285F4',
							fillOpacity: 1,
							strokeColor: '#FFFFFF',
							strokeWeight: 2,
						}}
						label={{
							text: '🚗',
							color: '#FFFFFF',
							fontSize: '16px'
						}}
					/>
				)}
			</GoogleMap>

			<div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow">
				<h2 className="text-xl font-bold mb-2">Monitor View</h2>
				<div className="mb-2">
					<span className="font-semibold">Route Type: </span>
					<span className={routeData.alternateRoute ? 'text-orange-600' : 'text-yellow-600'}>
						{routeData.alternateRoute ? 'Alternate Route (with waypoints)' : 'Original Route'}
					</span>
				</div>
				{routeData.selectedWaypoints && routeData.selectedWaypoints.length > 0 && (
					<div className="mb-2">
						<span className="font-semibold">Waypoints: </span>
						<span className="text-blue-600">{routeData.selectedWaypoints.length} selected</span>
					</div>
				)}
				{driverLocation && (
					<p>Current Location: [{driverLocation.lat.toFixed(4)}, {driverLocation.lng.toFixed(4)}]</p>
				)}
				{isDeviated && (
					<p className="text-red-500 font-bold">ALERT: Driver has deviated from route!</p>
				)}
			</div>

			<div className="absolute top-4 right-4 text-sm text-gray-600">
				{APP_INFO.COPYRIGHT_WITH_COMPANY}
			</div>
		</div>
	);
}

export default MonitorView;
