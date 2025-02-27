/* eslint-disable */
export const DIALOG_IDS = {
	VEHICLE_STATUS: "vehicleStatus",
	ROUTE_STATISTICS: "routeStatistics",
	DELIVERY_PROGRESS: "deliveryProgress",
	DELIVERY_ESTIMATES: "deliveryEstimates",
	ANALYTICS: "analytics",
	ROUTE_VISUALIZATION: "routeVisualization",
	ALERTS: "alerts",
	SIMULATION_SETUP: "simulation-setup",
	DESTINATION_MANAGER: "destination-manager",
	VEHICLE_MANAGER: "vehicle-manager",
	SETTINGS: "settings",
	HELP: "help",
};

export const DEFAULT_DIALOG_SETTINGS = {
  vehicleStatus: {
    open: false,
    position: { x: 20, y: 20 },
  },
  routeStatistics: {
    open: false,
    position: { x: 20, y: 20 },
  },
  deliveryProgress: {
    open: false,
    position: { x: 20, y: 20 },
  },
  deliveryEstimates: { open: true, position: { x: 330, y: 490 }, size: { width: 300, height: 300 } },
  analytics: { open: false, position: { x: 640, y: 80 }, size: { width: 400, height: 600 } },
  routeVisualization: {
    open: false,
    position: { x: 20, y: 20 },
  },
  alerts: { open: true, position: { x: 20, y: 200 }, size: { width: 300, height: 400 } }
};

export const DIALOG_TITLES = {
  [DIALOG_IDS.SIMULATION_SETUP]: "Simulation Setup",
  [DIALOG_IDS.DESTINATION_MANAGER]: "Manage Destinations",
  [DIALOG_IDS.VEHICLE_MANAGER]: "Manage Vehicles",
  [DIALOG_IDS.SETTINGS]: "Settings",
  [DIALOG_IDS.HELP]: "Help",
};

export const DIALOG_DESCRIPTIONS = {
  [DIALOG_IDS.SIMULATION_SETUP]: "Configure simulation parameters",
  [DIALOG_IDS.DESTINATION_MANAGER]: "Add, edit, or remove destinations",
  [DIALOG_IDS.VEHICLE_MANAGER]: "Add, edit, or remove vehicles",
  [DIALOG_IDS.SETTINGS]: "Configure application settings",
  [DIALOG_IDS.HELP]: "View help documentation and tutorials",
};

export const DIALOG_POSITIONS = {
  [DIALOG_IDS.SIMULATION_SETUP]: { x: 100, y: 100 },
  [DIALOG_IDS.DESTINATION_MANAGER]: { x: 150, y: 150 },
  [DIALOG_IDS.VEHICLE_MANAGER]: { x: 200, y: 200 },
  [DIALOG_IDS.SETTINGS]: { x: 250, y: 250 },
  [DIALOG_IDS.HELP]: { x: 300, y: 300 },
};

export const getDialogPosition = (dialogId) => DIALOG_POSITIONS[dialogId] || { x: 0, y: 0 };
