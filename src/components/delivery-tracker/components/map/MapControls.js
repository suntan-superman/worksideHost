import React, { useState, useEffect, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import {
	Box,
	Paper,
	ToggleButton,
	ToggleButtonGroup,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	IconButton,
	Tooltip,
	Menu,
	ListItemIcon,
	ListItemText,
	Switch,
	FormControlLabel,
} from "@mui/material";
import {
	TrafficRounded,
	MyLocation,
	CenterFocusStrong,
	RestartAlt,
	Menu as MenuIcon,
	Timeline,
	Assessment,
	LinearScale,
	Schedule,
	Notifications as NotificationsIcon,
	Route as RouteIcon,
	DirectionsCar,
	TrafficOutlined,
	Settings,
	Refresh,
	DragIndicator,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";
import { DEFAULT_DIALOG_SETTINGS } from "../../constants/dialogIds";
import { useMapSettings } from "../../hooks/useMapSettings";

// Define position types and their corresponding styles
const POSITION_STYLES = {
	top: {
		top: 80,
		left: "50%",
		transform: "translateX(-50%)",
		flexDirection: "row",
	},
	bottom: {
		bottom: 20,
		left: "50%",
		transform: "translateX(-50%)",
		flexDirection: "row",
	},
	left: {
		left: 20,
		top: "50%",
		transform: "translateY(-50%)",
		flexDirection: "column",
	},
	right: {
		right: 20,
		top: "50%",
		transform: "translateY(-50%)",
		flexDirection: "column",
	},
};

const MapControls = ({
	map,
	settings = {},
	onToggleTraffic,
	onFollowVehicle,
	onResetSettings,
	onError,
	onCenterOrigin,
	onOptimizeRoutes,
	isReplaying,
	isOptimizing,
	position = "right",
	sx,
}) => {
	const nodeRef = useRef(null);
	const { vehicles, dialogSettings, updateDialogSettings } = useDeliveryStore();
	const [menuAnchor, setMenuAnchor] = useState(null);
	const [isDragging, setIsDragging] = useState(false);
	const positionStyle = POSITION_STYLES[position] || POSITION_STYLES.right;
	const isVertical = position === "left" || position === "right";

	// Get the updateControlPosition function from useMapSettings
	const { updateControlPosition } = useMapSettings();

	// Local state for position
	const [controlPosition, setControlPosition] = useState(
		settings.controlPosition,
	);

	// Update local position only on initial mount or reset
	useEffect(() => {
		if (!controlPosition) {
			setControlPosition(settings.controlPosition);
		}
	}, [controlPosition, settings.controlPosition]);

	// Add debug log
	useEffect(() => {
		console.log("MapControls vehicles:", vehicles);
	}, [vehicles]);

	// Add debug log to check values
	useEffect(() => {
		console.log("Settings followVehicle:", settings.followVehicle);
		console.log(
			"Available vehicle IDs:",
			vehicles.map((v) => v.vehicleId),
		);
	}, [settings.followVehicle, vehicles]);

	// Reset followVehicle if current value is invalid
	useEffect(() => {
		if (
			settings.followVehicle &&
			!vehicles.some((v) => v.vehicleId === settings.followVehicle)
		) {
			onFollowVehicle("");
		}
	}, [vehicles, settings.followVehicle, onFollowVehicle]);

	const handleToggleDialog = (dialogId) => {
		if (!dialogSettings || !dialogId) return;

		const currentSettings =
			dialogSettings[dialogId] || DEFAULT_DIALOG_SETTINGS[dialogId];
		updateDialogSettings(dialogId, {
			...currentSettings,
			open: !currentSettings?.open,
		});
	};

	const isDialogOpen = (dialogId) => {
		return (
			dialogSettings?.[dialogId]?.open ??
			DEFAULT_DIALOG_SETTINGS[dialogId]?.open ??
			false
		);
	};

	const handleToggleTraffic = useCallback(() => {
		try {
			onToggleTraffic();
		} catch (err) {
			onError?.("Failed to toggle traffic layer");
		}
	}, [onToggleTraffic, onError]);

	const handleDragStop = (e, data) => {
		setIsDragging(false);
		const newPosition = { x: data.x, y: data.y };
		setControlPosition(newPosition);
		// Immediately persist the position when it changes
		updateControlPosition(newPosition);
	};

	return (
		<Box
			sx={{
				position: "absolute",
				right: 20,
				top: "50%",
				transform: "translateY(-50%)",
				zIndex: 1000,
			}}
		>
			<Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
				<Paper
					ref={nodeRef}
					elevation={2}
					sx={{
						p: 1,
						display: "flex",
						flexDirection: "column",
						gap: 1,
						backgroundColor: "white",
						borderRadius: 1,
					}}
				>
					<Box className="drag-handle" sx={{ cursor: "move", mb: 1 }}>
						<DragIndicator />
					</Box>

					<Tooltip title="Toggle Traffic" placement="left">
						<IconButton size="small" onClick={handleToggleTraffic}>
							<TrafficOutlined />
						</IconButton>
					</Tooltip>

					<Tooltip title="Follow Vehicle" placement="left">
						<IconButton
							size="small"
							onClick={() => onFollowVehicle(settings.followVehicle || "")}
						>
							<MyLocation />
						</IconButton>
					</Tooltip>

					<Tooltip title="Reset Settings" placement="left">
						<IconButton size="small" onClick={onResetSettings}>
							<Refresh />
						</IconButton>
					</Tooltip>

					<Tooltip title="Map Settings" placement="left">
						<IconButton
							size="small"
							onClick={(e) => setMenuAnchor(e.currentTarget)}
						>
							<Settings />
						</IconButton>
					</Tooltip>

					<Menu
						anchorEl={menuAnchor}
						open={Boolean(menuAnchor)}
						onClose={() => setMenuAnchor(null)}
					>
						<MenuItem onClick={() => handleToggleDialog("vehicleStatus")}>
							<ListItemIcon>
								<DirectionsCar fontSize="small" />
							</ListItemIcon>
							<ListItemText>Vehicle Status</ListItemText>
							<Switch
								edge="end"
								checked={isDialogOpen("vehicleStatus")}
								size="small"
							/>
						</MenuItem>

						<MenuItem onClick={() => handleToggleDialog("routeStatistics")}>
							<ListItemIcon>
								<Timeline fontSize="small" />
							</ListItemIcon>
							<ListItemText>Route Statistics</ListItemText>
							<Switch
								edge="end"
								checked={isDialogOpen("routeStatistics")}
								size="small"
							/>
						</MenuItem>

						<MenuItem onClick={() => handleToggleDialog("deliveryProgress")}>
							<ListItemIcon>
								<LinearScale fontSize="small" />
							</ListItemIcon>
							<ListItemText>Delivery Progress</ListItemText>
							<Switch
								edge="end"
								checked={isDialogOpen("deliveryProgress")}
								size="small"
							/>
						</MenuItem>

						<MenuItem onClick={() => handleToggleDialog("routeVisualization")}>
							<ListItemIcon>
								<RouteIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Route Analysis</ListItemText>
							<Switch
								edge="end"
								checked={isDialogOpen("routeVisualization")}
								size="small"
							/>
						</MenuItem>
					</Menu>
				</Paper>
			</Draggable>
		</Box>
	);
};

export default MapControls; 