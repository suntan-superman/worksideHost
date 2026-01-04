/* eslint-disable */
import React from "react";
import { APP_INFO } from "../constants/appInfo";

/**
 * Footer component that displays a copyright notice.
 *
 * @component
 * @returns {JSX.Element} A footer section with a copyright message.
 */
const Footer = () => (
	<div className="mt-24">
		<p className="dark:text-gray-200 text-gray-700 text-center m-20">
			© {APP_INFO.COPYRIGHT_YEAR} All rights reserved by {APP_INFO.COMPANY_WEBSITE}
		</p>
	</div>
);

export default Footer;
