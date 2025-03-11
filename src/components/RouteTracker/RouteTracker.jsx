// LocationTracker.js
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
	View,
	StyleSheet,
	Text,
	SafeAreaView,
	TouchableOpacity,
	Alert,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { BottomModal } from "react-native-modals";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";

// Define tracking profiles similar to adaptiveLocationTracking
const TrackingProfiles = {
	HIGH_ACCURACY: {
		accuracy: Location.Accuracy.BestForNavigation,
		timeInterval: 5000,
		distanceInterval: 10,
	},
	BALANCED: {
		accuracy: Location.Accuracy.Balanced,
		timeInterval: 10000,
		distanceInterval: 50,
	},
	BATTERY_SAVING: {
		accuracy: Location.Accuracy.Low,
		timeInterval: 30000,
		distanceInterval: 100,
	},
};

const RouteTracker = ({
	targetDestination,
	destinationPerimeter = 300, // default 300 feet
	navigation,
	requestId,
	supplierId,
}) => {
	const [routeData, setRouteData] = useState([]);
	const [lastLocation, setLastLocation] = useState(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [lastUpdate, setLastUpdate] = useState(null);
	const mapRef = useRef(null);

	const fetchRouteData = useCallback(async () => {
		try {
			const response = await axios.post(
				"https://workside-software.wl.r.appspot.com/api/mapping/coordinates",
				{
					requestid: requestId,
					supplierid: supplierId,
				},
				{
					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data && response.data.length > 0) {
				const formattedRoute = response.data.map((point) => ({
					latitude: point.lat,
					longitude: point.lng,
					timestamp: new Date(point.date),
				}));

				setRouteData(formattedRoute);
				setLastLocation(formattedRoute[formattedRoute.length - 1]);
				setLastUpdate(
					new Date(
						response.data[response.data.length - 1].date,
					).toLocaleTimeString(),
				);
			}
		} catch (error) {
			Alert.alert("Error", `Failed to fetch route data: ${error.message}`);
		}
	}, [requestId, supplierId]);

	useEffect(() => {
		fetchRouteData();
		// Fetch route data every 30 seconds
		const interval = setInterval(fetchRouteData, 30000);
		return () => clearInterval(interval);
	}, [fetchRouteData]);

	const fitMapToRoute = useCallback(() => {
		if (mapRef.current && routeData.length > 0 && targetDestination) {
			const coordinates = [...routeData, targetDestination];
			mapRef.current.fitToCoordinates(coordinates, {
				edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
				animated: true,
			});
		}
	}, [routeData, targetDestination]);

	useEffect(() => {
		if (routeData.length > 0 && targetDestination) {
			fitMapToRoute();
		}
	}, [routeData, targetDestination, fitMapToRoute]);

	const formatCoordinates = (coords) => {
		if (!coords) return "Unknown";
		return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
	};

	const renderMarkers = () => {
		return (
			<>
				{/* Last Known Location Marker */}
				{lastLocation && (
					<Marker
						coordinate={{
							latitude: lastLocation.latitude,
							longitude: lastLocation.longitude,
						}}
						title="Last Known Location"
					>
						<View style={styles.truckMarker}>
							<Text style={styles.markerText}>🚛</Text>
						</View>
					</Marker>
				)}

				{/* Destination Marker */}
				{targetDestination && (
					<Marker coordinate={targetDestination} title="Destination">
						<View style={styles.destinationMarker}>
							<Text style={styles.markerText}>
								{targetDestination.type === "construction" ? "🏗️" : "🛢️"}
							</Text>
						</View>
					</Marker>
				)}

				{/* Route Polyline */}
				{routeData.length > 1 && (
					<Polyline
						coordinates={routeData}
						strokeColor="#2980b9"
						strokeWidth={3}
					/>
				)}
			</>
		);
	};

	const renderHeader = () => (
		<View style={styles.header}>
			<View style={styles.headerContent}>
				<TouchableOpacity
					style={styles.backButton}
					onPress={() => navigation.goBack()}
				>
					<Ionicons name="arrow-back" size={24} color="#fff" />
				</TouchableOpacity>
				<Text style={styles.headerText}>WORKSIDE</Text>
				<TouchableOpacity
					style={[styles.refreshButton]}
					onPress={fetchRouteData}
				>
					<Text style={styles.refreshButtonText}>Refresh</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const renderFooter = () => (
		<View style={styles.footer}>
			<View style={styles.footerContent}>
				<View style={styles.footerLeft}>
					<Text style={styles.footerLabel}>Last Known Position:</Text>
					<Text style={styles.coordinates}>
						{formatCoordinates(lastLocation)}
					</Text>
					{lastUpdate && (
						<Text style={styles.updateTime}>Last Update: {lastUpdate}</Text>
					)}
				</View>
				<TouchableOpacity
					style={styles.chevronButton}
					onPress={() => setIsModalVisible(true)}
				>
					<Ionicons name="chevron-up" size={24} color="#fff" />
				</TouchableOpacity>
			</View>
			<BottomModal
				visible={isModalVisible}
				onTouchOutside={() => setIsModalVisible(false)}
				height={0.4}
				width={1}
				onSwipeOut={() => setIsModalVisible(false)}
			>
				<View style={styles.modalContent}>
					<Text style={styles.modalTitle}>Route Details</Text>
					<Text style={styles.modalText}>Total Points: {routeData.length}</Text>
					{lastUpdate && (
						<Text style={styles.modalText}>Last Update: {lastUpdate}</Text>
					)}
					<TouchableOpacity
						style={styles.closeButton}
						onPress={() => setIsModalVisible(false)}
					>
						<Text style={styles.closeButtonText}>Close</Text>
					</TouchableOpacity>
				</View>
			</BottomModal>
		</View>
	);

	return (
		<SafeAreaView style={styles.container}>
			{renderHeader()}

			<View style={styles.mapContainer}>
				<MapView
					provider={MapView.PROVIDER_GOOGLE}
					ref={mapRef}
					style={styles.map}
					initialRegion={{
						latitude: targetDestination.latitude,
						longitude: targetDestination.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
					onMapReady={fitMapToRoute}
					onLayout={fitMapToRoute}
				>
					{renderMarkers()}
				</MapView>
			</View>

			{renderFooter()}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		height: 60,
		backgroundColor: "#2c3e50",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	headerContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		width: "100%",
	},
	headerText: {
		color: "#fff",
		fontSize: 24,
		fontWeight: "bold",
	},
	mapContainer: {
		flex: 1,
		position: "relative",
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	loading: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	footer: {
		backgroundColor: "#2c3e50",
		padding: 10,
	},
	footerContent: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	footerLeft: {
		flex: 1,
	},
	footerLabel: {
		color: "#fff",
		fontSize: 12,
		marginBottom: 3,
	},
	coordinates: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	truckMarker: {
		padding: 5,
	},
	destinationMarker: {
		padding: 5,
	},
	markerText: {
		fontSize: 24,
	},
	refreshButton: {
		position: "absolute",
		right: 0,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 5,
		backgroundColor: "#2980b9",
	},
	refreshButtonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "bold",
	},
	updateTime: {
		color: "#fff",
		fontSize: 12,
		marginTop: 5,
	},
	chevronButton: {
		padding: 10,
	},
	modalContent: {
		backgroundColor: "#f5f5f5",
		padding: 20,
		borderWidth: 2,
		borderColor: "#2c3e50",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		height: "100%",
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2c3e50",
		marginBottom: 20,
	},
	modalText: {
		fontSize: 16,
		color: "#2c3e50",
		marginBottom: 10,
	},
	closeButton: {
		backgroundColor: "#2c3e50",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 20,
	},
	closeButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	backButton: {
		position: "absolute",
		left: 0,
		padding: 10,
	},
});

export default RouteTracker;
