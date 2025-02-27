import { useState, useCallback, useEffect } from 'react';
import useDeliveryStore from '../stores/deliveryStore';
import { deliveryApi } from '../services/deliveryApi';

const REPLAY_SPEED = 10; // 10x speed

export const useDeliveryReplay = () => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayData, setReplayData] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const { vehicles = [], setVehicles } = useDeliveryStore();

  const startReplay = useCallback(async (startDate, endDate) => {
    try {
      setIsReplaying(true);
      const history = await deliveryApi.getDeliveryHistory({ startDate, endDate });
      setReplayData(history);
      setCurrentFrame(0);
    } catch (error) {
      console.error('Failed to start replay:', error);
      setIsReplaying(false);
    }
  }, []);

  const stopReplay = useCallback(() => {
    setIsReplaying(false);
    setReplayData(null);
    setCurrentFrame(0);
  }, []);

  useEffect(() => {
    if (!isReplaying || !replayData || !Array.isArray(vehicles)) {
      return;
    }

    const interval = setInterval(() => {
      if (currentFrame >= replayData.length - 1) {
        stopReplay();
        return;
      }

      const frame = replayData[currentFrame];
      if (frame && Array.isArray(frame.vehicles)) {
        setVehicles(frame.vehicles);
        setCurrentFrame(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isReplaying, replayData, currentFrame, vehicles, setVehicles, stopReplay]);

  const updateVehiclePositions = useCallback((positions) => {
    if (!Array.isArray(vehicles)) {
      console.warn('Vehicles is not an array:', vehicles);
      return;
    }

    const updatedVehicles = vehicles.map(vehicle => ({
      ...vehicle,
      location: positions[vehicle.id] || vehicle.location
    }));

    setVehicles(updatedVehicles);
  }, [vehicles, setVehicles]);

  return {
    isReplaying,
    startReplay,
    stopReplay,
    currentFrame: replayData ? currentFrame : 0,
    totalFrames: replayData ? replayData.length : 0,
    updateVehiclePositions
  };
};

// Helper function to interpolate position between recorded points
const interpolatePosition = (positions, time) => {
  if (positions.length < 2) return positions[0];

  const idx = positions.findIndex(p => p.timestamp > time);
  if (idx === -1) return positions[positions.length - 1];
  if (idx === 0) return positions[0];

  const prev = positions[idx - 1];
  const next = positions[idx];
  const progress = (time - prev.timestamp) / (next.timestamp - prev.timestamp);

  return {
    lat: prev.lat + (next.lat - prev.lat) * progress,
    lng: prev.lng + (next.lng - prev.lng) * progress
  };
}; 