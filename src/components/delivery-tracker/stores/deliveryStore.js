/* eslint-disable */
import { create } from "zustand";
import { devtools } from "zustand/middleware"; // Remove persist temporarily
import { DEFAULT_DIALOG_SETTINGS } from "../constants/dialogIds";
import { calculateDistance } from "../utils/mapUtils";
import useSimulationStateStore from './simulationStateStore';
import { persist } from "zustand/middleware";

// const DEFAULT_SPEED = 50; // Comment out if not used

/**
 * @typedef {Object} DeliveryVehicle
 * @property {string} id - Unique identifier
 * @property {string} name - Vehicle name/identifier
 * @property {Object} location - Current location
 * @property {number} location.lat - Latitude
 * @property {number} location.lng - Longitude
 * @property {string} status - Current delivery status ('idle'|'delivering'|'returning'|'completed')
 * @property {string} destinationId - ID of assigned destination
 * @property {string} lastUpdate - ISO timestamp of last update
 */

/**
 * @typedef {Object} DeliveryLocation
 * @property {string} id - Unique identifier
 * @property {string} name - Location name
 * @property {Object} coordinates - Location coordinates
 * @property {number} coordinates.lat - Latitude
 * @property {number} coordinates.lng - Longitude
 */

const loadSavedDestinations = () => {
	try {
		const saved = localStorage.getItem("delivery-destinations");
		if (!saved) return [];
		const destinations = JSON.parse(saved);
		return Array.isArray(destinations) ? destinations : [];
	} catch (e) {
		console.error("Failed to load destinations:", e);
		return [];
	}
};

const saveDestinations = (destinations) => {
	// Don't save if destinations is empty or null
	if (!destinations || destinations.length === 0) {
		console.log("Preventing save of empty destinations");
		return;
	}
	localStorage.setItem("delivery-destinations", JSON.stringify(destinations));
};

const loadSavedDistributionCenters = () => {
	try {
		const saved = localStorage.getItem("distribution-centers");
		if (!saved) return [];
		const centers = JSON.parse(saved);
		return Array.isArray(centers) ? centers : [];
	} catch (e) {
		console.error("Failed to load distribution centers:", e);
		return [];
	}
};

const loadSavedVehicles = () => {
	try {
		const saved = localStorage.getItem("delivery-vehicles");
		console.log('Loading saved vehicles from storage:', saved);
		
		if (!saved) {
			console.log('No saved vehicles found');
			return [];
		}

		const vehicles = JSON.parse(saved);
		if (!Array.isArray(vehicles)) {
			console.log('Saved vehicles is not an array');
			return [];
		}

		// Ensure each vehicle has all required properties
		const processedVehicles = vehicles.map(vehicle => {
			const processed = {
				...vehicle,
				id: vehicle.id,
				name: vehicle.name,
				distributionCenterId: vehicle.distributionCenterId || null,
				distributionCenterName: vehicle.distributionCenterName || null,
				status: vehicle.status || 'idle',
				location: vehicle.location || null,
				metrics: vehicle.metrics || { progress: 0, currentSpeed: 0 }
			};
			console.log('Processed vehicle:', processed);
			return processed;
		});

		console.log('Final processed vehicles:', processedVehicles);
		return processedVehicles;
	} catch (e) {
		console.error("Failed to load vehicles:", e);
		return [];
	}
};

const initialState = {
	vehicles: loadSavedVehicles(),
	destinations: loadSavedDestinations(),
	isSimulationRunning: false,
	simulationSpeed: 1,
	animationSettings: {
		speed: 1,
		isAnimating: false,
		smoothTransition: true,
	},
	dialogSettings: DEFAULT_DIALOG_SETTINGS,
	deliveryProgress: new Map(),
	activeAnimations: {},
	animationState: {
		isAnimating: false,
		activeVehicles: [],
		animationSpeed: 1,
	},
	distributionCenters: loadSavedDistributionCenters(),
};

// Remove useSimulationStateStore if not used
// Remove ensureStateStructure if not used
// Remove totalVehicles if not used
// Remove state if not used

const useDeliveryStore = create(persist(
	devtools((set, get) => ({
		...initialState,

		setVehicles: (vehiclesOrUpdater) => {
			if (typeof vehiclesOrUpdater === "function") {
				set((state) => {
					const currentVehicles = state.vehicles;
					const updatedVehicles = vehiclesOrUpdater(currentVehicles).map((v) => {
						const existing = currentVehicles.find((cv) => cv.id === v.id);
						return {
							...v,
							distributionCenterId: existing?.distributionCenterId || null,
							distributionCenterName: existing?.distributionCenterName || null,
							location: existing?.distributionCenterId ? existing.location : v.location,
							status: existing?.distributionCenterId ? 'idle' : v.status,
							metrics: v.metrics || { progress: 0, currentSpeed: 0 }
						};
					});

					// Save to localStorage with all necessary information
					const vehiclesForStorage = updatedVehicles.map(v => ({
						id: v.id,
						name: v.name,
						location: v.location,
						status: v.status,
						metrics: v.metrics,
						distributionCenterId: v.distributionCenterId,
						distributionCenterName: v.distributionCenterName
					}));
					
					localStorage.setItem('delivery-vehicles', JSON.stringify(vehiclesForStorage));
					console.log('Saved updated vehicles to localStorage:', vehiclesForStorage);
					
					return { vehicles: updatedVehicles };
				});
			} else if (Array.isArray(vehiclesOrUpdater)) {
				const currentVehicles = get().vehicles;
				const vehicles = vehiclesOrUpdater.map(v => {
					// Find existing vehicle to preserve DC info
					const existing = currentVehicles.find(cv => cv.id === v.id);
					return {
						...v,
						distributionCenterId: existing?.distributionCenterId || v.distributionCenterId || null,
						distributionCenterName: existing?.distributionCenterName || v.distributionCenterName || null,
						location: existing?.distributionCenterId ? existing.location : v.location,
						status: existing?.distributionCenterId ? 'idle' : v.status,
						metrics: v.metrics || { progress: 0, currentSpeed: 0 }
					};
				});

				localStorage.setItem('delivery-vehicles', JSON.stringify(vehicles));
				set({ vehicles });
			} else {
				console.warn("setVehicles received invalid input:", vehiclesOrUpdater);
			}
		},

		addVehicle: (vehicle) => set((state) => ({
			vehicles: [...state.vehicles, vehicle],
		})),

		updateVehicle: (vehicleId, updates) => set((state) => ({
			vehicles: state.vehicles.map((vehicle) => 
				vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle,
			),
		})),

		setDestinations: (destinations) => {
			saveDestinations(destinations);
			set({ destinations });
		},

		addDestination: (destination) => set((state) => {
			const newDestinations = [...state.destinations, destination];
			saveDestinations(newDestinations);
			return { destinations: newDestinations };
		}),

		removeDestination: (destinationId) => set((state) => {
			const newDestinations = state.destinations.filter((d) => d.id !== destinationId);
			saveDestinations(newDestinations);
			return { destinations: newDestinations };
		}),

		resetDestinations: () => {
			const confirmed = window.confirm(
				"Are you sure you want to reset all destinations? This cannot be undone.",
			);
			if (!confirmed) return;

			set({ destinations: [] });
			localStorage.removeItem("delivery-destinations");
		},

		toggleSimulation: () =>
			set((state) => ({ isSimulationRunning: !state.isSimulationRunning })),

		setAnimationSettings: (settings) =>
			set((state) => ({
				animationSettings: {
					...state.animationSettings,
					...settings,
				},
			})),

		updateDialogSettings: (dialogId, settings) =>
			set((state) => ({
				dialogSettings: {
					...DEFAULT_DIALOG_SETTINGS,
					...state.dialogSettings,
					[dialogId]: {
						...DEFAULT_DIALOG_SETTINGS[dialogId],
						...state.dialogSettings?.[dialogId],
						...settings,
					},
				},
			})),

		resetDialogSettings: () => set({ dialogSettings: DEFAULT_DIALOG_SETTINGS }),

		assignDestinations: () => {
			const { vehicles, destinations } = get();

			console.log("\n=== Destination Assignment Debug ===");
			console.log("Distribution Center:", get().originLocation);

			for (const dest of destinations) {
				console.log(`Destination ${dest.name}:`, {
					id: dest.id,
					coordinates: dest.coordinates,
					distanceFromDC: `${calculateDistance(get().originLocation, dest.coordinates).toFixed(2)} miles`,
					bearing:
						Math.atan2(
							dest.coordinates.lng - get().originLocation.lng,
							dest.coordinates.lat - get().originLocation.lat,
						) *
						(180 / Math.PI),
				});
			}

			const updatedVehicles = vehicles.map((vehicle, index) => {
				const destination = destinations[index % destinations.length];
				if (destination) {
					console.log(`\nAssigning ${vehicle.id} to ${destination.name}:`, {
						vehicleStart: vehicle.location,
						vehicleDest: destination.coordinates,
						bearing:
							Math.atan2(
								destination.coordinates.lng - vehicle.location.lng,
								destination.coordinates.lat - vehicle.location.lat,
							) *
							(180 / Math.PI),
					});
				}

				return {
					...vehicle,
					destinationId: destination?.id,
					status: "loading",
					metrics: {
						...vehicle.metrics,
						progress: 0,
						currentSpeed: 0,
						distanceToDestination: destination
							? calculateDistance(vehicle.location, destination.coordinates)
							: 0,
					},
				};
			});

			set({ vehicles: updatedVehicles });
		},

		updateDeliveryProgress: (vehicleId, progress) => set((state) => {
			const newProgress = new Map(state.deliveryProgress);
			newProgress.set(vehicleId, progress);
			return { deliveryProgress: newProgress };
		}),

		getDeliveryProgress: (vehicleId) => {
			return get().deliveryProgress.get(vehicleId) || 0;
		},

		setSimulationRunning: (isRunning) => {
			console.log('Store: Setting simulation running:', isRunning);
			set((state) => {
				// Only update if the state is actually changing
				if (state.isSimulationRunning !== isRunning) {
					console.log('Store: Updating simulation state from', state.isSimulationRunning, 'to', isRunning);
					
					// If stopping simulation, clear all animation states
					if (!isRunning) {
						return {
							isSimulationRunning: false,
							animationState: {
								isAnimating: false,
								activeVehicles: []
							},
							activeAnimations: {},
							deliveryProgress: new Map()
						};
					}
					
					return { isSimulationRunning: isRunning };
				}
				return state;
			});
		},

		setSimulationSpeed: (speed) => {
			set((state) => ({
				simulationSpeed: speed,
				animationState: {
					...state.animationState,
					animationSpeed: speed,
				},
			}));
		},

		startVehicleAnimation: (vehicleId, animationData) => {
			const state = get();
			
			// Add vehicle to active vehicles if not already there
			if (!state.animationState.activeVehicles.includes(vehicleId)) {
				state.animationState.activeVehicles.push(vehicleId);
			}
			
			state.activeAnimations[vehicleId] = {
				...animationData,
				isActive: true,
				startTime: Date.now()
			};
			
			set({
				animationState: {
					...state.animationState,
					isAnimating: true
				},
				activeAnimations: state.activeAnimations
			});
			
			console.log('Store: Vehicle animation activated:', {
				vehicleId,
				activeVehicles: state.animationState.activeVehicles,
				animationData: state.activeAnimations[vehicleId]
			});
		},

		updateVehicleAnimation: (vehicleId, newPosition, progress) => {
			set((state) => {
				const vehicle = state.vehicles.find(v => v.id === vehicleId);
				if (!vehicle) {
					console.warn('Vehicle not found:', vehicleId);
					return state;
				}

				console.log('Store: Updating vehicle position:', {
					vehicleId,
					oldPos: vehicle.location,
					newPos: newPosition,
					progress
				});

				return {
					...state,
					vehicles: state.vehicles.map(v => 
						v.id === vehicleId 
							? { 
								...v, 
								location: newPosition,
								previousLocation: v.location,
								metrics: {
									...v.metrics,
									progress: Math.round(progress * 100)
								}
							}
							: v
					)
				};
			});
		},

		stopVehicleAnimation: (vehicleId) => {
			set((state) => {
				console.log('Stopping animation for vehicle:', vehicleId);

				const newActiveVehicles = state.animationState.activeVehicles.filter(
					id => id !== vehicleId
				);

				const { [vehicleId]: _, ...remainingAnimations } = state.activeAnimations;

				const newState = {
					...state,
					animationState: {
						...state.animationState,
						isAnimating: newActiveVehicles.length > 0,
						activeVehicles: newActiveVehicles,
					},
					activeAnimations: remainingAnimations,
				};

				console.log('Animation state after stop:', {
					isAnimating: newState.animationState.isAnimating,
					activeVehicles: newState.animationState.activeVehicles,
					activeAnimations: Object.keys(newState.activeAnimations)
				});

				return newState;
			});
		},

		startSimulation: () => set((state) => ({
			isSimulationRunning: true,
			vehicles: state.vehicles.map((vehicle) => ({
				...vehicle,
				status: 'active',
			})),
		})),

		stopSimulation: () => set((state) => ({
			isSimulationRunning: false,
			vehicles: state.vehicles.map((vehicle) => ({
				...vehicle,
				status: 'idle',
				location: getVehicleDCLocation(state, vehicle.id) || vehicle.location,
			})),
			deliveryProgress: new Map(),
		})),

		updateVehiclePosition: (vehicleId, newPosition) => {
			set((state) => ({
				vehicles: state.vehicles.map((vehicle) =>
					vehicle.id === vehicleId
						? {
							  ...vehicle,
							  location: {
								  lat: Number(newPosition.lat),
								  lng: Number(newPosition.lng)
							  },
							  // Only update status if it's not already active
							  status: vehicle.status === 'idle' ? 'active' : vehicle.status
						  }
						: vehicle
				)
			}));
		},

		resetSimulation: () => {
			set((state) => {
				console.log('Store: Resetting simulation');
				
				// Reset all vehicles to their assigned DC positions
				const resetVehicles = state.vehicles.map(vehicle => {
					const dcLocation = getVehicleDCLocation(state, vehicle.id);
					if (!dcLocation) {
						console.warn(`No DC location found for vehicle ${vehicle.id}`);
						return vehicle;
					}
					
					return {
						...vehicle,
						status: 'idle',
						location: dcLocation,
						destinationId: null,
						metrics: null,
						previousLocation: null
					};
				});

				return {
					...state,
					vehicles: resetVehicles,
					isSimulationRunning: false,
					animationState: {
						isAnimating: false,
						activeVehicles: []
					},
					activeAnimations: {},
					deliveryProgress: new Map()
				};
			});
		},

		updateVehicleStatus: (vehicleId, status) => {
			set((state) => ({
				vehicles: state.vehicles.map(v => 
					v.id === vehicleId ? { ...v, status } : v
				)
			}));
		},

		addDistributionCenter: (center) => set((state) => ({
			distributionCenters: [...state.distributionCenters, center],
		})),

		removeDistributionCenter: (centerId) => set((state) => ({
			distributionCenters: state.distributionCenters.filter(c => c.id !== centerId)
		})),

		updateDistributionCenter: (updatedCenter) => set((state) => ({
			distributionCenters: state.distributionCenters.map(c => 
				c.id === updatedCenter.id ? updatedCenter : c
			)
		})),

		assignVehicleToCenter: (vehicleId, centerId) => {
			set((state) => {
				// Find the distribution center
				const dc = state.distributionCenters.find((center) => center.id === centerId);
				if (!dc) return state;

				// Update vehicles with new assignments
				const updatedVehicles = state.vehicles.map((v) => 
					v.id === vehicleId 
						? {
							...v,
							distributionCenterId: centerId,
							distributionCenterName: dc.name,
							location: {
								lat: dc.coordinates.lat + (Math.random() - 0.5) * 0.0002,
								lng: dc.coordinates.lng + (Math.random() - 0.5) * 0.0002,
							},
							status: 'idle',
						}
						: v,
				);

				return { vehicles: updatedVehicles };
			});
		},

		initializeVehiclePositions: () => set((state) => {
			const dcVehicleMap = state.vehicles.reduce((acc, vehicle) => {
				if (vehicle.distributionCenterId) {
					if (!acc[vehicle.distributionCenterId]) {
						acc[vehicle.distributionCenterId] = [];
					}
					acc[vehicle.distributionCenterId].push(vehicle);
				}
				return acc;
			}, {});

			const updatedVehicles = state.vehicles.map(vehicle => {
				if (!vehicle.distributionCenterId) return vehicle;

				const dc = state.distributionCenters.find(
					dc => dc.id === vehicle.distributionCenterId
				);
				if (!dc) return vehicle;

				const vehiclesAtDC = dcVehicleMap[dc.id];
				const vehicleIndex = vehiclesAtDC.indexOf(vehicle);
				const totalVehicles = vehiclesAtDC.length;

				// Calculate position in a tighter circle around the DC
				const baseRadius = 0.0001; // About 10 meters
				const radius = baseRadius * (1 + Math.floor(vehicleIndex / 8)); // Create concentric circles if more than 8 vehicles
				const angleOffset = (vehicleIndex % 8) * ((2 * Math.PI) / 8); // 8 vehicles per circle
				
				return {
					...vehicle,
					location: {
						lat: dc.coordinates.lat + (radius * Math.cos(angleOffset)),
						lng: dc.coordinates.lng + (radius * Math.sin(angleOffset))
					},
					status: 'idle'
				};
			});

			localStorage.setItem('delivery-vehicles', JSON.stringify(updatedVehicles));
			return { vehicles: updatedVehicles };
		}),

		verifyVehicleStorage: () => {
			const savedData = localStorage.getItem('delivery-vehicles');
			console.log('Current localStorage data:', savedData);
			if (savedData) {
				try {
					const parsed = JSON.parse(savedData);
					console.log('Parsed vehicle data:', parsed);
					return parsed;
				} catch (e) {
					console.error('Failed to parse saved vehicles:', e);
					return null;
				}
			}
			return null;
		},

		removeVehicle: (vehicleId) => set((state) => ({
			vehicles: state.vehicles.filter((v) => v.id !== vehicleId),
		})),

		setAnimationState: (updates) => set((state) => ({
			animationState: {
				...state.animationState,
				...updates,
			},
		})),

		updateActiveAnimations: (vehicleId, isActive) => set((state) => ({
			activeAnimations: {
				...state.activeAnimations,
				[vehicleId]: isActive,
			},
		})),

		setDialogSettings: (dialogId, settings) => set((state) => ({
			dialogSettings: {
				...state.dialogSettings,
				[dialogId]: {
					...state.dialogSettings[dialogId],
					...settings,
				},
			},
		})),

		toggleDialog: (dialogId) => set((state) => ({
			dialogSettings: {
				...state.dialogSettings,
				[dialogId]: {
					...state.dialogSettings[dialogId],
					open: !state.dialogSettings[dialogId].open,
				},
			},
		})),

		updateDialogPosition: (dialogId, position) => set((state) => ({
			dialogSettings: {
				...state.dialogSettings,
				[dialogId]: {
					...state.dialogSettings[dialogId],
					position,
				},
			},
		})),

		getVehicleDestination: (vehicleId) => {
			const state = get();
			const vehicle = state.vehicles.find((v) => v.id === vehicleId);
			if (!vehicle?.destinationId) return null;
			return state.destinations.find((d) => d.id === vehicle.destinationId);
		},
	})),
	{
		name: 'delivery-store',
		getStorage: () => ({
			getItem: (name) => {
				try {
					return localStorage.getItem(name);
				} catch (err) {
					console.warn('Failed to read from localStorage:', err);
					return null;
				}
			},
			setItem: (name, value) => {
				try {
					localStorage.setItem(name, value);
				} catch (err) {
					console.warn('Failed to write to localStorage:', err);
				}
			},
			removeItem: (name) => {
				try {
					localStorage.removeItem(name);
				} catch (err) {
					console.warn('Failed to remove from localStorage:', err);
				}
			},
		}),
	}
));

export default useDeliveryStore;

export const useDestinations = () =>
	useDeliveryStore((state) => ({
		destinations: state.destinations || [],
		addDestination: state.addDestination,
		removeDestination: state.removeDestination,
		setDestinations: state.setDestinations,
		vehicles: state.vehicles || [],
		setVehicles: state.setVehicles,
	}));

// Add helper function to get a vehicle's DC location
const getVehicleDCLocation = (state, vehicleId) => {
	const vehicle = state.vehicles.find(v => v.id === vehicleId);
	if (!vehicle?.distributionCenterId) return null;
	
	const dc = state.distributionCenters.find(dc => dc.id === vehicle.distributionCenterId);
	return dc ? dc.coordinates : null;
}; 