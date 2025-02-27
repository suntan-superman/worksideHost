import React, { forwardRef } from "react";
import { Map } from "@vis.gl/react-google-maps";

const GoogleMapWrapper = forwardRef(
	(
		{
			children,
			center,
			zoom,
			onLoad,
			onDragEnd,
			onZoomChanged,
			styles,
			gestureHandling,
			mapId,
			options,
			onClick,
		},
		ref,
	) => {
		const handleLoad = (map) => {
			console.log("GoogleMapWrapper: Map loaded", {
				hasMap: Boolean(map),
				mapType: map ? map.constructor.name : "none",
			});

			if (ref) {
				ref.current = map;
			}
			onLoad?.(map);
		};

		return (
			<Map
				center={center}
				zoom={zoom}
				onLoad={handleLoad}
				onClick={onClick}
				styles={styles}
				gestureHandling={gestureHandling || "greedy"}
				mapId={mapId}
				options={{
					zoomControl: true,
					mapTypeControl: false,
					scaleControl: true,
					streetViewControl: false,
					rotateControl: false,
					fullscreenControl: true,
					minZoom: 3,
					maxZoom: 20,
					...options,
				}}
				onDragEnd={onDragEnd}
				onZoomChanged={onZoomChanged}
			>
				{children}
			</Map>
		);
	},
);

GoogleMapWrapper.displayName = "GoogleMapWrapper";

export default GoogleMapWrapper;
