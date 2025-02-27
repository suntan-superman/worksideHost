/* eslint-disable */
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import DeliveryMap from "./map/DeliveryMap";
import Navigation from "./layout/Navigation";
import useDeliveryStore from "../stores/deliveryStore";
import { useMapSettings } from "../hooks/useMapSettings";
import useSimulation from "../hooks/useSimulation";
import { useVehicleData } from '../hooks/useVehicleData';
import ErrorBoundary from './ErrorBoundary';

const DeliveryTracker = ({ apiKey, config, onVehicleSelect }) => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const { 
		setVehicles, 
		setDestinations, 
		isSimulationRunning,
		vehicles,
		initializeVehiclePositions
	} = useDeliveryStore();
	const { updateCenter, updateZoom } = useMapSettings();
	const {
		startSimulation,
		pauseSimulation,
		resetSimulation,
		simulationStatus,
	} = useSimulation();
	const mapRef = useRef(null);
	const store = useDeliveryStore();

	const handleError = useCallback((errorMessage) => {
		console.error('DeliveryTracker Error:', errorMessage);
		setError(errorMessage);
	}, []);

	useVehicleData();

	useEffect(() => {
		console.log('DeliveryTracker - Initial Store State:', store);
	}, [store]);

	useEffect(() => {
		if (vehicles) {
			console.log('Vehicle state updated:', {
				count: vehicles.length || 0,
				vehicles: vehicles.map(v => ({
					id: v.id,
					status: v.status,
					location: v.location
				}))
			});
		}
	}, [vehicles]);

	useEffect(() => {
		const initialize = async () => {
			try {
				setIsLoading(true);
				if (config?.mapOptions) {
					if (config.mapOptions.center) {
						updateCenter(config.mapOptions.center);
					}
					if (typeof config.mapOptions.zoom === 'number') {
						updateZoom(config.mapOptions.zoom);
					}
				}
				setIsLoading(false);
			} catch (err) {
				setError("Failed to initialize delivery tracker");
				console.error("Initialization error:", err);
				setIsLoading(false);
			}
		};

		initialize();
	}, [config, updateCenter, updateZoom]);

	useEffect(() => {
		initializeVehiclePositions();
	}, [initializeVehiclePositions]);

	const handleStartSimulation = useCallback(async () => {
		try {
			console.log('DeliveryTracker: Starting simulation');
			const store = useDeliveryStore.getState();
			console.log('DeliveryTracker: Current vehicles:', store.vehicles.map(v => ({
				id: v.id,
				status: v.status,
				destinationId: v.destinationId,
				location: v.location
			})));

			await startSimulation();
			console.log('DeliveryTracker: Simulation started successfully');
		} catch (error) {
			console.error('DeliveryTracker: Error starting simulation:', error);
			handleError(`Failed to start simulation: ${error.message}`);
		}
	}, [startSimulation, handleError]);

	const handlePauseSimulation = useCallback(() => {
		try {
			console.log('DeliveryTracker: Pausing simulation');
			pauseSimulation();
			console.log('DeliveryTracker: Simulation paused');
		} catch (error) {
			console.error('DeliveryTracker: Error pausing simulation:', error);
			handleError(`Failed to pause simulation: ${error.message}`);
		}
	}, [pauseSimulation, handleError]);

	const handleResetSimulation = useCallback(() => {
		try {
			console.log('DeliveryTracker: Resetting simulation');
			resetSimulation();
			console.log('DeliveryTracker: Simulation reset');
		} catch (error) {
			console.error('DeliveryTracker: Error resetting simulation:', error);
			handleError(`Failed to reset simulation: ${error.message}`);
		}
	}, [resetSimulation, handleError]);

	const handleVehicleSelect = (vehicle) => {
		if (onVehicleSelect) {
			onVehicleSelect(vehicle);
		}
	};

	if (isLoading) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<ErrorBoundary>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					width: "100%",
					position: "relative",
				}}
			>
				<Navigation
					onError={handleError}
					simulationStatus={simulationStatus}
					mapRef={mapRef}
					onReset={handleResetSimulation}
					vehicles={vehicles}
					onVehicleSelect={handleVehicleSelect}
				/>
				<Box
					sx={{
						flex: 1,
						position: "relative",
					}}
				>
					<DeliveryMap
						ref={mapRef}
						apiKey={apiKey}
						onError={handleError}
						isSimulationRunning={isSimulationRunning}
						onStartSimulation={handleStartSimulation}
						onPauseSimulation={handlePauseSimulation}
						onResetSimulation={handleResetSimulation}
						onVehicleSelect={handleVehicleSelect}
						vehicles={vehicles}
						destinations={setDestinations}
					/>
				</Box>

				{error && (
					<Alert
						severity="error"
						sx={{
							position: "absolute",
							top: 20,
							left: "50%",
							transform: "translateX(-50%)",
							zIndex: 1000,
							minWidth: 300,
						}}
						onClose={() => setError(null)}
					>
						{error}
					</Alert>
				)}
			</Box>
		</ErrorBoundary>
	);
};

DeliveryTracker.propTypes = {
	apiKey: PropTypes.string.isRequired,
	config: PropTypes.shape({
		mapOptions: PropTypes.shape({
			center: PropTypes.shape({
				lat: PropTypes.number.isRequired,
				lng: PropTypes.number.isRequired,
			}),
			zoom: PropTypes.number,
		}),
		updateInterval: PropTypes.number,
	}),
	onVehicleSelect: PropTypes.func,
};

DeliveryTracker.defaultProps = {
	config: {
		mapOptions: {},
	},
	onVehicleSelect: () => {},
};

export default DeliveryTracker; 