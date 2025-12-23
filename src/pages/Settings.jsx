/* eslint-disable */
import React from "react";

/**
 * Settings component renders a settings page layout.
 *
 * @component
 * @returns {JSX.Element} A React component displaying the settings page with a title.
 */
const Settings = () => {
	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<b className="absolute top-[10px] left-[10px] text-xl">Settings</b>
		</div>
	);
};

export default Settings;
