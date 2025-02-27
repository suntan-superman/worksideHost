import { useCallback, useEffect, useRef, useState } from "react";

export const useMapPerformance = () => {
	const frameRef = useRef(null);
	const metricsRef = useRef({
		fps: 60,
		memoryUsage: 0,
		renderTime: 0,
		warnings: [],
		lastUpdate: Date.now(),
	});

	const [metrics, setMetrics] = useState(metricsRef.current);

	// Update metrics without causing re-renders
	const updateMetricsRef = useCallback(() => {
		const now = performance.now();
		const newWarnings = [];
		const timeDiff = now - metricsRef.current.lastUpdate;
		const fps = timeDiff > 0 ? 1000 / timeDiff : 60;

		if (fps < 30) {
			newWarnings.push("Low frame rate detected");
		}

		let memoryUsage = 0;
		if (window.performance?.memory) {
			memoryUsage = window.performance.memory.usedJSHeapSize;
			if (memoryUsage > 500 * 1024 * 1024) {
				newWarnings.push("High memory usage");
			}
		}

		metricsRef.current = {
			fps: Math.min(60, Math.max(0, Math.round(fps))),
			memoryUsage,
			renderTime: timeDiff,
			warnings: newWarnings,
			lastUpdate: now,
		};
	}, []);

	// Periodically update state from ref
	useEffect(() => {
		const updateState = () => {
			updateMetricsRef();
			setMetrics(metricsRef.current);
		};

		const interval = setInterval(updateState, 1000);
		return () => clearInterval(interval);
	}, [updateMetricsRef]);

	const throttleMarkerUpdates = useCallback(
		(callback) => {
			if (!callback) return;

			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}

			frameRef.current = requestAnimationFrame(() => {
				try {
					updateMetricsRef(); // Update metrics on marker updates
					callback();
				} catch (error) {
					console.error("Error in throttled marker update:", error);
				} finally {
					frameRef.current = null;
				}
			});
		},
		[updateMetricsRef],
	);

	// Cleanup
	useEffect(() => {
		return () => {
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
		};
	}, []);

	return {
		...metrics,
		throttleMarkerUpdates,
	};
};

export default useMapPerformance; 