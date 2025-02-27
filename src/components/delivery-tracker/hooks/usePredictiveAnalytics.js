import { useState, useCallback } from 'react';
import { predictiveAnalytics } from '../services/predictiveAnalytics';

export const usePredictiveAnalytics = () => {
  const [predictions, setPredictions] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const predictDeliveryTime = useCallback(async (routeData) => {
    setIsLoading(true);
    try {
      const features = {
        distance: routeData.distance,
        traffic: routeData.trafficScore,
        timeOfDay: new Date().getHours(),
        dayOfWeek: new Date().getDay(),
        weather: routeData.weatherScore,
        vehicleLoad: routeData.loadPercentage
      };

      const predictedTime = await predictiveAnalytics.predictDeliveryTime(features);
      
      setPredictions(prev => ({
        ...prev,
        [routeData.routeId]: {
          time: predictedTime,
          confidence: calculateConfidence(features),
          timestamp: Date.now()
        }
      }));

      return predictedTime;
    } catch (error) {
      console.error('Prediction failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const calculateConfidence = (features) => {
    // Simple confidence calculation based on data quality
    const weights = {
      traffic: 0.3,
      weather: 0.2,
      timeOfDay: 0.2,
      distance: 0.3
    };

    let confidence = 0;
    Object.entries(weights).forEach(([key, weight]) => {
      const value = features[key];
      const score = value > 0 ? 1 : 0.5;
      confidence += score * weight;
    });

    return Math.round(confidence * 100);
  };

  return {
    predictions,
    isLoading,
    predictDeliveryTime
  };
}; 