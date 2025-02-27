/* eslint-disable */
import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Tooltip,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Drawer,
	List,
	ListItem,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Settings as SettingsIcon,
	Timeline as TimelineIcon,
	Route as RouteIcon,
	Map as MapIcon,
} from "@mui/icons-material";
import useDeliveryStore from "../../stores/deliveryStore";
import DestinationManager from "../simulation/DestinationManager";
import SimulationSetupDialog from "../simulation/SimulationSetupDialog";
import MapSettingsDialog from "../settings/MapSettingsDialog";
import { useMapSettings } from "../../hooks/useMapSettings";
import useMapStore from "../../stores/mapStore";
import DistributionCenterDialog from '../settings/DistributionCenterDialog';
import { useLocation } from "react-router-dom";

const Navigation = ({ onError, simulationStatus }) => {
	const mapInstance = useMapStore((state) => state.mapInstance);
	const [anchorEl, setAnchorEl] = useState(null);
	const [setupDialogOpen, setSetupDialogOpen] = useState(false);
	const [destinationManagerOpen, setDestinationManagerOpen] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [dcDialogOpen, setDcDialogOpen] = useState(false);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const { setSimulationRunning } = useDeliveryStore();
	const { toggleMapType } = useMapSettings();
	const { isSimulationRunning: useDeliveryStoreIsSimulationRunning } = useDeliveryStore();
	const location = useLocation();

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMapTypeToggle = () => {
		try {
			toggleMapType();
		} catch (err) {
			onError?.("Failed to change map type");
		}
	};

	const handleStartSimulation = () => {
		setSimulationRunning(true);
		setSetupDialogOpen(false);
	};

	const handleMapSettings = () => {
		console.log("Navigation: Opening settings with map instance:", {
			hasInstance: Boolean(mapInstance),
			methods: mapInstance ? Object.keys(mapInstance) : [],
		});
		setSettingsOpen(true);
	};

	const getStatusText = () => {
		if (typeof simulationStatus === "string") {
			return (
				simulationStatus.charAt(0).toUpperCase() + simulationStatus.slice(1)
			);
		}
		return "Stopped";
	};

	const getSimulationStatusColor = () => {
		switch (simulationStatus) {
			case "running":
				return "success.main";
			case "paused":
				return "warning.main";
			case "stopped":
				return "text.secondary";
			case "error":
				return "error.main";
			default:
				return "text.secondary";
		}
	};

	return (
		<>
			<AppBar position="static" sx={{ bgcolor: "black" }}>
				<Toolbar
					sx={{
						display: "flex",
						alignItems: "center",
						height: 64,
						padding: "0 16px",
						justifyContent: "space-between",
					}}
				>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<IconButton
							edge="start"
							color="inherit"
							onClick={() => setIsDrawerOpen(true)}
						>
							<MenuIcon />
						</IconButton>

						<Typography variant="h6" component="div">
							Delivery Tracker
						</Typography>

						<Button
							variant="contained"
							onClick={() => setDcDialogOpen(true)}
							sx={{
								backgroundColor: "green",
								"&:hover": {
									backgroundColor: "darkgreen",
								},
								textTransform: "none",
							}}
						>
							Manage Distribution Centers
						</Button>

						<Button
							variant="contained"
							onClick={() => setDestinationManagerOpen(true)}
							sx={{
								backgroundColor: "green",
								"&:hover": {
									backgroundColor: "darkgreen",
								},
								textTransform: "none",
							}}
						>
							Manage Destinations
						</Button>

						<Button
							variant="contained"
							onClick={() => setSetupDialogOpen(true)}
							sx={{
								backgroundColor: "green",
								"&:hover": {
									backgroundColor: "darkgreen",
								},
								textTransform: "none",
							}}
						>
							Setup Simulation
						</Button>
					</Box>

					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Tooltip title="Simulation Status">
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Box
									sx={{
										width: 8,
										height: 8,
										borderRadius: "50%",
										bgcolor: getSimulationStatusColor(),
									}}
								/>
								<Typography variant="body2" color="white">
									{getStatusText()}
								</Typography>
							</Box>
						</Tooltip>

						<Tooltip title="Toggle Map Type">
							<IconButton onClick={handleMapTypeToggle} color="inherit">
								<MapIcon />
							</IconButton>
						</Tooltip>

						{/* <Button
							color="inherit"
							onClick={() => navigate("/login")}
							sx={{ textTransform: "none" }}
						>
							Logout
						</Button> */}
					</Box>

					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleClose}
					>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<RouteIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Route Analysis</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleClose}>
							<ListItemIcon>
								<TimelineIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Performance</ListItemText>
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleMapSettings}>
							<ListItemIcon>
								<SettingsIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Settings</ListItemText>
						</MenuItem>
					</Menu>

					{setupDialogOpen && (
						<SimulationSetupDialog
							open={setupDialogOpen}
							onClose={() => setSetupDialogOpen(false)}
							onStart={handleStartSimulation}
						/>
					)}
				</Toolbar>
			</AppBar>

			<MapSettingsDialog
				open={settingsOpen}
				onClose={() => setSettingsOpen(false)}
			/>

			<DestinationManager
				open={destinationManagerOpen}
				onClose={() => setDestinationManagerOpen(false)}
			/>

			<SimulationSetupDialog
				open={setupDialogOpen}
				onClose={() => setSetupDialogOpen(false)}
				onStart={handleStartSimulation}
			/>

			<DistributionCenterDialog 
				open={dcDialogOpen}
				onClose={() => setDcDialogOpen(false)}
			/>

			<Drawer
				anchor="left"
				open={isDrawerOpen}
				onClose={() => setIsDrawerOpen(false)}
			>
				{/* Rest of the JSX with fixed indentation */}
			</Drawer>
		</>
	);
};

export default Navigation; 