/* eslint-disable */
import React from "react";

import { UseStateContext } from "../contexts/ContextProvider";

/**
 * Button component renders a customizable button element with various styles and behaviors.
 *
 * @param {Object} props - The properties object.
 * @param {JSX.Element} [props.icon] - The icon to be displayed inside the button.
 * @param {string} [props.bgColor] - The background color of the button.
 * @param {string} [props.color] - The text color of the button.
 * @param {string} [props.bgHoverColor] - The background color of the button on hover.
 * @param {string} [props.size] - The font size of the button text (e.g., "sm", "md", "lg").
 * @param {string} [props.text] - The text to be displayed inside the button.
 * @param {string} [props.borderRadius] - The border radius of the button.
 * @param {string} [props.width] - The width of the button (e.g., "full", "auto").
 *
 * @returns {JSX.Element} A styled button component.
 */
const Button = ({
	icon,
	bgColor,
	color,
	bgHoverColor,
	size,
	text,
	borderRadius,
	width,
}) => {
	const { setIsClicked, initialState } = UseStateContext();

	return (
		<button
			type="button"
			onClick={() => setIsClicked(initialState)}
			style={{ backgroundColor: bgColor, color, borderRadius }}
			className={` text-${size} p-3 w-${width} hover:drop-shadow-xl hover:bg-${bgHoverColor}`}
		>
			{icon} {text}
		</button>
	);
};

export default Button;
