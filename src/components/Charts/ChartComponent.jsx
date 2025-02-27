/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";
import {
	ChartComponent as SyncfusionChart,
	SeriesCollectionDirective,
	SeriesDirective,
	Inject,
	Legend,
	Category,
	Tooltip,
	DataLabel,
	LineSeries,
} from "@syncfusion/ej2-react-charts";

/**
 * ChartComponent - Reusable chart component wrapper
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.id - Chart ID
 * @param {Object[]} props.data - Chart data
 * @param {string} props.xName - X-axis field name
 * @param {string} props.yName - Y-axis field name
 * @param {string} props.type - Chart type
 * @param {string} props.title - Chart title
 * @returns {React.ReactElement} Rendered ChartComponent
 */
const ChartComponent = ({
	id,
	data,
	xName,
	yName,
	type,
	title,
	legendSettings,
	markerSettings,
	tooltipSettings,
	primaryXAxis,
	primaryYAxis,
}) => {
	return (
		<SyncfusionChart
			id={id}
			primaryXAxis={primaryXAxis}
			primaryYAxis={primaryYAxis}
			chartArea={{ border: { width: 0 } }}
			tooltip={{ enable: true }}
			legendSettings={legendSettings}
			title={title}
		>
			<Inject services={[Legend, Category, Tooltip, DataLabel, LineSeries]} />
			<SeriesCollectionDirective>
				<SeriesDirective
					dataSource={data}
					xName={xName}
					yName={yName}
					type={type}
					marker={markerSettings}
					tooltipSettings={tooltipSettings}
				/>
			</SeriesCollectionDirective>
		</SyncfusionChart>
	);
};

ChartComponent.propTypes = {
	id: PropTypes.string.isRequired,
	data: PropTypes.arrayOf(PropTypes.object).isRequired,
	xName: PropTypes.string.isRequired,
	yName: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	title: PropTypes.string,
	legendSettings: PropTypes.object,
	markerSettings: PropTypes.object,
	tooltipSettings: PropTypes.object,
	primaryXAxis: PropTypes.object,
	primaryYAxis: PropTypes.object,
};

ChartComponent.defaultProps = {
	title: "",
	legendSettings: { visible: true },
	markerSettings: { visible: true },
	tooltipSettings: { enable: true },
	primaryXAxis: {
		valueType: "Category",
		labelFormat: "y",
		majorGridLines: { width: 0 },
		background: "white",
	},
	primaryYAxis: {
		labelFormat: "{value}",
		lineStyle: { width: 0 },
		majorTickLines: { width: 0 },
		minorTickLines: { width: 0 },
	},
};

export default memo(ChartComponent); 