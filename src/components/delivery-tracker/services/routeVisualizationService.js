// import { calculateDistance } from '../utils/mapUtils';  // Remove if not needed

export class RouteVisualizationService {
  constructor(map) {
    if (!map) {
      throw new Error('Map instance is required');
    }
    this.map = map;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      preserveViewport: true
    });
    this.trafficLayer = null;
    this.heatmapLayer = null;
  }

  initialize() {
    this.trafficLayer = new google.maps.TrafficLayer();
    this.heatmapLayer = new google.maps.visualization.HeatmapLayer();
  }

  async getDetailedRoute(origin, destination, waypoints = []) {
    if (!this.directionsService) {
      throw new Error('Route visualization service not initialized');
    }

    try {
      const result = await this.directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
        provideRouteAlternatives: true
      });

      return result;
    } catch (error) {
      console.error('Error getting route details:', error);
      throw error;
    }
  }

  processRouteResponse(response) {
    const routes = response.routes.map(route => ({
      path: route.overview_path,
      segments: this.extractRouteSegments(route),
      duration: route.legs.reduce((total, leg) => total + leg.duration.value, 0),
      distance: route.legs.reduce((total, leg) => total + leg.distance.value, 0),
      trafficDensity: this.calculateTrafficDensity(route),
      complexity: this.calculateRouteComplexity(route)
    }));

    return {
      primaryRoute: routes[0],
      alternatives: routes.slice(1),
      metrics: this.calculateRouteMetrics(routes)
    };
  }

  extractRouteSegments(route) {
    return route.legs.flatMap(leg => 
      leg.steps.map(step => ({
        path: step.path,
        instruction: step.instructions,
        distance: step.distance.value,
        duration: step.duration.value,
        trafficDensity: step.duration_in_traffic?.value || step.duration.value,
        maneuver: step.maneuver
      }))
    );
  }

  calculateTrafficDensity(route) {
    const segments = this.extractRouteSegments(route);
    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    const weightedDensity = segments.reduce((sum, segment) => {
      const weight = segment.distance / totalDistance;
      return sum + (segment.trafficDensity * weight);
    }, 0);

    return weightedDensity;
  }

  calculateRouteComplexity(route) {
    const segments = this.extractRouteSegments(route);
    const turns = segments.filter(segment => segment.maneuver).length;
    const intersections = segments.length;
    
    return {
      turns,
      intersections,
      complexityScore: (turns * 0.7 + intersections * 0.3) / route.legs.length
    };
  }

  calculateRouteMetrics(routes) {
    const primary = routes[0];
    return {
      estimatedDuration: primary.duration,
      totalDistance: primary.distance,
      averageSpeed: (primary.distance / 1000) / (primary.duration / 3600), // km/h
      trafficImpact: this.calculateTrafficImpact(routes),
      alternativeCount: routes.length - 1,
      complexityScore: primary.complexity.complexityScore
    };
  }

  calculateTrafficImpact(routes) {
    const primary = routes[0];
    const freeFlowDuration = primary.segments.reduce(
      (total, segment) => total + segment.duration,
      0
    );
    const actualDuration = primary.duration;
    
    return (actualDuration - freeFlowDuration) / freeFlowDuration * 100;
  }

  generateHeatmapData(routes) {
    const points = routes.flatMap(route => 
      route.path.map(point => ({
        location: new google.maps.LatLng(point.lat(), point.lng()),
        weight: this.calculatePointWeight(point, route)
      }))
    );

    return {
      data: points,
      options: {
        radius: 20,
        opacity: 0.6,
        gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)'
        ]
      }
    };
  }

  calculatePointWeight(point, route) {
    // Weight based on traffic density and route complexity
    const baseWeight = 1;
    const trafficFactor = route.trafficDensity / 100;
    const complexityFactor = route.complexity.complexityScore / 10;
    
    return baseWeight * (1 + trafficFactor + complexityFactor);
  }
} 