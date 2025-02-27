import { create } from "zustand";

const useMapStore = create((set, get) => ({
	mapInstance: null,
	setMapInstance: (map) => {
		if (!map) {
			// console.error("Attempted to set null map instance");
			return;
		}

		// Verify this is a Google Maps instance
		if (
			typeof map.getCenter !== "function"
			|| typeof map.getZoom !== "function"
		) {
			// console.error("Invalid Google Maps instance provided:", {
			// 	hasGetCenter: typeof map.getCenter === "function",
			// 	hasGetZoom: typeof map.getZoom === "function",
			// 	type: map.constructor.name,
			// });
			return;
		}

		set({ mapInstance: map });
	},
	getMapInstance: () => get().mapInstance,
}));

export default useMapStore;
