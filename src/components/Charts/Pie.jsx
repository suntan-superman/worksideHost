/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	AccumulationChartComponent,
	AccumulationSeriesCollectionDirective,
	AccumulationSeriesDirective,
	AccumulationLegend,
	PieSeries,
	AccumulationDataLabel,
	Inject,
	AccumulationTooltip,
} from "@syncfusion/ej2-react-charts";

import { UseStateContext } from "../../contexts/ContextProvider";

/**
 * Pie - Pie chart component for data visualization
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object[]} props.data - Chart data
 * @param {string} props.id - Chart ID
 * @param {number} props.height - Chart height
 * @param {number} props.width - Chart width
 * @returns {React.ReactElement} Rendered Pie component
 */
const Pie = ({ data, id, height, width }) => {
	const { currentMode } = UseStateContext();

	return (
		<AccumulationChartComponent
			id={id}
			height={height}
			width={width}
			tooltip={{ enable: true }}
			background={currentMode === "Dark" ? "#33373E" : "#fff"}
			legendSettings={{ visible: true, background: "white" }}
		>
			<Inject
				services={[
					AccumulationLegend,
					PieSeries,
					AccumulationDataLabel,
					AccumulationTooltip,
				]}
			/>
			<AccumulationSeriesCollectionDirective>
				<AccumulationSeriesDirective
					name="Sale"
					dataSource={data}
					xName="x"
					yName="y"
					innerRadius="40%"
					startAngle={0}
					endAngle={360}
					radius="70%"
					explode
					explodeOffset="10%"
					explodeIndex={2}
					dataLabel={{
						visible: true,
						name: "text",
						position: "Inside",
						font: {
							fontWeight: "600",
							color: "#fff",
						},
					}}
				/>
			</AccumulationSeriesCollectionDirective>
		</AccumulationChartComponent>
	);
};

Pie.propTypes = {
	id: PropTypes.string.isRequired,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.string,
			y: PropTypes.number,
			text: PropTypes.string,
		}),
	).isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default memo(Pie); 