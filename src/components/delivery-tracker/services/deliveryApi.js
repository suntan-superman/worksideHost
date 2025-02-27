import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/delivery';
const BASE_URL = API_URL;

export const deliveryApi = {
  // Fetch delivery history for replay
  async getDeliveryHistory(dateRange) {
    try {
      const response = await axios.get(`${BASE_URL}/delivery-history`, {
        params: dateRange
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch delivery history:', error);
      return [];
    }
  },

  // Save delivery path history
  async saveDeliveryPath(vehicleId, pathData) {
    try {
      if (!vehicleId || !pathData?.location) {
        throw new Error('Invalid delivery path data');
      }

      const response = await axios.post(`${BASE_URL}/delivery-paths`, {
        vehicleId,
        path: {
          coordinates: {
            lat: Number(pathData.location.lat),
            lng: Number(pathData.location.lng)
          },
          timestamp: Date.now(),
          status: pathData.status || 'active',
          metrics: {
            speed: Number(pathData.speed) || 0,
            distance: Number(pathData.distance) || 0
          }
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Failed to save delivery path:', error);
      // Return null instead of throwing to prevent app disruption
      return null;
    }
  },

  // Get delivery success metrics
  async getDeliverySuccess(timeRange) {
    try {
      const response = await axios.get(`${BASE_URL}/delivery-success`, {
        params: timeRange
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch delivery success data:', error);
      throw error;
    }
  },

  // Get analytics data
  async getAnalytics(timeRange) {
    try {
      const response = await axios.get(`${BASE_URL}/analytics`, {
        params: timeRange
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      throw error;
    }
  },

  // Get vehicle utilization
  async getVehicleUtilization() {
    return {
      utilization: 75,
      trend: 5,
      history: []
    };
  }
}; 