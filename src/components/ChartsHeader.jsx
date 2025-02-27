/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";

/**
 * ChartsHeader - Reusable header component for charts
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.category - Category label for the chart
 * @param {string} props.title - Main title text
 * @returns {React.ReactElement} Rendered ChartsHeader component
 */
const ChartsHeader = ({ category, title }) => {
	return (
		<div className="mb-10">
			<div>
				<p className="text-lg text-gray-400">{category}</p>
				<p className="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-slate-900">
					{title}
				</p>
			</div>
		</div>
	);
};

ChartsHeader.propTypes = {
	category: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
};

export default memo(ChartsHeader); 