/* eslint-disable */
import React, { useEffect, useState, useRef } from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

// Singleton instance to track if Google Maps is already loaded
let googleMapsLoaded = false;
let loadScriptInstance = null;

const GoogleMapsLoader = ({ children }) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const loadScriptRef = useRef(null);

	useEffect(() => {
		return () => {
			// Cleanup when component unmounts
			setIsLoaded(false);
			if (loadScriptRef.current) {
				loadScriptRef.current = null;
			}
		};
	}, []);

	if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
		console.error("Google Maps API key is not configured");
		return <div>Google Maps API key is not configured</div>;
	}

	// If Google Maps is already loaded, just render children
	if (googleMapsLoaded) {
		return <>{children}</>;
	}

	// If we already have a LoadScript instance, use it
	if (loadScriptInstance) {
		return loadScriptInstance;
	}

	// Create new LoadScript instance
	loadScriptInstance = (
		<LoadScript
			ref={loadScriptRef}
			googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
			libraries={libraries}
			onLoad={() => {
				googleMapsLoaded = true;
				setIsLoaded(true);
			}}
			onError={(error) => {
				console.error("Error loading Google Maps:", error);
				googleMapsLoaded = false;
				loadScriptInstance = null;
			}}
		>
			{isLoaded ? children : <div>Loading Google Maps...</div>}
		</LoadScript>
	);

	return loadScriptInstance;
};

export default GoogleMapsLoader; 