/* eslint-disable */
import React from "react";
import { toast } from "react-toastify";

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
