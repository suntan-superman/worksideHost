import React from 'react';
import { Marker } from '@react-google-maps/api';

/**
 * A functional component that renders a map marker with optional clustering.
 *
 * @param {Object} props - The properties object.
 * @param {Object} props.position - The geographical position of the marker (latitude and longitude).
 * @param {number} props.index - The unique index of the marker.
 * @param {Object} [props.clusterer] - The clusterer instance to group markers (optional).
 * @returns {JSX.Element} The rendered Marker component.
 */
const Pin = ({ position, index, clusterer }) => (
	<Marker key={index} position={position} clusterer={clusterer} />
);

export default Pin;
