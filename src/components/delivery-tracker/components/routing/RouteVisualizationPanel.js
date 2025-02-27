import React, { useEffect, useState } from "react";
import {
	Paper,
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Tooltip,
	Divider,
	Chip,
	Tabs,
	Tab,
} from "@mui/material";
import {
	CompareArrows as CompareIcon,
	Timeline as TimelineIcon,
	Speed as SpeedIcon,
	Traffic as TrafficIcon,
	Visibility as VisibilityIcon,
	Settings as SettingsIcon,
} from "@mui/icons-material";
import { useRouteVisualization } from "../../hooks/useRouteVisualization";
import RouteComparisonPanel from "./RouteComparisonPanel";
import OptimizationInsightsPanel from "./OptimizationInsightsPanel";
import RouteHistoryPanel from "./RouteHistoryPanel";
import RoutePerformanceInsights from "./RoutePerformanceInsights";
import RouteOptimizationSettings from "./RouteOptimizationSettings";
import { useRouteSimulation } from "../../hooks/useRouteSimulation";
import SimulationDetailsPanel from "./SimulationDetailsPanel";
import SimulationComparisonPanel from "./SimulationComparisonPanel";
import { useSimulationHistory } from "../../hooks/useSimulationHistory";
import DraggableDialog from "../common/DraggableDialog";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import useDeliveryStore from "../../stores/deliveryStore";

const RouteVisualizationPanel = ({ map }) => {
	const {
		visualizationState,
		toggleHeatmap,
		toggleTraffic,
		selectRoute,
		initializeService,
		isInitialized,
		getDetailedRoute,
		setActiveRoutes,
	} = useRouteVisualization();

	const { vehicles, destinations, originLocation } = useDeliveryStore();
	const [routes, setRoutes] = useState([]);

	// Initialize with empty arrays and default values
	const {
		activeRoutes = [],
		selectedRouteIndex = 0,
		heatmapVisible = false,
		trafficVisible = false,
	} = visualizationState || {};

	const [showComparison, setShowComparison] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [showSimComparison, setShowSimComparison] = useState(false);
	const [activeTab, setActiveTab] = useState(0);

	const { results } = useRouteSimulation();
	const { history } = useSimulationHistory();

	const mapsLibrary = useMapsLibrary("maps");

	// Only initialize service when map is available
	useEffect(() => {
		if (map && !isInitialized) {
			try {
				initializeService(map);
			} catch (error) {
				console.error("Failed to initialize route visualization:", error);
			}
		}
	}, [map, isInitialized, initializeService]);

	// Load initial routes only after service is initialized
	useEffect(() => {
		if (isInitialized && map) {
			const loadRoutes = async () => {
				try {
					const result = await getDetailedRoute(
						{ lat: 35.48, lng: -118.9 }, // origin
						{ lat: 35.2, lng: -119.3 }, // destination
					);
					if (result) {
						setActiveRoutes([result]);
					}
				} catch (error) {
					console.error("Failed to load routes:", error);
				}
			};
			loadRoutes();
		}
	}, [isInitialized, getDetailedRoute, setActiveRoutes, map]);

	useEffect(() => {
		// Calculate routes for active vehicles
		const activeRoutes = vehicles
			.filter((v) => v.status === "active" && v.destinationId)
			.map((vehicle) => {
				const destination = destinations.find(
					(d) => d.id === vehicle.destinationId,
				);
				if (!destination) return null;

				return {
					vehicleId: vehicle.id,
					path: [
						originLocation,
						vehicle.location,
						destination.coordinates,
					].filter(Boolean),
					color: vehicle.color || "#2196f3",
				};
			})
			.filter(Boolean);

		setRoutes(activeRoutes);
	}, [vehicles, destinations, originLocation]);

	// Don't render anything until map is available
	if (!map) {
		return null;
	}

	const formatDuration = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	const formatDistance = (meters) => {
		return `${(meters / 1000).toFixed(1)} km`;
	};

	const getTrafficImpactColor = (impact) => {
		if (impact < 10) return "success";
		if (impact < 30) return "warning";
		return "error";
	};

	const processRouteData = (route) => {
		if (!route) return null;

		// Extract basic route information
		const legs = route.routes?.[0]?.legs || [];
		const totalDistance = legs.reduce(
			(sum, leg) => sum + (leg.distance?.value || 0),
			0,
		);
		const totalDuration = legs.reduce(
			(sum, leg) => sum + (leg.duration?.value || 0),
			0,
		);

		// Calculate average speed (km/h)
		const averageSpeed =
			totalDuration > 0 ? totalDistance / 1000 / (totalDuration / 3600) : 0;

		// Extract steps/segments with null checks
		const segments = legs.flatMap(
			(leg) =>
				leg.steps?.map((step) => ({
					instruction: step.instructions || "",
					distance: step.distance?.value || 0,
					duration: step.duration?.value || 0,
				})) || [],
		);

		return {
			metrics: {
				totalDistance,
				estimatedDuration: totalDuration,
				averageSpeed,
				trafficImpact: 0,
			},
			segments,
			complexity: {
				turns: segments.length - 1,
				intersections: segments.length,
			},
		};
	};

	const createUniqueKey = (route, index) => {
		return `route-${route?.id || route?.vehicleId || `temp-${index}`}-${Date.now()}`;
	};

	const createSafeHtmlContent = (instruction) => {
		// Sanitize HTML content - only allow basic formatting
		const sanitized =
			instruction?.replace(/<(?!\/?b|\/?div|\/?span)[^>]+>/g, "") || // Only allow basic tags
			"No instructions available";

		return {
			__html: sanitized,
		};
	};

	const renderRouteSegment = (segment, index, totalSegments) => {
		const segmentKey = `segment-${segment?.distance}-${segment?.duration}-${index}`;

		return (
			<ListItem key={segmentKey}>
				<ListItemText
					primary={
						<Typography
							component="div"
							variant="body2"
							sx={{
								"& b": { fontWeight: "bold" },
								"& span": { color: "text.secondary" },
							}}
						>
							{segment?.instruction || "No instructions available"}
						</Typography>
					}
					secondary={
						segment
							? `${formatDistance(segment.distance)} • ${formatDuration(segment.duration)}`
							: "No details available"
					}
				/>
			</ListItem>
		);
	};

	const renderRouteCard = (rawRoute, index, totalRoutes) => {
		const route = processRouteData(rawRoute);
		if (!route) return null;

		const cardKey = createUniqueKey(rawRoute, index);

		return (
			<Box
				key={cardKey}
				sx={{
					mb: 2,
					p: 2,
					borderRadius: 1,
					bgcolor:
						selectedRouteIndex === index ? "action.selected" : "transparent",
					cursor: "pointer",
				}}
				onClick={() => selectRoute(index)}
			>
				<Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
					<Typography variant="subtitle1" sx={{ flex: 1 }}>
						Route {index + 1}
						{index === 0 && (
							<Chip
								label="Primary"
								size="small"
								color="primary"
								sx={{ ml: 1 }}
							/>
						)}
					</Typography>
					<SpeedIcon sx={{ mr: 1 }} />
					<Typography variant="body2">
						{Math.round(route.metrics.averageSpeed)} km/h
					</Typography>
				</Box>

				<Box sx={{ display: "flex", gap: 2, mb: 1 }}>
					<Typography variant="body2" color="text.secondary">
						{formatDistance(route.metrics.totalDistance)}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{formatDuration(route.metrics.estimatedDuration)}
					</Typography>
					<Chip
						size="small"
						label={`${Math.round(route.metrics.trafficImpact)}% delay`}
						color={getTrafficImpactColor(route.metrics.trafficImpact)}
					/>
				</Box>

				{route.complexity && (
					<Box sx={{ mt: 1 }}>
						<Typography variant="caption" color="text.secondary">
							Complexity: {route.complexity.turns} turns,
							{route.complexity.intersections} intersections
						</Typography>
					</Box>
				)}
			</Box>
		);
	};

	useEffect(() => {
		if (!map || !mapsLibrary || !routes.length) return;

		const paths = routes
			.map((route) => {
				if (!route.path || route.path.length < 2) return null;

				const path = new mapsLibrary.Polyline({
					path: route.path,
					geodesic: true,
					strokeColor: route.color,
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
	}, [map, mapsLibrary, routes]);

	return (
		<DraggableDialog dialogId="routeVisualization" title="Route Analysis">
			<Box>
				<Tabs
					value={activeTab}
					onChange={(_, newValue) => setActiveTab(newValue)}
					variant="fullWidth"
					sx={{ mb: 2 }}
				>
					<Tab label="Routes" />
					<Tab label="Analysis" />
					<Tab label="Simulation" />
				</Tabs>

				<Paper
					sx={{
						position: "absolute",
						top: 80,
						left: 20,
						width: 350,
						maxHeight: "70vh",
						overflow: "auto",
						backgroundColor: "rgba(255, 255, 255, 0.95)",
						zIndex: 1000,
					}}
				>
					<Box sx={{ p: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
							<TimelineIcon sx={{ mr: 1 }} />
							<Typography variant="h6" sx={{ flex: 1 }}>
								Route Analysis
							</Typography>
							<Box sx={{ display: "flex", gap: 1 }}>
								<Tooltip title="Compare Routes">
									<IconButton
										onClick={() => setShowComparison(true)}
										size="small"
										disabled={activeRoutes.length < 2}
									>
										<CompareIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Compare Simulations">
									<IconButton
										onClick={() => setShowSimComparison(true)}
										size="small"
										disabled={history.length < 2}
									>
										<CompareIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Toggle Traffic Layer">
									<IconButton onClick={toggleTraffic} size="small">
										<TrafficIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Toggle Heatmap">
									<IconButton onClick={toggleHeatmap} size="small">
										<VisibilityIcon />
									</IconButton>
								</Tooltip>
								<Tooltip title="Optimization Settings">
									<IconButton
										onClick={() => setShowSettings(true)}
										size="small"
									>
										<SettingsIcon />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>

						<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
							<Tabs
								value={activeTab}
								onChange={(_, newValue) => setActiveTab(newValue)}
							>
								<Tab label="Current Route" />
								<Tab label="History" />
								<Tab label="Performance" />
							</Tabs>
						</Box>

						<Box sx={{ p: 2 }}>
							{activeTab === 0 &&
								Array.isArray(activeRoutes) &&
								activeRoutes.map((route, index) =>
									renderRouteCard(route, index, activeRoutes.length),
								)}
							{activeTab === 1 && (
								<RouteHistoryPanel
									routeId={activeRoutes[selectedRouteIndex]?.id}
								/>
							)}
							{activeTab === 2 && (
								<RoutePerformanceInsights
									routeId={activeRoutes[selectedRouteIndex]?.id}
								/>
							)}
						</Box>

						<Divider sx={{ my: 2 }} />

						<List dense>
							{activeRoutes[selectedRouteIndex]?.segments?.map(
								(segment, index) =>
									renderRouteSegment(
										segment,
										index,
										activeRoutes[selectedRouteIndex]?.segments?.length,
									),
							)}
						</List>
					</Box>
				</Paper>

				{/* Combine route visualization panels */}
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{/* Route Comparison */}
					<RouteComparisonPanel
						open={showComparison}
						onClose={() => setShowComparison(false)}
					/>

					{/* Route Settings */}
					<RouteOptimizationSettings
						open={showSettings}
						onClose={() => setShowSettings(false)}
					/>

					{/* Optimization Insights */}
					<OptimizationInsightsPanel />

					{/* Simulation Results */}
					{results && <SimulationDetailsPanel results={results} />}

					{/* Simulation Comparison */}
					<SimulationComparisonPanel
						open={showSimComparison}
						onClose={() => setShowSimComparison(false)}
					/>
				</Box>

				{/* Active Routes Visualization */}
				<Box sx={{ position: "relative", zIndex: 400 }}>
					{/* Route Polylines */}
					{routes.map((route) => (
						<Polyline
							key={`route-${route.vehicleId}`}
							path={route.path}
							options={{
								strokeColor: route.color,
								strokeOpacity: 0.8,
								strokeWeight: 3,
							}}
						/>
					))}

					{/* Active Routes Panel */}
					{routes.length > 0 && (
						<Paper
							sx={{
								position: "absolute",
								top: 80,
								left: 20,
								zIndex: 400,
								p: 2,
								width: 300,
								maxHeight: "calc(100vh - 200px)",
								overflow: "auto",
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								boxShadow: 3,
							}}
						>
							<Typography variant="h6" gutterBottom>
								Active Routes ({routes.length})
							</Typography>
							<Divider sx={{ mb: 2 }} />

							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								{routes.map((route) => {
									const vehicle = vehicles.find(
										(v) => v.id === route.vehicleId,
									);
									const destination = destinations.find(
										(d) => d.id === vehicle?.destinationId,
									);

									return (
										<Box
											key={route.vehicleId}
											sx={{
												p: 1.5,
												borderRadius: 1,
												bgcolor: "background.paper",
												boxShadow: 1,
											}}
										>
											<Typography
												variant="subtitle1"
												sx={{ fontWeight: "medium" }}
											>
												{vehicle?.name}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												To: {destination?.name}
											</Typography>
											{vehicle?.metrics?.progress && (
												<Box
													sx={{ mt: 1, display: "flex", alignItems: "center" }}
												>
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{ mr: 1 }}
													>
														Progress:
													</Typography>
													<Box
														sx={{
															flex: 1,
															height: 4,
															bgcolor: "grey.200",
															borderRadius: 1,
															overflow: "hidden",
														}}
													>
														<Box
															sx={{
																width: `${vehicle.metrics.progress}%`,
																height: "100%",
																bgcolor: "primary.main",
															}}
														/>
													</Box>
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{ ml: 1 }}
													>
														{vehicle.metrics.progress.toFixed(1)}%
													</Typography>
												</Box>
											)}
										</Box>
									);
								})}
							</Box>
						</Paper>
					)}
				</Box>
			</Box>
		</DraggableDialog>
	);
};

export default RouteVisualizationPanel; 