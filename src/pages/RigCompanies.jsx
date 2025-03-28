/* eslint-disable indent */
import React from "react";
import { Header } from '../components';

/**
 * RigCompanies component renders a page section with a header and a styled container.
 *
 * @component
 * @returns {JSX.Element} A React component that displays the "Rig Companies" page.
 *
 * @example
 * // Usage
 * <RigCompanies />
 *
 * @remarks
 * - The component uses a `Header` component to display the title and category.
 * - The container has a fixed height of 768px and uses Tailwind CSS classes for styling.
 */
const RigCompanies = () => {
	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			{/* <b className="absolute top-[10px] left-[10px] text-xl">Dashboard</b> */}
			<Header category="Workside" title="Rig Companies" />
		</div>
	);
}

export default RigCompanies;

