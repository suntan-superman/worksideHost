import {
  updateDeliveryLocation,
  getDeliveryLocation,
  getAllDeliveryLocations,
  UserLogin,
} from './worksideAPI';

export const api = {
  login: async (username, password) => {
    try {
      const {status, data} = await UserLogin(username, password);
      if (status === true) {
        return {status, user: data};
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error.message);
      throw error;
    }
  },

  updateLocation: async (userId, location) => {
    try {
      const response = await updateDeliveryLocation(userId, location);
      if (response.status !== 201) {
        throw new Error('Failed to update location');
      }
      return response.data;
    } catch (error) {
      console.error('Update location error:', error.message);
      throw error;
    }
  },

  getDeliveryLocation: async (deliveryId) => {
    try {
      const location = await getDeliveryLocation(deliveryId);
      if (!location) {
        throw new Error('No location data found');
      }
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: location.date,
      };
    } catch (error) {
      console.error('Get delivery location error:', error.message);
      // Return mock data for testing if needed
      return {
        latitude: 37.7749,
        longitude: -122.4194,
        timestamp: new Date().toISOString(),
      };
    }
  },

  getAllLocations: async (userId) => {
    try {
      return await getAllDeliveryLocations(userId);
    } catch (error) {
      console.error('Get all locations error:', error.message);
      return [];
    }
  },
}; 