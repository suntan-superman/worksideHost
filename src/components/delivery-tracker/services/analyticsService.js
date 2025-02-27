import { deliveryApi } from './deliveryApi';

class AnalyticsService {
  constructor() {
    this.cache = new Map();
    this.aggregatedData = null;
    this.lastUpdate = null;
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
  }

  async getAggregatedData() {
    if (this.shouldUpdateCache()) {
      await this.updateAggregatedData();
    }
    return this.aggregatedData;
  }

  async updateAggregatedData() {
    try {
      const [efficiency, timing, routes] = await Promise.all([
        this.getCachedData('efficiency', () => deliveryApi.getEfficiencyMetrics()),
        this.getCachedData('timing', () => deliveryApi.getTimingMetrics()),
        this.getCachedData('routes', () => deliveryApi.getRouteMetrics())
      ]);

      this.aggregatedData = {
        efficiency: {
          overall: this.calculateEfficiencyScore(efficiency),
          breakdown: this.getEfficiencyBreakdown(efficiency)
        },
        timing: {
          averages: this.calculateTimeAverages(timing),
          distribution: this.getTimeDistribution(timing)
        },
        routes: {
          optimization: this.calculateRouteOptimization(routes),
          patterns: this.analyzeRoutePatterns(routes)
        }
      };

      this.lastUpdate = Date.now();
    } catch (error) {
      console.error('Failed to update aggregated data:', error);
      throw error;
    }
  }

  async getCachedData(key, fetchFn) {
    if (!this.cache.has(key) || this.shouldUpdateCache()) {
      const data = await fetchFn();
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
    return this.cache.get(key).data;
  }

  shouldUpdateCache() {
    return !this.lastUpdate || Date.now() - this.lastUpdate > this.updateInterval;
  }

  calculateEfficiencyScore(data) {
    const weights = {
      fuelEfficiency: 0.3,
      timeEfficiency: 0.4,
      routeOptimization: 0.3
    };

    return Object.entries(weights).reduce((score, [metric, weight]) => {
      return score + (data[metric] || 0) * weight;
    }, 0);
  }

  getEfficiencyBreakdown(data) {
    return {
      fuel: this.analyzeFuelEfficiency(data.fuelMetrics),
      time: this.analyzeTimeEfficiency(data.timeMetrics),
      route: this.analyzeRouteEfficiency(data.routeMetrics)
    };
  }

  analyzeFuelEfficiency(metrics) {
    if (!metrics) return null;
    return {
      average: metrics.averageConsumption,
      trend: this.calculateTrend(metrics.history),
      savings: this.calculateSavings(metrics)
    };
  }

  calculateTrend(history) {
    if (!history?.length) return 0;
    const periods = Math.min(history.length, 7); // Last 7 periods
    const recentData = history.slice(-periods);
    
    return recentData.reduce((acc, curr, idx) => {
      if (idx === 0) return 0;
      return acc + (curr - recentData[idx - 1]);
    }, 0) / (periods - 1);
  }

  calculateSavings(metrics) {
    const baseline = metrics.baselineConsumption || 0;
    const current = metrics.averageConsumption || 0;
    return baseline > 0 ? ((baseline - current) / baseline) * 100 : 0;
  }
}

export const analyticsService = new AnalyticsService(); 