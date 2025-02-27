/* eslint-disable */
import React, { memo } from "react";
import { pieChartData } from "../../data/dummy";
import { ChartsHeader, Pie } from "..";

/**
 * PieChart - Pie chart page component
 *
 * @component
 * @returns {React.ReactElement} Rendered PieChart component
 */
const PieChart = () => {
	return (
		<div className="m-4 md:m-10 mt-24 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
			<ChartsHeader category="Pie" title="Project Cost Breakdown" />
			<div className="w-full">
				<Pie id="pie-chart" data={pieChartData} height="full" width="full" />
			</div>
		</div>
	);
};

export default memo(PieChart); 