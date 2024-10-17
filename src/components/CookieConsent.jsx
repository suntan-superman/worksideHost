/* eslint-disable */
import React, { useState } from "react";
import { useCookies } from "react-cookie";

const CookieConsent = () => {
	const [cookies, setCookie] = useCookies(["cookieConsent"]);
	const giveCookieConsent = () => {
		setCookie("cookieConsent", true, { path: "/" });
	};

	return (
		<div className="cookie-consent">
			<p className="text-black text-lg">
				We use cookies to enhance your user experience. By using our website,
				you agree to our use of cookies.{" "}
				{/* <a href={"/privacy-policy"}>Learn more.</a> */}
			</p>
			<button
				className="text-green-500 text-lg"
				type="button"
				onClick={giveCookieConsent}
			>
				Accept
			</button>
		</div>
	);
};

export default CookieConsent;
