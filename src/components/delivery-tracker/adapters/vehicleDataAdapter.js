/**
 * Base adapter interface for vehicle data
 */
class VehicleDataAdapter {
  subscribe(callback) {
    throw new Error('subscribe must be implemented');
  }
  
  unsubscribe() {
    throw new Error('unsubscribe must be implemented');
  }
}

/**
 * Simulation adapter for testing
 */
export class SimulationAdapter extends VehicleDataAdapter {
  subscribe(callback) {
    // Current simulation logic
  }
  
  unsubscribe() {
    // Cleanup simulation
  }
}

/**
 * Real-time adapter for production
 */
export class RealTimeAdapter extends VehicleDataAdapter {
  constructor(config) {
    super();
    this.config = config;
  }
  
  subscribe(callback) {
    this.interval = setInterval(async () => {
      try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        callback(data);
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
      }
    }, this.config.updateInterval);
  }
  
  unsubscribe() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
} 