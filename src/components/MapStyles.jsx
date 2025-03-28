/* eslint-disable */

/**
 * An array of style objects used to customize the appearance of a map.
 * Each style object targets specific map features and elements, applying
 * various visual properties such as color, lightness, and visibility.
 *
 * @constant
 * @type {Array<Object>}
 * @property {string} featureType - The type of map feature to style (e.g., "water", "road.highway").
 * @property {string} elementType - The specific element of the feature to style (e.g., "geometry", "labels.text.fill").
 * @property {Array<Object>} stylers - An array of style rules to apply to the specified feature and element.
 * @property {string} [stylers[].color] - The color to apply to the feature/element.
 * @property {number} [stylers[].lightness] - The lightness adjustment to apply.
 * @property {number} [stylers[].weight] - The weight (thickness) adjustment to apply.
 * @property {string} [stylers[].visibility] - The visibility setting (e.g., "on", "off").
 * @property {number} [stylers[].saturation] - The saturation adjustment to apply.
 */
const mapStyles = [
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#e9e9e9",
			},
			{
				lightness: 17,
			},
		],
	},
	{
		featureType: "landscape",
		elementType: "geometry",
		stylers: [
			{
				color: "#f5f5f5",
			},
			{
				lightness: 20,
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#ffffff",
			},
			{
				lightness: 17,
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#ffffff",
			},
			{
				lightness: 29,
			},
			{
				weight: 0.2,
			},
		],
	},
	{
		featureType: "road.arterial",
		elementType: "geometry",
		stylers: [
			{
				color: "#ffffff",
			},
			{
				lightness: 18,
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "geometry",
		stylers: [
			{
				color: "#ffffff",
			},
			{
				lightness: 16,
			},
		],
	},
	{
		featureType: "poi",
		elementType: "geometry",
		stylers: [
			{
				color: "#f5f5f5",
			},
			{
				lightness: 21,
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "geometry",
		stylers: [
			{
				color: "#dedede",
			},
			{
				lightness: 21,
			},
		],
	},
	{
		elementType: "labels.text.stroke",
		stylers: [
			{
				visibility: "on",
			},
			{
				color: "#ffffff",
			},
			{
				lightness: 16,
			},
		],
	},
	{
		elementType: "labels.text.fill",
		stylers: [
			{
				saturation: 36,
			},
			{
				color: "#333333",
			},
			{
				lightness: 40,
			},
		],
	},
	{
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "geometry",
		stylers: [
			{
				color: "#f2f2f2",
			},
			{
				lightness: 19,
			},
		],
	},
	{
		featureType: "administrative",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#fefefe",
			},
			{
				lightness: 20,
			},
		],
	},
	{
		featureType: "administrative",
		elementType: "geometry.stroke",
		stylers: [
			{
				color: "#fefefe",
			},
			{
				lightness: 17,
			},
			{
				weight: 1.2,
			},
		],
	},
];

export default mapStyles;