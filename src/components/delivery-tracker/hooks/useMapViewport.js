import { useState, useEffect } from 'react';

const DEFAULT_VIEWPORT = {
  center: { lat: 35.2, lng: -119.3 },
  zoom: 12
};

const STORAGE_KEY = 'map_viewport';

export function useMapViewport() {
  const [viewport, setViewport] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : DEFAULT_VIEWPORT;
      
      // Validate saved data
      if (!parsed?.center?.lat || !parsed?.center?.lng || !parsed?.zoom) {
        console.warn('Invalid saved viewport, using default');
        return DEFAULT_VIEWPORT;
      }
      
      // Ensure values are numbers
      return {
        center: {
          lat: Number(parsed.center.lat),
          lng: Number(parsed.center.lng)
        },
        zoom: Number(parsed.zoom)
      };
    } catch (error) {
      console.error('Error reading viewport from localStorage:', error);
      return DEFAULT_VIEWPORT;
    }
  });

  useEffect(() => {
    if (viewport?.center?.lat && viewport?.center?.lng && viewport?.zoom) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(viewport));
      } catch (error) {
        console.error('Error saving viewport to localStorage:', error);
      }
    }
  }, [viewport]);

  const updateViewport = (newViewport) => {
    try {
      if (!newViewport?.center || !newViewport?.zoom) {
        console.warn('Invalid viewport update, ignoring', newViewport);
        return;
      }

      const updatedViewport = {
        center: {
          lat: Number(typeof newViewport.center.lat === 'function' 
            ? newViewport.center.lat() 
            : newViewport.center.lat),
          lng: Number(typeof newViewport.center.lng === 'function' 
            ? newViewport.center.lng() 
            : newViewport.center.lng)
        },
        zoom: Number(newViewport.zoom)
      };

      // Validate before updating
      if (isNaN(updatedViewport.center.lat) || 
          isNaN(updatedViewport.center.lng) || 
          isNaN(updatedViewport.zoom)) {
        console.warn('Invalid viewport values, ignoring update');
        return;
      }

      setViewport(updatedViewport);
    } catch (error) {
      console.error('Error updating viewport:', error);
    }
  };

  return [viewport, updateViewport];
} 