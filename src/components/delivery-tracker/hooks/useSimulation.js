/* eslint-disable */
import { useState, useCallback, useRef, useEffect } from "react";
import useDeliveryStore from "../stores/deliveryStore";
// eslint-disable-next-line no-unused-vars
import { calculateDistance, interpolatePosition } from "../utils/mapUtils";
import { useMapAnimations } from './useMapAnimations';

// eslint-disable-next-line no-unused-vars
const DEFAULT_SPEED = 50; // miles per hour
// eslint-disable-next-line no-unused-vars
const DEFAULT_UPDATE_INTERVAL = 5000; // 5 seconds

function useSimulation() {
	const [isSimulationRunning, setIsSimulationRunning] = useState(false);
	const [simulationStatus, setSimulationStatus] = useState("idle");
	const animationFrameRef = useRef();
	const lastUpdateRef = useRef(Date.now());

	const {
		vehicles,
		// eslint-disable-next-line no-unused-vars
		destinations,
		updateVehicleLocation,
		startVehicleAnimation,
		updateVehicleAnimation,
		stopVehicleAnimation,
		setSimulationRunning,
		// eslint-disable-next-line no-unused-vars
		simulationSpeed,
		// eslint-disable-next-line no-unused-vars
		activeAnimations,
		animationState
	} = useDeliveryStore();

	const { startAnimation, stopAnimation } = useMapAnimations();

	const animate = useCallback(() => {
		try {
			const currentTime = Date.now();
			const deltaTime = (currentTime - lastUpdateRef.current) / 1000;
			lastUpdateRef.current = currentTime;

			const store = useDeliveryStore.getState();
			
			if (!store.animationState.isAnimating) {
				console.log('No active animations, stopping animation loop');
				return;
			}

			for (const vehicleId of store.animationState.activeVehicles) {
				const vehicle = vehicles.find(v => v.id === vehicleId);
				const animation = store.activeAnimations[vehicleId];

				if (!vehicle || !animation) {
					console.log('Missing vehicle or animation:', { 
						vehicleId, 
						hasVehicle: !!vehicle, 
						hasAnimation: !!animation 
					});
					continue;
				}

				const elapsedTime = (currentTime - animation.startTime) / 1000;
				const progress = Math.min(elapsedTime / (animation.duration / 1000), 1);

				const newPosition = interpolatePosition(
					animation.startPosition,
					animation.endPosition,
					progress
				);

				updateVehicleAnimation(vehicleId, newPosition, progress);

				if (progress >= 1) {
					console.log('Vehicle reached destination:', vehicleId);
					stopVehicleAnimation(vehicleId);
					updateVehicleLocation(vehicleId, animation.endPosition);
				}
			}

			if (store.animationState.isAnimating) {
				animationFrameRef.current = requestAnimationFrame(animate);
			}
		} catch (error) {
			console.error('Animation error:', error);
			setSimulationStatus("error");
		}
	}, [vehicles, updateVehicleAnimation, stopVehicleAnimation, updateVehicleLocation]);

	const startSimulation = useCallback(async () => {
		try {
			console.log('useSimulation: Starting simulation');
			const store = useDeliveryStore.getState();
			
			// Start the simulation in the store
			const numVehicles = await store.startSimulation();
			console.log(`useSimulation: Started simulation with ${numVehicles} vehicles`);

			setSimulationStatus("running");
			setIsSimulationRunning(true);
			setSimulationRunning(true);

			// Get active vehicles and their destinations
			const activeVehicles = store.animationState.activeVehicles;
			console.log('useSimulation: Active vehicles:', activeVehicles);
			console.log('useSimulation: Active animations:', store.activeAnimations);

			// Start animation for each vehicle
			for (const vehicleId of activeVehicles) {
				const animation = store.activeAnimations[vehicleId];
				if (animation) {
					console.log(`useSimulation: Starting animation for vehicle ${vehicleId}:`, animation);
					startVehicleAnimation(vehicleId, animation);
				}
			}

		} catch (err) {
			console.error('useSimulation: Start simulation error:', err);
			setSimulationStatus("error");
			setIsSimulationRunning(false);
			setSimulationRunning(false);
			throw err;
		}
	}, [startVehicleAnimation, setSimulationRunning]);

	const pauseSimulation = useCallback(() => {
		console.log('useSimulation: Pausing simulation');
		setIsSimulationRunning(false);
		setSimulationStatus("paused");
		setSimulationRunning(false);
		stopAnimation();
	}, [stopAnimation, setSimulationRunning]);

	const resetSimulation = useCallback(() => {
		setIsSimulationRunning(false);
		setSimulationStatus("idle");
		setSimulationRunning(false);
		if (animationFrameRef.current) {
			cancelAnimationFrame(animationFrameRef.current);
		}
	}, [setSimulationRunning]);

	// Cleanup
	useEffect(() => {
		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, []);

	return {
		startSimulation,
		pauseSimulation,
		resetSimulation,
		isSimulationRunning,
		simulationStatus,
	};
}

export default useSimulation;

