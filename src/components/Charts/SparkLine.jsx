/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	SparklineComponent,
	Inject,
	SparklineTooltip,
} from "@syncfusion/ej2-react-charts";

/**
 * SparkLine - Sparkline chart component for compact data visualization
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.id - Chart ID
 * @param {number} props.height - Chart height
 * @param {number} props.width - Chart width
 * @param {string} props.color - Line color
 * @param {Object[]} props.data - Chart data
 * @param {string} props.type - Chart type
 * @param {string} props.currentColor - Current theme color
 * @returns {React.ReactElement} Rendered SparkLine component
 */
const SparkLine = ({ id, height, width, color, data, type, currentColor }) => {
	const chartConfig = {
		id,
		height,
		width,
		lineWidth: 1,
		valueType: "Numeric",
		fill: color,
		border: { color: currentColor, width: 2 },
		tooltipSettings: {
			visible: true,
			format: "${x} : ${yval}",
			trackLineSettings: {
				visible: true,
			},
		},
		dataSource: data,
		xName: "x",
		yName: "yval",
		type,
	};

	return (
		<SparklineComponent {...chartConfig}>
			<Inject services={[SparklineTooltip]} />
		</SparklineComponent>
	);
};

SparkLine.propTypes = {
	id: PropTypes.string.isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	color: PropTypes.string,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.number,
			yval: PropTypes.number,
		}),
	).isRequired,
	type: PropTypes.string,
	currentColor: PropTypes.string,
};

SparkLine.defaultProps = {
	color: "#fff",
	type: "Line",
	currentColor: "#fff",
};

export default memo(SparkLine); 