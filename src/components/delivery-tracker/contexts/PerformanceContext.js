import React, {
	createContext,
	useContext,
	useRef,
	useCallback,
	useEffect,
	useState,
} from "react";

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
	const frameRef = useRef(null);
	const metricsRef = useRef({
		fps: 60,
		memoryUsage: 0,
		renderTime: 0,
		warnings: [],
		lastUpdate: Date.now(),
	});

	const [metrics, setMetrics] = useState(metricsRef.current);

	const updateMetrics = useCallback(() => {
		const now = performance.now();
		const timeDiff = now - metricsRef.current.lastUpdate;
		const newMetrics = {
			fps: Math.min(
				60,
				Math.max(0, Math.round(timeDiff > 0 ? 1000 / timeDiff : 60)),
			),
			memoryUsage: window.performance?.memory?.usedJSHeapSize || 0,
			renderTime: timeDiff,
			warnings: [],
			lastUpdate: now,
		};

		if (newMetrics.fps < 30) {
			newMetrics.warnings.push("Low frame rate detected");
		}
		if (newMetrics.memoryUsage > 500 * 1024 * 1024) {
			newMetrics.warnings.push("High memory usage");
		}

		metricsRef.current = newMetrics;
	}, []);

	const throttleMarkerUpdates = useCallback(
		(callback) => {
			if (!callback) return;

			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}

			frameRef.current = requestAnimationFrame(() => {
				try {
					updateMetrics();
					callback();
				} finally {
					frameRef.current = null;
				}
			});
		},
		[updateMetrics],
	);

	useEffect(() => {
		let mounted = true;
		const interval = setInterval(() => {
			if (mounted) {
				updateMetrics();
				setMetrics(metricsRef.current);
			}
		}, 1000);

		return () => {
			mounted = false;
			clearInterval(interval);
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
				frameRef.current = null;
			}
		};
	}, [updateMetrics]);

	const value = {
		...metrics,
		throttleMarkerUpdates,
	};

	return (
		<PerformanceContext.Provider value={value}>
			{children}
		</PerformanceContext.Provider>
	);
};

export const useMapPerformance = () => {
	const context = useContext(PerformanceContext);
	if (!context) {
		throw new Error(
			"useMapPerformance must be used within a PerformanceProvider",
		);
	}
	return context;
}; 