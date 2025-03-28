/* eslint-disable */
import React from "react";
import { toast } from "react-toastify";

/**
 * Displays a toast notification with a custom message and a button.
 *
 * @param {string} message - The message to display in the toast notification.
 * @returns {void} - This function does not return a value.
 */
const WorksideToast = (message) => {
	return toast(
		<div>
			{message}
			<button type="button" onClick={() => console.log("Button clicked!")}>
				Click me
			</button>
		</div>,
	);
};

export default WorksideToast;
