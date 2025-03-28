/* eslint-disable */
import React from "react";

/**
 * Header component that displays a title and optionally a category.
 *
 * @param {Object} props - The props object.
 * @param {string} props.category - The category text to display (currently commented out).
 * @param {string} props.title - The title text to display.
 * @returns {JSX.Element} The rendered Header component.
 */
const Header = ({ category, title }) => (
	<div className="mb-2 flex-start ml-3">
		{/* <p className="text-lg text-gray-400">{category}</p> */}
		<p className="text-3xl font-extrabold tracking-tight text-slate-900">
			{title}
		</p>
	</div>
);

export default Header;
