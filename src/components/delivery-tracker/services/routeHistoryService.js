import { deliveryApi } from './deliveryApi';

class RouteHistoryService {
  constructor() {
    this.historyCache = new Map();
    this.performanceMetrics = new Map();
  }

  async saveRouteHistory(routeId, routeData) {
    const timestamp = Date.now();
    const historyEntry = {
      timestamp,
      metrics: routeData.metrics,
      complexity: routeData.complexity,
      conditions: await this.getCurrentConditions(),
      performance: this.calculatePerformanceScore(routeData)
    };

    if (!this.historyCache.has(routeId)) {
      this.historyCache.set(routeId, []);
    }

    const routeHistory = this.historyCache.get(routeId);
    routeHistory.push(historyEntry);

    // Keep last 30 days of history
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    this.historyCache.set(
      routeId,
      routeHistory.filter(entry => entry.timestamp > thirtyDaysAgo)
    );

    await this.updatePerformanceMetrics(routeId);
    return historyEntry;
  }

  async getCurrentConditions() {
    const [weather, traffic] = await Promise.all([
      deliveryApi.getWeatherConditions(),
      deliveryApi.getTrafficConditions()
    ]);

    return {
      weather: {
        condition: weather.condition,
        temperature: weather.temperature,
        precipitation: weather.precipitation
      },
      traffic: {
        congestionLevel: traffic.congestionLevel,
        incidents: traffic.incidents.length,
        averageSpeed: traffic.averageSpeed
      },
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay()
    };
  }

  calculatePerformanceScore(routeData) {
    const weights = {
      duration: 0.3,
      distance: 0.2,
      traffic: 0.2,
      complexity: 0.3
    };

    const normalizedMetrics = {
      duration: this.normalize(routeData.metrics.estimatedDuration, 1800, 7200),
      distance: this.normalize(routeData.metrics.totalDistance, 5000, 50000),
      traffic: this.normalize(routeData.metrics.trafficImpact, 0, 50),
      complexity: this.normalize(routeData.complexity.complexityScore, 0, 10)
    };

    return Object.entries(weights).reduce((score, [metric, weight]) => {
      return score + (normalizedMetrics[metric] * weight);
    }, 0);
  }

  normalize(value, min, max) {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }

  async updatePerformanceMetrics(routeId) {
    const history = this.historyCache.get(routeId) || [];
    if (history.length < 2) return;

    const recentEntries = history.slice(-10);
    const performanceTrend = this.calculateTrend(
      recentEntries.map(entry => entry.performance)
    );

    const metrics = {
      averagePerformance: this.calculateAverage(recentEntries.map(entry => entry.performance)),
      trend: performanceTrend,
      consistency: this.calculateConsistency(recentEntries),
      recommendations: this.generateRecommendations(recentEntries)
    };

    this.performanceMetrics.set(routeId, metrics);
    return metrics;
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    const xMean = (values.length - 1) / 2;
    const yMean = values.reduce((sum, val) => sum + val, 0) / values.length;

    const numerator = values.reduce((sum, y, x) => sum + ((x - xMean) * (y - yMean)), 0);
    const denominator = values.reduce((sum, _, x) => sum + Math.pow(x - xMean, 2), 0);

    return denominator === 0 ? 0 : numerator / denominator;
  }

  calculateAverage(values) {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  calculateConsistency(entries) {
    const performances = entries.map(entry => entry.performance);
    const mean = this.calculateAverage(performances);
    const variance = performances.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / performances.length;
    return 1 - Math.min(1, Math.sqrt(variance));
  }

  generateRecommendations(entries) {
    const recommendations = [];
    const conditions = this.analyzeConditions(entries);

    if (conditions.highTrafficTimes.length > 0) {
      recommendations.push({
        type: 'timing',
        description: `Consider avoiding deliveries at ${conditions.highTrafficTimes.join(', ')} hours`,
        priority: 'high'
      });
    }

    if (conditions.weatherImpact > 0.3) {
      recommendations.push({
        type: 'weather',
        description: 'Route performance significantly affected by weather conditions',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  analyzeConditions(entries) {
    const timeAnalysis = new Map();
    let weatherImpact = 0;

    entries.forEach(entry => {
      const hour = entry.conditions.timeOfDay;
      const current = timeAnalysis.get(hour) || { count: 0, totalImpact: 0 };
      timeAnalysis.set(hour, {
        count: current.count + 1,
        totalImpact: current.totalImpact + entry.conditions.traffic.congestionLevel
      });

      if (entry.conditions.weather.condition !== 'clear') {
        weatherImpact += 1;
      }
    });

    const highTrafficTimes = Array.from(timeAnalysis.entries())
      .filter(([_, data]) => (data.totalImpact / data.count) > 0.7)
      .map(([hour]) => hour);

    return {
      highTrafficTimes,
      weatherImpact: weatherImpact / entries.length
    };
  }
}

export const routeHistory = new RouteHistoryService(); 