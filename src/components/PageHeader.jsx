/* eslint-disable */
import React, { memo } from "react";
import PropTypes from "prop-types";

/**
 * PageHeader - Reusable header component for pages
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.category - Category label for the page
 * @param {string} props.title - Main title text
 * @param {React.ReactNode} [props.children] - Optional additional content
 * @returns {React.ReactElement} Rendered PageHeader component
 */
/**
 * A reusable component for rendering a page header with a category, title, and optional children.
 *
 * @param {Object} props - The props object.
 * @param {string} props.category - The category text displayed in the header.
 * @param {string} props.title - The title text displayed in the header.
 * @param {React.ReactNode} [props.children] - Optional children elements to render below the title.
 * @returns {JSX.Element} The rendered PageHeader component.
 */
const PageHeader = ({ category, title, children }) => {
	return (
		<div className="mb-10">
			<div>
				<p className="text-lg text-gray-400">{category}</p>
				<p className="text-3xl font-extrabold tracking-tight dark:text-gray-200 text-slate-900">
					{title}
				</p>
			</div>
			{children && <div className="mt-4">{children}</div>}
		</div>
	);
};

PageHeader.propTypes = {
	category: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	children: PropTypes.node,
};

PageHeader.defaultProps = {
	children: null,
};

export default memo(PageHeader); 