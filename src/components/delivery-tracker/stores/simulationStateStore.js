/* eslint-disable */
import { create } from 'zustand';

const useSimulationStateStore = create((set, get) => ({
  activeSimulations: new Set(),
  simulationStatus: {},  
  startSimulation: (vehicleId) => {
    set((state) => {
      const activeSimulations = new Set(state.activeSimulations);
      activeSimulations.add(vehicleId);
      return {
        activeSimulations,
        simulationStatus: {
          ...state.simulationStatus,
          [vehicleId]: {
            isActive: true,
            startTime: Date.now(),
          },
        },
      };
    });
  },

  stopSimulation: (vehicleId) => {
    set((state) => {
      const activeSimulations = new Set(state.activeSimulations);
      activeSimulations.delete(vehicleId);
      const { [vehicleId]: removed, ...remainingStatus } = state.simulationStatus;
      return {
        activeSimulations,
        simulationStatus: remainingStatus,
      };
    });
  },

  isSimulationActive: vehicleId => get().activeSimulations.has(vehicleId),

  clearAllSimulations: () => {
    set({
      activeSimulations: new Set(),
      simulationStatus: {},
    });
  },
}));

export default useSimulationStateStore;
