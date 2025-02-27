/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	ChartComponent,
	SeriesCollectionDirective,
	SeriesDirective,
	Inject,
	LineSeries,
	DateTime,
	Legend,
	Tooltip,
} from "@syncfusion/ej2-react-charts";

import {
	lineCustomSeries,
	LinePrimaryXAxis,
	LinePrimaryYAxis,
} from "../../data/dummy";
import { UseStateContext } from "../../contexts/ContextProvider";

/**
 * LineChart - Line chart component for data visualization
 *
 * @component
 * @returns {React.ReactElement} Rendered LineChart component
 */
const LineChart = () => {
	const { currentMode } = UseStateContext();

	return (
		<ChartComponent
			id="line-chart"
			height="420px"
			primaryXAxis={LinePrimaryXAxis}
			primaryYAxis={LinePrimaryYAxis}
			chartArea={{ border: { width: 0 } }}
			tooltip={{ enable: true }}
			background={currentMode === "Dark" ? "#33373E" : "#fff"}
			legendSettings={{ background: "white" }}
		>
			<Inject services={[LineSeries, DateTime, Legend, Tooltip]} />
			<SeriesCollectionDirective>
				{lineCustomSeries.map((item) => (
					<SeriesDirective key={`line-series-${item.name}`} {...item} />
				))}
			</SeriesCollectionDirective>
		</ChartComponent>
	);
};

export default memo(LineChart); 