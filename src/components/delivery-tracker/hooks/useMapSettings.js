import { useState, useCallback, useEffect, useRef } from "react";
import useDeliveryStore from "../stores/deliveryStore";

const STORAGE_KEY = "delivery_map_settings";
const SAVE_DELAY = 1000; // 1 second delay

const initialSettings = {
	center: {
		lat: 35.3733,
		lng: -119.0187,
	},
	zoom: 10,
	showTraffic: false,
	followVehicle: null,
};

export const useMapSettings = () => {
	const { vehicles } = useDeliveryStore();

	// Initialize state from localStorage with validation
	const [settings, setSettings] = useState(() => {
		try {
			const savedSettings = localStorage.getItem(STORAGE_KEY);
			if (savedSettings) {
				const parsed = JSON.parse(savedSettings);
				// Validate followVehicle value
				if (parsed.followVehicle) {
					const validVehicle = vehicles.some(
						(v) => v.vehicleId === parsed.followVehicle,
					);
					if (!validVehicle) {
						parsed.followVehicle = null; // Reset if invalid
					}
				}
				return parsed;
			}
			return initialSettings;
		} catch (error) {
			// console.warn("Failed to load map settings from localStorage:", error);
			return initialSettings;
		}
	});

	// Add ref for debouncing
	const saveTimeout = useRef(null);

	// Save settings to localStorage with debounce
	useEffect(() => {
		if (saveTimeout.current) {
			clearTimeout(saveTimeout.current);
		}

		saveTimeout.current = setTimeout(() => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
			} catch (error) {
				// console.warn("Failed to save map settings to localStorage:", error);
			}
		}, SAVE_DELAY);

		return () => {
			if (saveTimeout.current) {
				clearTimeout(saveTimeout.current);
			}
		};
	}, [settings]);

	const updateZoom = useCallback((zoom) => {
		setSettings((prev) => ({ ...prev, zoom }));
	}, []);

	const updateCenter = useCallback((center) => {
		setSettings((prev) => ({ ...prev, center }));
	}, []);

	const toggleTraffic = useCallback(() => {
		setSettings((prev) => ({ ...prev, showTraffic: !prev.showTraffic }));
	}, []);

	const setFollowVehicle = useCallback(
		(vehicleId) => {
			// Validate vehicleId before setting
			if (!vehicleId || vehicles.some((v) => v.vehicleId === vehicleId)) {
				setSettings((prev) => ({
					...prev,
					followVehicle: vehicleId || null,
				}));
			} else {
				// console.warn("Invalid vehicle ID:", vehicleId);
				setSettings((prev) => ({
					...prev,
					followVehicle: null,
				}));
			}
		},
		[vehicles],
	);

	const resetSettings = useCallback(() => {
		setSettings(initialSettings);
	}, []);

	const updateMapType = useCallback((mapTypeId) => {
		setSettings((prev) => ({ ...prev, mapTypeId }));
	}, []);

	const updateControlPosition = useCallback((position) => {
		setSettings((prev) => ({
			...prev,
			controlPosition: position,
		}));
	}, []);

	return {
		settings,
		updateZoom,
		updateCenter,
		toggleTraffic,
		setFollowVehicle,
		resetSettings,
		updateMapType,
		updateControlPosition,
	};
};
