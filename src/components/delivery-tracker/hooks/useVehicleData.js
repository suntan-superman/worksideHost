/* eslint-disable */
import { useEffect } from 'react';
import axiosInstance from "../api/axiosConfig";
import useDeliveryStore from '../stores/deliveryStore';

export const useVehicleData = () => {
    const { setVehicles } = useDeliveryStore();

    useEffect(() => {
        let isMounted = true;

        const fetchVehicles = async () => {
            try {
                console.log("Initiating vehicle fetch...");
                
                // Use the correct endpoint
                const response = await axiosInstance.get("/api/vehicle");
                console.log("API Response:", response.data);

                if (!isMounted) return;

                const vehiclesList = response.data.data || [];
                if (!Array.isArray(vehiclesList)) {
                    throw new Error("Invalid response format - expected array");
                }

                // Transform API data to match store format with slightly spread locations
                const transformedVehicles = vehiclesList.map((vehicle, index) => {
                    // Base location
                    const baseLat = vehicle.currentLocation?.coordinates?.lat || 35.48;
                    const baseLng = vehicle.currentLocation?.coordinates?.lng || -118.9;
                    
                    // Spread vehicles in a circle around the base location
                    const spread = 0.01; // About 1km spread instead of 2km
                    const angle = (index * 360) / vehiclesList.length;
                    const lat = baseLat + spread * Math.cos(angle * (Math.PI / 180));
                    const lng = baseLng + spread * Math.sin(angle * (Math.PI / 180));

                    console.log(`Vehicle ${vehicle.vehicleId} positioned at:`, { lat, lng });

                    return {
                        id: vehicle.vehicleId,
                        name: `${vehicle.specifications.make} ${vehicle.specifications.model}`,
                        location: { lat, lng },
                        status: vehicle.status || 'idle',
                        metrics: {
                            progress: 0,
                            currentSpeed: 0,
                        },
                    };
                });

                console.log("Transformed vehicles:", transformedVehicles);
                setVehicles(transformedVehicles);
            } catch (err) {
                console.error("Vehicle fetch error:", {
                    message: err.message,
                    response: err.response,
                    data: err.response?.data
                });
            }
        };

        fetchVehicles();

        return () => {
            isMounted = false;
        };
    }, [setVehicles]);
};

export default useVehicleData;
