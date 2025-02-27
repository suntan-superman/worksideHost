import React from "react";
import { useMapsLibrary, useMap } from "@vis.gl/react-google-maps";
import useDeliveryStore from "../../stores/deliveryStore";

const DeliveryPathHistory = () => {
	const { vehicles } = useDeliveryStore();
	const map = useMap();
	const mapsLibrary = useMapsLibrary("maps");

	React.useEffect(() => {
		if (!map || !mapsLibrary || !vehicles.length) return;

		const paths = vehicles
			.map((vehicle) => {
				if (!vehicle.pathHistory || vehicle.pathHistory.length < 2) return null;

				const path = new mapsLibrary.Polyline({
					path: vehicle.pathHistory,
					geodesic: true,
					strokeColor: vehicle.color || "#2196f3",
					strokeOpacity: 0.8,
					strokeWeight: 2,
					map: map,
				});

				return path;
			})
			.filter(Boolean);

		return () => {
			paths.forEach((path) => path.setMap(null));
		};
	}, [map, mapsLibrary, vehicles]);

	return null;
};

export default React.memo(DeliveryPathHistory); 