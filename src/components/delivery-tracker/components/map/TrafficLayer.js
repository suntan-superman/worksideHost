import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const TrafficLayer = () => {
	const map = useMap();
	const library = useMapsLibrary("maps");

	useEffect(() => {
		if (!map || !library) return;

		const trafficLayer = new library.TrafficLayer();
		trafficLayer.setMap(map);

		return () => {
			trafficLayer.setMap(null);
		};
	}, [map, library]);

	return null;
};

export default TrafficLayer;

