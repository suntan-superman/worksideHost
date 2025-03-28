/* eslint-disable */
import React from "react";
import { Header } from "../components";

/**
 * Notifications component renders a page with a header and a styled container.
 *
 * @component
 * @returns {JSX.Element} The rendered Notifications page component.
 *
 * @example
 * // Usage
 * <Notifications />
 */
const Notifications = () => {
	return (
		<div className="relative bg-gainsboro-100 w-full h-[768px] overflow-hidden text-left text-lg text-black font-paragraph-button-text">
			<Header category="Workside" title="Notifications" />
		</div>
	);
};

export default Notifications;
