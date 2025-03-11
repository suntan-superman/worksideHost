/* eslint-disable */
import { useCallback, useRef, useEffect, useState } from 'react';
import useDeliveryStore from "../stores/deliveryStore";

const easeInOutCubic = (t) => {
    return t < 0.5 
        ? 4 * t * t * t 
        : 1 - (-2 * t + 2) ** 3 / 2;
};

export const useMapAnimations = () => {
    const animationsRef = useRef({});
    const [activeAnimations, setActiveAnimations] = useState({});

    const startAnimation = useCallback((vehicleId, startPosition, endPosition, duration, onUpdate) => {
        if (typeof onUpdate !== 'function') {
            console.error('onUpdate must be a function', { vehicleId, onUpdate });
            return;
        }

        // Cancel any existing animation for this vehicle
        if (animationsRef.current[vehicleId]) {
            cancelAnimationFrame(animationsRef.current[vehicleId].animationFrameId);
        }

        const startTime = Date.now();
        const animation = {
            startTime,
            startPosition,
            endPosition,
            duration,
            onUpdate,
            animationFrameId: null,
        };

        const animate = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const newPosition = {
                lat: startPosition.lat + (endPosition.lat - startPosition.lat) * progress,
                lng: startPosition.lng + (endPosition.lng - startPosition.lng) * progress,
            };

            onUpdate(newPosition);

            if (progress < 1) {
                animation.animationFrameId = requestAnimationFrame(animate);
            } else {
                // Animation complete
                delete animationsRef.current[vehicleId];
                setActiveAnimations((prev) => {
                    const next = { ...prev };
                    delete next[vehicleId];
                    return next;
                });
            }
        };

        animation.animationFrameId = requestAnimationFrame(animate);
        animationsRef.current[vehicleId] = animation;
        setActiveAnimations((prev) => ({ ...prev, [vehicleId]: true }));
    }, []);

    const cancelAllAnimations = useCallback(() => {
        console.log('Cancelling all animations');
        for (const animation of Object.values(animationsRef.current)) {
            if (animation.animationFrameId) {
                cancelAnimationFrame(animation.animationFrameId);
                if (animation.onUpdate) {
                    // Reset position to start
                    animation.onUpdate(animation.startPosition);
                }
            }
        }
        animationsRef.current = {};
        setActiveAnimations({});
    }, []);

    // Add cleanup effect
    useEffect(() => {
        return () => {
            cancelAllAnimations();
        };
    }, [cancelAllAnimations]);

    return { startAnimation, cancelAllAnimations, activeAnimations };
};

export function useMapAnimationsOld() {
    const animationFramesRef = useRef(new Map());
    const cleanupFunctionsRef = useRef(new Map());
    const { 
        setVehicles, 
        updateDeliveryProgress, 
        startVehicleAnimation, 
        updateVehicleAnimation, 
        stopVehicleAnimation
    } = useDeliveryStore();

    const getState = useDeliveryStore.getState;

    const startAnimation = useCallback((
        vehicleId,
        startPosition,
        endPosition,
        duration,
        onUpdate
    ) => {
        if (typeof onUpdate !== 'function') {
            console.error('onUpdate must be a function', { vehicleId, onUpdate });
            return;
        }

        console.log('useMapAnimations: Starting animation', {
            vehicleId,
            startPosition,
            endPosition,
            duration
        });

        // Cancel any existing animation for this vehicle
        if (animationFramesRef.current.has(vehicleId)) {
            cancelAnimationFrame(animationFramesRef.current.get(vehicleId));
        }

        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Calculate new position using easing
            const easedProgress = easeInOutCubic(progress);
            const newPosition = {
                lat: startPosition.lat + (endPosition.lat - startPosition.lat) * easedProgress,
                lng: startPosition.lng + (endPosition.lng - startPosition.lng) * easedProgress
            };
            
            console.log('Animation frame:', {
                vehicleId,
                progress: progress.toFixed(4),
                newPosition,
                elapsed: `${elapsed.toFixed(2)}ms`
            });

            try {
                onUpdate(newPosition);
            } catch (error) {
                console.error('Error in animation update:', error);
                cancelAnimationFrame(animationFramesRef.current.get(vehicleId));
                return;
            }
            
            if (progress < 1) {
                animationFramesRef.current.set(vehicleId, requestAnimationFrame(animate));
            } else {
                // Ensure final position is exact
                onUpdate(endPosition);
                animationFramesRef.current.delete(vehicleId);
            }
        };
        
        animationFramesRef.current.set(vehicleId, requestAnimationFrame(animate));
    }, []);

    const cancelAnimations = useCallback(() => {
        console.log('Cancelling all animations');
        for (const frameId of animationFramesRef.current.values()) {
            cancelAnimationFrame(frameId);
        }
        animationFramesRef.current.clear();
        cleanupFunctionsRef.current.clear();
    }, []);

    useEffect(() => {
        return () => {
            cancelAnimations();
        };
    }, [cancelAnimations]);

    return {
        startAnimation,
        stopAnimation: cancelAnimations
    };
}
