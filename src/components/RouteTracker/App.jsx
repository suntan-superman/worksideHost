// App.js
import React, { useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ModalPortal } from "react-native-modals";
import RouteTracker from "./src/RouteTracker";
import LoginScreen from "./src/screens/LoginScreen";

const Stack = createNativeStackNavigator();

// Define TrackerScreen outside of App component
const TrackerScreen = ({ navigation, route }) => {
	const targetDestination = useMemo(
		() => ({
			latitude: 35.5464,
			longitude: -119.7895,
			type: "oilwell",
		}),
		[],
	);

	// These would typically come from your login flow or route params
	const requestId = useMemo(() => "65f123abc456def789012345", []);
	const supplierId = useMemo(() => "65f123abc456def789012346", []);

	return (
		<RouteTracker
			navigation={navigation}
			route={route}
			targetDestination={targetDestination}
			destinationPerimeter={500}
			requestId={requestId}
			supplierId={supplierId}
		/>
	);
};

const App = () => {
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login">
					<Stack.Screen
						name="Login"
						component={LoginScreen}
						options={{ headerShown: false }}
					/>
					<Stack.Screen
						name="Tracker"
						component={TrackerScreen}
						options={{ headerShown: false }}
					/>
				</Stack.Navigator>
			</NavigationContainer>
			<ModalPortal />
		</>
	);
};

export default App;
