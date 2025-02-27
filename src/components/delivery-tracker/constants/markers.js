/* eslint-disable */
export const createMarkerIcon = (type) => {
	const iconConfigs = {
		origin: {
			path: "M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z",
			fillColor: "#1976d2",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#ffffff",
			scale: 1.5,
		},
		destination: {
			path: "M13.7836 15.8714L15.4762 14.1788L16.8904 15.593L15.1978 17.2856L13.7836 15.8714ZM17.6344 14.849L15.9418 13.1564L17.0109 12.0873C17.2006 11.8975 17.5057 11.8975 17.6954 12.0873L18.7035 13.0954C18.8933 13.2851 18.8933 13.5902 18.7035 13.7799L17.6344 14.849ZM19 3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.89 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.89 20.11 3 19 3ZM19 19H5V5H19V19Z",
			fillColor: "#f44336",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#ffffff",
			scale: 1.5,
		},
		vehicle: {
			path: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
			fillColor: "#4caf50",
			fillOpacity: 1,
			strokeWeight: 1,
			strokeColor: "#ffffff",
			scale: 1.5,
		},
	};

	return {
		path: iconConfigs[type].path,
		...iconConfigs[type],
		anchor: new google.maps.Point(12, 12),
	};
};

export const MARKER_ICONS = {
  VEHICLE: {
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
    fillColor: "#4CAF50",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#388E3C",
    scale: 1.5,
  },
  DESTINATION: {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: "#F44336",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#D32F2F",
    scale: 1.5,
  },
};

export const MARKER_OPTIONS = {
  optimized: true, // Center the marker on the position
};
