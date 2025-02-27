import { useRef, useCallback, useEffect } from "react";
import useDeliveryStore from "../stores/deliveryStore";

const ANIMATION_FRAME_RATE = 60; // frames per second
const INTERPOLATION_POINTS = 60; // points between start and end for smooth movement

export const useMapAnimation = ({ onUpdateLocation, onError }) => {
	const animationFramesRef = useRef({});
	const { simulationSpeed, vehicles } = useDeliveryStore();

	const cancelAnimations = useCallback(() => {
		Object.values(animationFramesRef.current).forEach((frame) => {
			if (frame) cancelAnimationFrame(frame);
		});
		animationFramesRef.current = {};
	}, []);

	useEffect(() => {
		return () => cancelAnimations();
	}, [cancelAnimations]);

	const interpolatePosition = useCallback((start, end, progress) => {
		return {
			lat: start.lat + (end.lat - start.lat) * progress,
			lng: start.lng + (end.lng - start.lng) * progress,
		};
	}, []);

	const calculateBearing = useCallback((start, end) => {
		const toRad = (deg) => (deg * Math.PI) / 180;
		const toDeg = (rad) => (rad * 180) / Math.PI;

		const startLat = toRad(start.lat);
		const startLng = toRad(start.lng);
		const endLat = toRad(end.lat);
		const endLng = toRad(end.lng);

		const dLng = endLng - startLng;

		const y = Math.sin(dLng) * Math.cos(endLat);
		const x =
			Math.cos(startLat) * Math.sin(endLat) -
			Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

		const bearing = toDeg(Math.atan2(y, x));
		return (bearing + 360) % 360;
	}, []);

	const animateVehicleMovement = useCallback(
		(vehicleId, startPosition, endPosition, duration) => {
			if (animationFramesRef.current[vehicleId]) {
				cancelAnimationFrame(animationFramesRef.current[vehicleId]);
			}

			const startTime = performance.now();
			const adjustedDuration = duration / simulationSpeed;
			const bearing = calculateBearing(startPosition, endPosition);

			const animate = (currentTime) => {
				try {
					const elapsed = currentTime - startTime;
					const progress = Math.min(elapsed / adjustedDuration, 1);

					// Smooth easing function
					const easedProgress = 1 - Math.pow(1 - progress, 3);
					const currentPosition = interpolatePosition(
						startPosition,
						endPosition,
						easedProgress,
					);

					onUpdateLocation(vehicleId, {
						...currentPosition,
						bearing,
						progress: progress * 100,
					});

					if (progress < 1) {
						animationFramesRef.current[vehicleId] =
							requestAnimationFrame(animate);
					} else {
						delete animationFramesRef.current[vehicleId];
					}
				} catch (err) {
					onError?.("Animation failed");
					cancelAnimationFrame(animationFramesRef.current[vehicleId]);
					delete animationFramesRef.current[vehicleId];
				}
			};

			animationFramesRef.current[vehicleId] = requestAnimationFrame(animate);
		},
		[
			simulationSpeed,
			calculateBearing,
			interpolatePosition,
			onUpdateLocation,
			onError,
		],
	);

	const isAnimating = useCallback((vehicleId) => {
		return !!animationFramesRef.current[vehicleId];
	}, []);

	const getAnimationProgress = useCallback(
		(vehicleId) => {
			const vehicle = vehicles.find((v) => v.id === vehicleId);
			return vehicle?.metrics?.progress || 0;
		},
		[vehicles],
	);

	return {
		animateVehicleMovement,
		cancelAnimations,
		isAnimating,
		getAnimationProgress,
		animationFramesRef,
	};
}; 