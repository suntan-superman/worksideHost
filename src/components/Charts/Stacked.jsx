/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	ChartComponent,
	SeriesCollectionDirective,
	SeriesDirective,
	Inject,
	Legend,
	Category,
	StackingColumnSeries,
	Tooltip,
} from "@syncfusion/ej2-react-charts";

/**
 * Stacked - Stacked chart component for data visualization
 *
 * @component
 * @param {Object} props - Component props
 * @param {number} props.width - Chart width
 * @param {number} props.height - Chart height
 * @param {Object[]} props.data - Chart data
 * @returns {React.ReactElement} Rendered Stacked component
 */
const Stacked = ({ width, height, data }) => {
	const stackedPrimaryXAxis = {
		majorGridLines: { width: 0 },
		minorGridLines: { width: 0 },
		majorTickLines: { width: 0 },
		minorTickLines: { width: 0 },
		interval: 1,
		lineStyle: { width: 0 },
		labelIntersectAction: "Rotate45",
		valueType: "Category",
	};

	const stackedPrimaryYAxis = {
		lineStyle: { width: 0 },
		minimum: 0,
		maximum: 100,
		interval: 20,
		majorTickLines: { width: 0 },
		majorGridLines: { width: 1 },
		minorGridLines: { width: 1 },
		minorTickLines: { width: 0 },
		labelFormat: "{value}%",
	};

	const customSeries = [
		{
			dataSource: data,
			xName: "x",
			yName: "y",
			name: "Budget",
			type: "StackingColumn",
			background: "blue",
		},
		{
			dataSource: data,
			xName: "x",
			yName: "y1",
			name: "Expense",
			type: "StackingColumn",
			background: "red",
		},
	];

	return (
		<ChartComponent
			id="stacked-chart"
			width={width}
			height={height}
			primaryXAxis={stackedPrimaryXAxis}
			primaryYAxis={stackedPrimaryYAxis}
			chartArea={{ border: { width: 0 } }}
			tooltip={{ enable: true }}
			legendSettings={{ background: "white" }}
		>
			<Inject services={[Legend, Category, StackingColumnSeries, Tooltip]} />
			<SeriesCollectionDirective>
				{customSeries.map((item) => (
					<SeriesDirective key={`stacked-series-${item.name}`} {...item} />
				))}
			</SeriesCollectionDirective>
		</ChartComponent>
	);
};

Stacked.propTypes = {
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	data: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.string,
			y: PropTypes.number,
			y1: PropTypes.number,
		}),
	).isRequired,
};

export default memo(Stacked); 